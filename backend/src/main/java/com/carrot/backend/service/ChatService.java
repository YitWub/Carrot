package com.carrot.backend.service;

import com.carrot.backend.domain.*;
import com.carrot.backend.dto.*;
import com.carrot.backend.exception.UnauthorizedAccessException;
import com.carrot.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChatService {
    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ChatService(ChatRoomRepository chatRoomRepository, ChatMessageRepository chatMessageRepository, 
                       ProductRepository productRepository, UserRepository userRepository) {
        this.chatRoomRepository = chatRoomRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    private void validateRoomParticipant(ChatRoom room, Long userId) {
        if (!room.getBuyer().getId().equals(userId) && !room.getProduct().getSeller().getId().equals(userId)) {
            throw new UnauthorizedAccessException("이 채팅방에 접근할 권한이 없습니다.");
        }
    }

    @Transactional
    public ChatRoomResponse getOrCreateRoom(Long productId, Long buyerId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (product.getSeller().getId().equals(buyerId)) {
            throw new IllegalArgumentException("자신의 상품에는 채팅을 할 수 없습니다.");
        }

        ChatRoom room = chatRoomRepository.findByProductAndBuyer(product, buyer)
                .orElseGet(() -> {
                    ChatRoom newRoom = new ChatRoom();
                    newRoom.setProduct(product);
                    newRoom.setBuyer(buyer);
                    return chatRoomRepository.save(newRoom);
                });

        return new ChatRoomResponse(room.getId(), product.getId(), buyer.getId(), product.getSeller().getId());
    }

    @Transactional
    public ChatMessageResponse sendMessage(Long roomId, Long senderId, String text) {
        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("채팅방을 찾을 수 없습니다."));
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        validateRoomParticipant(room, senderId);

        ChatMessage msg = new ChatMessage();
        msg.setChatRoom(room);
        msg.setSender(sender);
        msg.setMessage(text);
        // 기본적으로 안읽음(false) 상태가 됩니다.

        ChatMessage savedMsg = chatMessageRepository.save(msg);

        return new ChatMessageResponse(savedMsg.getId(), sender.getId(), savedMsg.getMessage(), savedMsg.getIsRead(), savedMsg.getCreatedAt());
    }

    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getMessages(Long roomId, Long userId) {
        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("채팅방을 찾을 수 없습니다."));
        
        validateRoomParticipant(room, userId);

        return chatMessageRepository.findByChatRoomOrderByCreatedAtAsc(room).stream()
                .map(msg -> new ChatMessageResponse(msg.getId(), msg.getSender().getId(), msg.getMessage(), msg.getIsRead(), msg.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ChatRoomListResponse> getMyRooms(Long userId) {
        List<ChatRoom> rooms = chatRoomRepository.findByBuyerIdOrProductSellerId(userId, userId);

        return rooms.stream().map(room -> {
            boolean isBuyer = room.getBuyer().getId().equals(userId);
            User partner = isBuyer ? room.getProduct().getSeller() : room.getBuyer();

            String thumbnailUrl = null;
            if (room.getProduct().getImages() != null && !room.getProduct().getImages().isEmpty()) {
                thumbnailUrl = room.getProduct().getImages().get(0).getImageUrl();
            }

            Optional<ChatMessage> lastMessageOpt = chatMessageRepository.findFirstByChatRoomOrderByCreatedAtDesc(room);
            String lastMessage = lastMessageOpt.map(ChatMessage::getMessage).orElse("");
            java.time.LocalDateTime lastMessageTime = lastMessageOpt.map(ChatMessage::getCreatedAt).orElse(null);

            return new ChatRoomListResponse(
                    room.getId(),
                    room.getProduct().getId(),
                    room.getProduct().getTitle(),
                    thumbnailUrl,
                    partner.getId(),
                    partner.getNickname(),
                    partner.getProfileImageUrl(),
                    lastMessage,
                    lastMessageTime
            );
        }).collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long roomId, Long userId) {
        ChatRoom room = chatRoomRepository.findById(roomId).orElseThrow();
        User currentUser = userRepository.findById(userId).orElseThrow();
        
        validateRoomParticipant(room, userId);
        
        chatMessageRepository.markMessagesAsRead(room, currentUser);
    }
}
