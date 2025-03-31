package com.techcareer.app.repository;

import com.techcareer.app.model.LearningPlan;
import com.techcareer.app.model.User;
import com.techcareer.app.model.JobRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningPlanRepository extends JpaRepository<LearningPlan, Long> {
    List<LearningPlan> findByUser(User user);
    List<LearningPlan> findByUserAndStatus(User user, String status);
    List<LearningPlan> findByTargetJobRole(JobRole jobRole);
}
