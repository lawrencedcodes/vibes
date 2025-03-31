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
@Table(name = "assessment_questions")
public class AssessmentQuestion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "assessment_type", nullable = false, length = 50)
    private String assessmentType;
    
    @Column(name = "question_text", nullable = false)
    private String questionText;
    
    @Column(name = "question_type", nullable = false, length = 20)
    private String questionType; // MULTIPLE_CHOICE, SCALE, TEXT
    
    @Column(columnDefinition = "json")
    private String options;
    
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
