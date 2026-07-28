package com.carrot.backend.controller;

import com.carrot.backend.dto.*;
import com.carrot.backend.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "${cors.allowed-origins}")
@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/rooms")
    public ResponseEntity<?> createRoom(
            @RequestHeader("X-User-Id") Long buyerId,
            @RequestBody ChatRoomRequest request) {
        try {
            ChatRoomResponse response = chatService.getOrCreateRoom(request.productId(), buyerId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PostMapping("/rooms/{roomId}/messages")
    public ResponseEntity<?> sendMessage(
            @PathVariable Long roomId,
            @RequestHeader("X-User-Id") Long senderId,
            @RequestBody ChatMessageRequest request) {
        try {
            ChatMessageResponse response = chatService.sendMessage(roomId, senderId, request.text());
            return ResponseEntity.ok(response);
        } catch (com.carrot.backend.exception.UnauthorizedAccessException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<?> getMessages(
            @PathVariable Long roomId,
            @RequestHeader("X-User-Id") Long userId) {
        try {
            List<ChatMessageResponse> response = chatService.getMessages(roomId, userId);
            return ResponseEntity.ok(response);
        } catch (com.carrot.backend.exception.UnauthorizedAccessException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @GetMapping("/my-rooms")
    public ResponseEntity<List<ChatRoomListResponse>> getMyRooms(
            @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(chatService.getMyRooms(userId));
    }

    @PatchMapping("/rooms/{roomId}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long roomId,
            @RequestHeader("X-User-Id") Long userId) {
        try {
            chatService.markAsRead(roomId, userId);
            return ResponseEntity.ok().build();
        } catch (com.carrot.backend.exception.UnauthorizedAccessException e) {
            return ResponseEntity.status(403).build();
        }
    }
}
