package com.carrot.backend.controller;

import com.carrot.backend.domain.ChatMessage;
import com.carrot.backend.domain.ChatRoom;
import com.carrot.backend.service.ChatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/room")
    public ChatRoom enterRoom(@RequestParam Long productId, @RequestParam Long buyerId) {
        return chatService.getOrCreateRoom(productId, buyerId);
    }

    @PostMapping("/message")
    public ChatMessage sendMessage(@RequestParam Long roomId, @RequestParam Long senderId, @RequestBody String text) {
        return chatService.sendMessage(roomId, senderId, text);
    }

    @GetMapping("/room/{roomId}")
    public List<ChatMessage> getMessages(@PathVariable Long roomId) {
        return chatService.getMessages(roomId);
    }

    @GetMapping("/my-rooms")
    public List<ChatRoom> getMyRooms(@RequestParam Long userId) {
        return chatService.getMyRooms(userId);
    }
}
