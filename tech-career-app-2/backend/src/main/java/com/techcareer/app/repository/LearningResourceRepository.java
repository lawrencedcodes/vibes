package com.techcareer.app.repository;

import com.techcareer.app.model.LearningResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningResourceRepository extends JpaRepository<LearningResource, Long> {
    List<LearningResource> findByResourceType(String resourceType);
    List<LearningResource> findByCostType(String costType);
    List<LearningResource> findByDifficultyLevel(String difficultyLevel);
    List<LearningResource> findByTitleContainingIgnoreCase(String title);
    List<LearningResource> findByProviderContainingIgnoreCase(String provider);
}
