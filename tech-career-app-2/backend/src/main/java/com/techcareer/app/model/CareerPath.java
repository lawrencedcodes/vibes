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
@Table(name = "career_paths")
public class CareerPath {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 100)
    private String name;
    
    @Column(nullable = false)
    private String description;
    
    @Column(name = "required_skills", nullable = false)
    private String requiredSkills;
    
    @Column(name = "average_salary_range", length = 100)
    private String averageSalaryRange;
    
    @Column(name = "market_demand", length = 50)
    private String marketDemand; // High, Medium, Low
    
    @Column(name = "growth_potential")
    private String growthPotential;
    
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
