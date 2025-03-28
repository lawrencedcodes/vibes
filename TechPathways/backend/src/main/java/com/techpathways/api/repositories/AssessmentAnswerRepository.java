package com.techpathways.api.repositories;

import com.techpathways.api.models.AssessmentAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentAnswerRepository extends JpaRepository<AssessmentAnswer, Long> {
    List<AssessmentAnswer> findByAssessmentId(Long assessmentId);
    List<AssessmentAnswer> findByQuestionId(Long questionId);
}
