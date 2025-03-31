package com.techcareer.app.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "learning_resources")
public class LearningResource {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private String description;
    
    @Column(name = "resource_type", nullable = false, length = 50)
    private String resourceType; // Course, Tutorial, Book, Video, etc.
    
    @Column
    private String url;
    
    @Column(length = 100)
    private String provider;
    
    @Column(name = "cost_type", nullable = false, length = 20)
    private String costType; // Free, Paid, Freemium
    
    @Column(name = "cost_amount")
    private Double costAmount;
    
    @Column(name = "difficulty_level", nullable = false, length = 20)
    private String difficultyLevel; // Beginner, Intermediate, Advanced
    
    @Column(name = "estimated_hours")
    private Integer estimatedHours;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
