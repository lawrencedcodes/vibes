package com.techpathways.api.repositories;

import com.techpathways.api.models.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByUserId(Long userId);
    Optional<Assessment> findByUserIdAndCompleted(Long userId, Boolean completed);
}
