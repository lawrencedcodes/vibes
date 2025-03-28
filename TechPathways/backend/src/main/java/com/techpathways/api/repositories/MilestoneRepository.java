package com.techpathways.api.repositories;

import com.techpathways.api.models.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, Long> {
    List<Milestone> findByLearningPlanId(Long learningPlanId);
    List<Milestone> findByLearningPlanIdOrderByOrderIndex(Long learningPlanId);
}
