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
@Table(name = "job_roles")
public class JobRole {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "career_path_id")
    private CareerPath careerPath;
    
    @Column(nullable = false, length = 100)
    private String title;
    
    @Column(nullable = false)
    private String description;
    
    @Column(nullable = false)
    private String responsibilities;
    
    @Column(name = "required_skills", nullable = false)
    private String requiredSkills;
    
    @Column(name = "preferred_skills")
    private String preferredSkills;
    
    @Column(name = "average_salary_range", length = 100)
    private String averageSalaryRange;
    
    @Column(name = "market_demand", length = 50)
    private String marketDemand; // High, Medium, Low
    
    @Column(name = "entry_level_friendly")
    private Boolean entryLevelFriendly = false;
    
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
