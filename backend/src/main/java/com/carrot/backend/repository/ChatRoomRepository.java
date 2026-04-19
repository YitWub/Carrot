package com.carrot.backend.repository;

import com.carrot.backend.domain.ChatRoom;
import com.carrot.backend.domain.Product;
import com.carrot.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findByProductAndBuyer(Product product, User buyer);
    List<ChatRoom> findByBuyerIdOrProductSellerId(Long buyerId, Long sellerId);
}
