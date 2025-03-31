package com.techcareer.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.techcareer.app.model.*;
import com.techcareer.app.payload.response.MessageResponse;
import com.techcareer.app.repository.*;
import com.techcareer.app.security.services.UserDetailsImpl;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/career")
public class CareerRecommendationController {
    
    @Autowired
    UserRepository userRepository;
    
    @Autowired
    UserAssessmentRepository userAssessmentRepository;
    
    @Autowired
    UserSkillRepository userSkillRepository;
    
    @Autowired
    CareerPathRepository careerPathRepository;
    
    @Autowired
    JobRoleRepository jobRoleRepository;
    
    @Autowired
    CareerRecommendationRepository careerRecommendationRepository;
    
    @GetMapping("/paths")
    public ResponseEntity<?> getAllCareerPaths() {
        List<CareerPath> careerPaths = careerPathRepository.findAll();
        return ResponseEntity.ok(careerPaths);
    }
    
    @GetMapping("/paths/{id}")
    public ResponseEntity<?> getCareerPathById(@PathVariable Long id) {
        Optional<CareerPath> careerPath = careerPathRepository.findById(id);
        if (!careerPath.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(careerPath.get());
    }
    
    @GetMapping("/roles")
    public ResponseEntity<?> getAllJobRoles() {
        List<JobRole> jobRoles = jobRoleRepository.findAll();
        return ResponseEntity.ok(jobRoles);
    }
    
    @GetMapping("/roles/{id}")
    public ResponseEntity<?> getJobRoleById(@PathVariable Long id) {
        Optional<JobRole> jobRole = jobRoleRepository.findById(id);
        if (!jobRole.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(jobRole.get());
    }
    
    @GetMapping("/roles/path/{pathId}")
    public ResponseEntity<?> getJobRolesByCareerPath(@PathVariable Long pathId) {
        Optional<CareerPath> careerPath = careerPathRepository.findById(pathId);
        if (!careerPath.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        List<JobRole> jobRoles = jobRoleRepository.findByCareerPath(careerPath.get());
        return ResponseEntity.ok(jobRoles);
    }
    
    @GetMapping("/recommendations")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getUserRecommendations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<User> userOptional = userRepository.findById(userDetails.getId());
        if (!userOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOptional.get();
        List<CareerRecommendation> recommendations = 
            careerRecommendationRepository.findByUserOrderByMatchPercentageDesc(user);
        
        return ResponseEntity.ok(recommendations);
    }
    
    @PostMapping("/generate-recommendations")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> generateRecommendations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<User> userOptional = userRepository.findById(userDetails.getId());
        if (!userOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOptional.get();
        
        // Get user skills
        List<UserSkill> userSkills = userSkillRepository.findByUser(user);
        List<UserSkill> strengths = userSkillRepository.findByUserAndIsStrength(user, true);
        List<UserSkill> interests = userSkillRepository.findByUserAndIsInterest(user, true);
        
        // Get all job roles
        List<JobRole> allJobRoles = jobRoleRepository.findAll();
        
        // Clear previous recommendations
        List<CareerRecommendation> existingRecommendations = 
            careerRecommendationRepository.findByUser(user);
        careerRecommendationRepository.deleteAll(existingRecommendations);
        
        // Generate new recommendations
        List<CareerRecommendation> newRecommendations = new ArrayList<>();
        
        for (JobRole role : allJobRoles) {
            // Simple matching algorithm - can be enhanced with more sophisticated logic
            int matchScore = calculateMatchScore(role, userSkills, strengths, interests);
            
            if (matchScore > 30) { // Only recommend if match is above threshold
                CareerRecommendation recommendation = new CareerRecommendation();
                recommendation.setUser(user);
                recommendation.setJobRole(role);
                recommendation.setMatchPercentage(matchScore);
                recommendation.setReasoning(generateReasoningText(role, userSkills, strengths, interests, matchScore));
                
                newRecommendations.add(recommendation);
            }
        }
        
        // Save top recommendations (limit to 10)
        List<CareerRecommendation> topRecommendations = newRecommendations.stream()
            .sorted(Comparator.comparing(CareerRecommendation::getMatchPercentage).reversed())
            .limit(10)
            .collect(Collectors.toList());
        
        careerRecommendationRepository.saveAll(topRecommendations);
        
        return ResponseEntity.ok(new MessageResponse("Career recommendations generated successfully"));
    }
    
    // Simple algorithm to calculate match score - can be enhanced with more sophisticated logic
    private int calculateMatchScore(JobRole role, List<UserSkill> userSkills, 
                                   List<UserSkill> strengths, List<UserSkill> interests) {
        // This is a simplified algorithm - in a real application, this would be more sophisticated
        int baseScore = 50; // Start with a base score
        
        // Check if user has required skills
        String[] requiredSkills = role.getRequiredSkills().toLowerCase().split(",");
        for (String requiredSkill : requiredSkills) {
            for (UserSkill userSkill : userSkills) {
                if (userSkill.getSkill().getName().toLowerCase().contains(requiredSkill.trim())) {
                    baseScore += 5;
                    
                    // Bonus if it's a strength
                    if (userSkill.getIsStrength()) {
                        baseScore += 10;
                    }
                    
                    // Bonus if it's an interest
                    if (userSkill.getIsInterest()) {
                        baseScore += 8;
                    }
                }
            }
        }
        
        // Cap the score at 100
        return Math.min(baseScore, 100);
    }
    
    private String generateReasoningText(JobRole role, List<UserSkill> userSkills, 
                                        List<UserSkill> strengths, List<UserSkill> interests, int matchScore) {
        StringBuilder reasoning = new StringBuilder();
        
        reasoning.append("Based on your profile, you have a ").append(matchScore).append("% match with this role. ");
        
        // Add reasoning about skills
        reasoning.append("You have skills that align with this role's requirements, ");
        
        // Add reasoning about strengths if applicable
        if (!strengths.isEmpty()) {
            reasoning.append("and your strengths in ");
            for (int i = 0; i < Math.min(strengths.size(), 3); i++) {
                reasoning.append(strengths.get(i).getSkill().getName());
                if (i < Math.min(strengths.size(), 3) - 1) {
                    reasoning.append(", ");
                }
            }
            reasoning.append(" are particularly valuable for this position. ");
        }
        
        // Add reasoning about interests if applicable
        if (!interests.isEmpty()) {
            reasoning.append("Your interest in ");
            for (int i = 0; i < Math.min(interests.size(), 3); i++) {
                reasoning.append(interests.get(i).getSkill().getName());
                if (i < Math.min(interests.size(), 3) - 1) {
                    reasoning.append(", ");
                }
            }
            reasoning.append(" aligns well with this career path. ");
        }
        
        // Add information about the role
        reasoning.append("This role typically involves ").append(role.getDescription());
        
        return reasoning.toString();
    }
}
