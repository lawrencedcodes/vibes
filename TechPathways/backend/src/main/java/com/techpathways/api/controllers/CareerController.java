package com.techpathways.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.techpathways.api.models.*;
import com.techpathways.api.payload.response.MessageResponse;
import com.techpathways.api.repositories.*;
import com.techpathways.api.security.services.UserDetailsImpl;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/career")
public class CareerController {
    @Autowired
    CareerPathRepository careerPathRepository;

    @Autowired
    CareerRecommendationRepository careerRecommendationRepository;

    @Autowired
    AssessmentRepository assessmentRepository;

    @Autowired
    AssessmentAnswerRepository assessmentAnswerRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/paths")
    public ResponseEntity<?> getAllCareerPaths() {
        List<CareerPath> careerPaths = careerPathRepository.findAll();
        return ResponseEntity.ok(careerPaths);
    }

    @GetMapping("/paths/{id}")
    public ResponseEntity<?> getCareerPathById(@PathVariable Long id) {
        Optional<CareerPath> careerPathOptional = careerPathRepository.findById(id);
        if (!careerPathOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Career path not found!"));
        }
        return ResponseEntity.ok(careerPathOptional.get());
    }

    @GetMapping("/recommendations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUserRecommendations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        List<CareerRecommendation> recommendations = 
            careerRecommendationRepository.findByUserIdOrderByMatchPercentageDesc(userDetails.getId());
        
        return ResponseEntity.ok(recommendations);
    }

    @PostMapping("/generate-recommendations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> generateRecommendations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<User> userOptional = userRepository.findById(userDetails.getId());
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found!"));
        }
        
        // Find the most recent completed assessment
        List<Assessment> assessments = assessmentRepository.findByUserId(userDetails.getId());
        Optional<Assessment> completedAssessment = assessments.stream()
            .filter(Assessment::getCompleted)
            .max(Comparator.comparing(Assessment::getCreatedAt));
        
        if (!completedAssessment.isPresent()) {
            return ResponseEntity.badRequest().body(
                new MessageResponse("Error: No completed assessment found. Please complete an assessment first."));
        }
        
        // Get all answers for this assessment
        List<AssessmentAnswer> answers = 
            assessmentAnswerRepository.findByAssessmentId(completedAssessment.get().getId());
        
        if (answers.isEmpty()) {
            return ResponseEntity.badRequest().body(
                new MessageResponse("Error: No answers found for the assessment."));
        }
        
        // Get all career paths
        List<CareerPath> careerPaths = careerPathRepository.findAll();
        
        // Delete existing recommendations for this user
        List<CareerRecommendation> existingRecommendations = 
            careerRecommendationRepository.findByUserId(userDetails.getId());
        careerRecommendationRepository.deleteAll(existingRecommendations);
        
        // Generate new recommendations based on assessment answers
        // This is a simplified algorithm - in a real application, this would be more sophisticated
        List<CareerRecommendation> newRecommendations = new ArrayList<>();
        
        Random random = new Random(); // For demo purposes only
        
        for (CareerPath careerPath : careerPaths) {
            CareerRecommendation recommendation = new CareerRecommendation();
            recommendation.setUser(userOptional.get());
            recommendation.setCareerPath(careerPath);
            
            // In a real application, this would analyze the answers and calculate a match percentage
            // For demo purposes, we're using a random match percentage
            double matchPercentage = 50.0 + random.nextDouble() * 50.0; // Between 50% and 100%
            recommendation.setMatchPercentage(matchPercentage);
            
            newRecommendations.add(recommendation);
        }
        
        // Save all new recommendations
        careerRecommendationRepository.saveAll(newRecommendations);
        
        // Sort by match percentage descending
        newRecommendations.sort(Comparator.comparing(CareerRecommendation::getMatchPercentage).reversed());
        
        return ResponseEntity.ok(newRecommendations);
    }
}
