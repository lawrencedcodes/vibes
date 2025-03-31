package com.techcareer.app.repository;

import com.techcareer.app.model.CareerRecommendation;
import com.techcareer.app.model.User;
import com.techcareer.app.model.JobRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CareerRecommendationRepository extends JpaRepository<CareerRecommendation, Long> {
    List<CareerRecommendation> findByUser(User user);
    List<CareerRecommendation> findByUserOrderByMatchPercentageDesc(User user);
    Optional<CareerRecommendation> findByUserAndJobRole(User user, JobRole jobRole);
}
