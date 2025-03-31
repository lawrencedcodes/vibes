package com.techcareer.app.repository;

import com.techcareer.app.model.AssessmentQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentQuestionRepository extends JpaRepository<AssessmentQuestion, Long> {
    List<AssessmentQuestion> findByAssessmentType(String assessmentType);
    List<AssessmentQuestion> findByAssessmentTypeOrderByOrderIndexAsc(String assessmentType);
}
