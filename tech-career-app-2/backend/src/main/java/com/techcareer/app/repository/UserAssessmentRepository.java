package com.techcareer.app.repository;

import com.techcareer.app.model.UserAssessment;
import com.techcareer.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAssessmentRepository extends JpaRepository<UserAssessment, Long> {
    List<UserAssessment> findByUser(User user);
    List<UserAssessment> findByUserAndAssessmentType(User user, String assessmentType);
    Optional<UserAssessment> findTopByUserAndAssessmentTypeOrderByCompletedAtDesc(User user, String assessmentType);
}
