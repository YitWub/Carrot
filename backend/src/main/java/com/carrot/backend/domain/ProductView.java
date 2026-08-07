package com.carrot.backend.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "product_id"})
    }
)
public class ProductView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private LocalDateTime viewedAt = LocalDateTime.now();

    public ProductView() {}

    public ProductView(User user, Product product) {
        this.user = user;
        this.product = product;
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public Product getProduct() { return product; }
    public LocalDateTime getViewedAt() { return viewedAt; }
}
