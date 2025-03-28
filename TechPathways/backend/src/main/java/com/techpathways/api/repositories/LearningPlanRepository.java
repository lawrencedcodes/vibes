package com.techpathways.api.repositories;

import com.techpathways.api.models.LearningPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearningPlanRepository extends JpaRepository<LearningPlan, Long> {
    List<LearningPlan> findByUserId(Long userId);
    Optional<LearningPlan> findByUserIdAndCareerPathId(Long userId, Long careerPathId);
}
