package com.techcareer.app.repository;

import com.techcareer.app.model.LearningPlanMilestone;
import com.techcareer.app.model.LearningPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningPlanMilestoneRepository extends JpaRepository<LearningPlanMilestone, Long> {
    List<LearningPlanMilestone> findByLearningPlan(LearningPlan learningPlan);
    List<LearningPlanMilestone> findByLearningPlanAndStatus(LearningPlan learningPlan, String status);
    List<LearningPlanMilestone> findByLearningPlanAndMilestoneType(LearningPlan learningPlan, String milestoneType);
    List<LearningPlanMilestone> findByLearningPlanOrderByOrderIndexAsc(LearningPlan learningPlan);
}
