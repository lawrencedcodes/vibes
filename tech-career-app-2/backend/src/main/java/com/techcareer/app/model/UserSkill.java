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
@Table(name = "user_skills")
public class UserSkill {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;
    
    @Column(name = "proficiency_level", nullable = false, length = 20)
    private String proficiencyLevel; // Beginner, Intermediate, Advanced
    
    @Column(name = "is_strength")
    private Boolean isStrength = false;
    
    @Column(name = "is_interest")
    private Boolean isInterest = false;
    
    @Column(name = "is_weakness")
    private Boolean isWeakness = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
