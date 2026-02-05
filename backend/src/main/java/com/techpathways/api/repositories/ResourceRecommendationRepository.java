package com.techpathways.api.repositories;

import com.techpathways.api.models.ResourceRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRecommendationRepository extends JpaRepository<ResourceRecommendation, Long> {
    List<ResourceRecommendation> findByUserId(Long userId);
    List<ResourceRecommendation> findByUserIdOrderByRelevanceScoreDesc(Long userId);
    List<ResourceRecommendation> findByResourceId(Long resourceId);
}
