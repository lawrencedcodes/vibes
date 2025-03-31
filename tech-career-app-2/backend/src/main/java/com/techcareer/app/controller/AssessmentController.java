package com.techcareer.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.techcareer.app.model.User;
import com.techcareer.app.model.UserAssessment;
import com.techcareer.app.model.AssessmentQuestion;
import com.techcareer.app.payload.response.MessageResponse;
import com.techcareer.app.repository.UserRepository;
import com.techcareer.app.repository.UserAssessmentRepository;
import com.techcareer.app.repository.AssessmentQuestionRepository;
import com.techcareer.app.security.services.UserDetailsImpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/assessment")
public class AssessmentController {
    
    @Autowired
    UserRepository userRepository;
    
    @Autowired
    UserAssessmentRepository userAssessmentRepository;
    
    @Autowired
    AssessmentQuestionRepository assessmentQuestionRepository;
    
    @GetMapping("/questions/{assessmentType}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getAssessmentQuestions(@PathVariable String assessmentType) {
        List<AssessmentQuestion> questions = assessmentQuestionRepository.findByAssessmentTypeOrderByOrderIndexAsc(assessmentType);
        return ResponseEntity.ok(questions);
    }
    
    @GetMapping("/history")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getUserAssessmentHistory() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<User> userOptional = userRepository.findById(userDetails.getId());
        if (!userOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOptional.get();
        List<UserAssessment> assessments = userAssessmentRepository.findByUser(user);
        
        return ResponseEntity.ok(assessments);
    }
    
    @PostMapping("/submit/{assessmentType}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> submitAssessment(
            @PathVariable String assessmentType,
            @RequestBody Map<String, Object> assessmentResults) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<User> userOptional = userRepository.findById(userDetails.getId());
        if (!userOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOptional.get();
        
        // Create new assessment record
        UserAssessment assessment = new UserAssessment();
        assessment.setUser(user);
        assessment.setAssessmentType(assessmentType);
        assessment.setCompletedAt(LocalDateTime.now());
        
        // Convert assessment results to JSON string
        assessment.setResults(assessmentResults.toString());
        
        UserAssessment savedAssessment = userAssessmentRepository.save(assessment);
        
        return ResponseEntity.ok(new MessageResponse("Assessment submitted successfully"));
    }
    
    @GetMapping("/latest/{assessmentType}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getLatestAssessment(@PathVariable String assessmentType) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<User> userOptional = userRepository.findById(userDetails.getId());
        if (!userOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOptional.get();
        Optional<UserAssessment> latestAssessment = 
            userAssessmentRepository.findTopByUserAndAssessmentTypeOrderByCompletedAtDesc(user, assessmentType);
        
        if (!latestAssessment.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(latestAssessment.get());
    }
}
