package com.techpathways.api.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "career_paths")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CareerPath {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "salary_range")
    private String salaryRange;

    @Column(name = "demand_level")
    private String demandLevel;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(name = "growth_path", columnDefinition = "TEXT")
    private String growthPath;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
