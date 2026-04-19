package com.carrot.backend.service;

import com.carrot.backend.domain.*;
import com.carrot.backend.repository.*;
import org.springframework.stereotype.Service;
import java.util.List;

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

    public ChatRoom getOrCreateRoom(Long productId, Long buyerId) {
        Product product = productRepository.findById(productId).orElseThrow();
        User buyer = userRepository.findById(buyerId).orElseThrow();

        return chatRoomRepository.findByProductAndBuyer(product, buyer)
                .orElseGet(() -> {
                    ChatRoom newRoom = new ChatRoom();
                    newRoom.setProduct(product);
                    newRoom.setBuyer(buyer);
                    return chatRoomRepository.save(newRoom);
                });
    }

    public ChatMessage sendMessage(Long roomId, Long senderId, String text) {
        ChatRoom room = chatRoomRepository.findById(roomId).orElseThrow();
        User sender = userRepository.findById(senderId).orElseThrow();

        ChatMessage msg = new ChatMessage();
        msg.setChatRoom(room);
        msg.setSender(sender);
        msg.setMessage(text);

        return chatMessageRepository.save(msg);
    }

    public List<ChatMessage> getMessages(Long roomId) {
        ChatRoom room = chatRoomRepository.findById(roomId).orElseThrow();
        return chatMessageRepository.findByChatRoomOrderByCreatedAtAsc(room);
    }

    public List<ChatRoom> getMyRooms(Long userId) {
        return chatRoomRepository.findByBuyerIdOrProductSellerId(userId, userId);
    }
}
