package com.techcareer.app.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "learning_plan_milestones")
public class LearningPlanMilestone {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "learning_plan_id", nullable = false)
    private LearningPlan learningPlan;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private String description;
    
    @Column(name = "start_date")
    private LocalDate startDate;
    
    @Column(name = "end_date")
    private LocalDate endDate;
    
    @Column(length = 20)
    private String status = "PENDING"; // PENDING, IN_PROGRESS, COMPLETED
    
    @Column(name = "milestone_type", nullable = false, length = 50)
    private String milestoneType; // LEARNING, PROJECT, NETWORKING, INTERVIEW_PREP, RESUME, PORTFOLIO
    
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;
    
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
