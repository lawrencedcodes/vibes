package com.techpathways.api.repositories;

import com.techpathways.api.models.CareerRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CareerRecommendationRepository extends JpaRepository<CareerRecommendation, Long> {
    List<CareerRecommendation> findByUserId(Long userId);
    List<CareerRecommendation> findByUserIdOrderByMatchPercentageDesc(Long userId);
    List<CareerRecommendation> findByCareerPathId(Long careerPathId);
}
