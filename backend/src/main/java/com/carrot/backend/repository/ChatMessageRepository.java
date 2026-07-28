package com.carrot.backend.repository;

import com.carrot.backend.domain.ChatMessage;
import com.carrot.backend.domain.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.carrot.backend.domain.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByChatRoomOrderByCreatedAtAsc(ChatRoom chatRoom);

    java.util.Optional<ChatMessage> findFirstByChatRoomOrderByCreatedAtDesc(ChatRoom chatRoom);

    @Modifying
    @Query("""
            UPDATE ChatMessage m
            SET m.isRead = true
            WHERE m.chatRoom = :room
            AND m.sender != :user
            AND m.isRead = false
            """)
    void markMessagesAsRead(@Param("room") ChatRoom room, @Param("user") User currentUser);
}
