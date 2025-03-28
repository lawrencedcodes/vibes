package com.techpathways.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.techpathways.api.models.Assessment;
import com.techpathways.api.models.AssessmentAnswer;
import com.techpathways.api.models.Question;
import com.techpathways.api.models.User;
import com.techpathways.api.payload.response.MessageResponse;
import com.techpathways.api.repositories.AssessmentAnswerRepository;
import com.techpathways.api.repositories.AssessmentRepository;
import com.techpathways.api.repositories.QuestionRepository;
import com.techpathways.api.repositories.UserRepository;
import com.techpathways.api.security.services.UserDetailsImpl;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/assessment")
public class AssessmentController {
    @Autowired
    AssessmentRepository assessmentRepository;

    @Autowired
    AssessmentAnswerRepository assessmentAnswerRepository;

    @Autowired
    QuestionRepository questionRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/questions")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getAllQuestions() {
        List<Question> questions = questionRepository.findAll();
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/questions/{category}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getQuestionsByCategory(@PathVariable String category) {
        List<Question> questions = questionRepository.findByCategory(category);
        return ResponseEntity.ok(questions);
    }

    @PostMapping("/start")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> startAssessment() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<User> userOptional = userRepository.findById(userDetails.getId());
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found!"));
        }
        
        // Check if there's an incomplete assessment
        Optional<Assessment> incompleteAssessment = assessmentRepository.findByUserIdAndCompleted(userDetails.getId(), false);
        if (incompleteAssessment.isPresent()) {
            return ResponseEntity.ok(incompleteAssessment.get());
        }
        
        // Create new assessment
        Assessment assessment = new Assessment();
        assessment.setUser(userOptional.get());
        assessment.setCompleted(false);
        
        Assessment savedAssessment = assessmentRepository.save(assessment);
        
        return ResponseEntity.ok(savedAssessment);
    }

    @PostMapping("/{assessmentId}/answer")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> saveAnswer(@PathVariable Long assessmentId, @RequestBody AssessmentAnswer answer) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<Assessment> assessmentOptional = assessmentRepository.findById(assessmentId);
        if (!assessmentOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Assessment not found!"));
        }
        
        Assessment assessment = assessmentOptional.get();
        if (!assessment.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Not authorized to modify this assessment!"));
        }
        
        Optional<Question> questionOptional = questionRepository.findById(answer.getQuestion().getId());
        if (!questionOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Question not found!"));
        }
        
        answer.setAssessment(assessment);
        answer.setQuestion(questionOptional.get());
        
        AssessmentAnswer savedAnswer = assessmentAnswerRepository.save(answer);
        
        return ResponseEntity.ok(savedAnswer);
    }

    @PostMapping("/{assessmentId}/complete")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> completeAssessment(@PathVariable Long assessmentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<Assessment> assessmentOptional = assessmentRepository.findById(assessmentId);
        if (!assessmentOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Assessment not found!"));
        }
        
        Assessment assessment = assessmentOptional.get();
        if (!assessment.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Not authorized to modify this assessment!"));
        }
        
        assessment.setCompleted(true);
        assessmentRepository.save(assessment);
        
        return ResponseEntity.ok(new MessageResponse("Assessment completed successfully!"));
    }

    @GetMapping("/{assessmentId}/answers")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getAssessmentAnswers(@PathVariable Long assessmentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<Assessment> assessmentOptional = assessmentRepository.findById(assessmentId);
        if (!assessmentOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Assessment not found!"));
        }
        
        Assessment assessment = assessmentOptional.get();
        if (!assessment.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Not authorized to view this assessment!"));
        }
        
        List<AssessmentAnswer> answers = assessmentAnswerRepository.findByAssessmentId(assessmentId);
        
        return ResponseEntity.ok(answers);
    }
}
