package com.techcareer.app.controller;

import com.techcareer.app.model.*;
import com.techcareer.app.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/learning-plans")
public class LearningPlanController {

    @Autowired
    private LearningPlanService learningPlanService;
    
    @PostMapping("/generate")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> generateLearningPlan(@RequestBody Map<String, Object> requestBody) {
        Long userId = Long.parseLong(requestBody.get("userId").toString());
        Long jobRoleId = Long.parseLong(requestBody.get("jobRoleId").toString());
        
        LearningPlan learningPlan = learningPlanService.generateLearningPlan(userId, jobRoleId);
        
        return ResponseEntity.ok(learningPlan);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getLearningPlan(@PathVariable Long id) {
        LearningPlan learningPlan = learningPlanService.getLearningPlan(id);
        
        return ResponseEntity.ok(learningPlan);
    }
    
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getUserLearningPlans(@PathVariable Long userId) {
        List<LearningPlan> learningPlans = learningPlanService.getUserLearningPlans(userId);
        
        return ResponseEntity.ok(learningPlans);
    }
    
    @GetMapping("/{id}/progress")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getLearningPlanProgress(@PathVariable Long id) {
        Map<String, Object> progressData = learningPlanService.getLearningPlanProgress(id);
        
        return ResponseEntity.ok(progressData);
    }
    
    @PutMapping("/milestones/{id}/progress")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateMilestoneProgress(
            @PathVariable Long id,
            @RequestBody Map<String, Object> requestBody) {
        
        String status = (String) requestBody.get("status");
        Integer progressPercentage = (Integer) requestBody.get("progressPercentage");
        
        LearningPlanMilestone milestone = learningPlanService.updateMilestoneProgress(
                id, status, progressPercentage);
        
        return ResponseEntity.ok(milestone);
    }
    
    @GetMapping("/resources")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getRecommendedResources(
            @RequestParam Long jobRoleId,
            @RequestParam String skillLevel,
            @RequestParam(required = false) String learningStyle) {
        
        List<LearningResource> resources = learningPlanService.getRecommendedResources(
                jobRoleId, skillLevel, learningStyle);
        
        return ResponseEntity.ok(resources);
    }
}
