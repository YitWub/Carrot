package com.carrot.backend.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User reviewer;

    @ManyToOne(fetch = FetchType.LAZY)
    private User reviewee;

    @ManyToOne(fetch = FetchType.LAZY)
    private Product product;

    @Column(nullable = false)
    private Double score;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Review() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getReviewer() { return reviewer; }
    public void setReviewer(User reviewer) { this.reviewer = reviewer; }

    public User getReviewee() { return reviewee; }
    public void setReviewee(User reviewee) { this.reviewee = reviewee; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
