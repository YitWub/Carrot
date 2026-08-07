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
    private final ReviewRepository reviewRepository;

    public ChatService(ChatRoomRepository chatRoomRepository, ChatMessageRepository chatMessageRepository, 
                       ProductRepository productRepository, UserRepository userRepository,
                       ReviewRepository reviewRepository) {
        this.chatRoomRepository = chatRoomRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
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

    @Transactional
    public List<ChatMessageResponse> getMessages(Long roomId, Long userId) {
        ChatRoom room = chatRoomRepository.findById(roomId).orElseThrow();
        User currentUser = userRepository.findById(userId).orElseThrow();
        
        validateRoomParticipant(room, userId);

        // 사용자가 채팅방에서 메시지를 조회하면, 상대방이 보낸 메시지 중 안 읽은 것이 있을 때만 읽음 처리
        int unreadCount = chatMessageRepository.countUnreadInRoom(room.getId(), userId);
        if (unreadCount > 0) {
            chatMessageRepository.markMessagesAsRead(room, userId);
        }

        return chatMessageRepository.findByChatRoomOrderByCreatedAtAsc(room).stream()
                .map(msg -> new ChatMessageResponse(msg.getId(), msg.getSender().getId(), msg.getMessage(), msg.getIsRead(), msg.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ChatRoomListResponse> getMyRooms(Long userId) {
        List<ChatRoom> rooms = chatRoomRepository.findByBuyerIdOrProductSellerId(userId, userId);

        List<ChatRoomListResponse> responseList = rooms.stream().map(room -> {
            boolean isBuyer = room.getBuyer().getId().equals(userId);
            User partner = isBuyer ? room.getProduct().getSeller() : room.getBuyer();

            String thumbnailUrl = null;
            if (room.getProduct().getImages() != null && !room.getProduct().getImages().isEmpty()) {
                thumbnailUrl = room.getProduct().getImages().get(0).getImageUrl();
            }

            Optional<ChatMessage> lastMessageOpt = chatMessageRepository.findFirstByChatRoomOrderByCreatedAtDesc(room);
            String lastMessage = lastMessageOpt.map(ChatMessage::getMessage).orElse("");
            java.time.LocalDateTime lastMessageTime = lastMessageOpt.map(ChatMessage::getCreatedAt).orElse(null);

            User currentUser = userRepository.findById(userId).orElseThrow();
            int unreadCount = chatMessageRepository.countUnreadInRoom(room.getId(), userId);

            return new ChatRoomListResponse(
                    room.getId(),
                    room.getProduct().getId(),
                    room.getProduct().getTitle(),
                    thumbnailUrl,
                    partner.getId(),
                    partner.getNickname(),
                    partner.getProfileImageUrl(),
                    lastMessage,
                    lastMessageTime,
                    unreadCount
            );
        }).collect(Collectors.toList());

        responseList.sort((r1, r2) -> {
            if (r1.lastMessageTime() == null && r2.lastMessageTime() == null) return 0;
            if (r1.lastMessageTime() == null) return 1;
            if (r2.lastMessageTime() == null) return -1;
            return r2.lastMessageTime().compareTo(r1.lastMessageTime());
        });

        return responseList;
    }

    @Transactional(readOnly = true)
    public int getUnreadCount(Long userId) {
        return chatMessageRepository.countUnreadMessages(userId);
    }

    @Transactional
    public void markAsRead(Long roomId, Long userId) {
        ChatRoom room = chatRoomRepository.findById(roomId).orElseThrow();
        User currentUser = userRepository.findById(userId).orElseThrow();
        
        validateRoomParticipant(room, userId);
        
        chatMessageRepository.markMessagesAsRead(room, userId);
    }

    @Transactional(readOnly = true)
    public ChatRoomDetailResponse getRoomDetail(Long roomId, Long userId) {
        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("채팅방을 찾을 수 없습니다."));
        
        validateRoomParticipant(room, userId);

        boolean isBuyer = room.getBuyer().getId().equals(userId);
        User partner = isBuyer ? room.getProduct().getSeller() : room.getBuyer();

        String thumbnailUrl = null;
        if (room.getProduct().getImages() != null && !room.getProduct().getImages().isEmpty()) {
            thumbnailUrl = room.getProduct().getImages().get(0).getImageUrl();
        }

        boolean isProductSold = "SOLD".equals(room.getProduct().getStatus());
        boolean isSeller = room.getProduct().getSeller().getId().equals(userId);
        
        User currentUser = userRepository.findById(userId).orElseThrow();
        boolean hasReviewed = reviewRepository.existsByReviewerAndProduct(currentUser, room.getProduct());

        return new ChatRoomDetailResponse(
                room.getId(),
                room.getProduct().getId(),
                room.getProduct().getTitle(),
                room.getProduct().getPrice(),
                thumbnailUrl,
                partner.getId(),
                partner.getNickname(),
                partner.getProfileImageUrl(),
                partner.getMannerTemp(),
                isProductSold,
                isSeller,
                hasReviewed
        );
    }

    @Transactional
    public void completeChatRoom(Long roomId, Long userId) {
        ChatRoom room = chatRoomRepository.findById(roomId).orElseThrow(() -> new RuntimeException("채팅방을 찾을 수 없습니다."));
        
        if (!room.getProduct().getSeller().getId().equals(userId)) {
            throw new UnauthorizedAccessException("판매자만 거래를 완료할 수 있습니다.");
        }

        Product product = room.getProduct();
        product.setStatus("SOLD");
        productRepository.save(product);
    }
}
