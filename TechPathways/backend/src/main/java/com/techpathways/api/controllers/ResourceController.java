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

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/resources")
public class ResourceController {
    @Autowired
    ResourceRepository resourceRepository;

    @Autowired
    ResourceRecommendationRepository resourceRecommendationRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/all")
    public ResponseEntity<?> getAllResources() {
        List<Resource> resources = resourceRepository.findAll();
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getResourceById(@PathVariable Long id) {
        Optional<Resource> resourceOptional = resourceRepository.findById(id);
        if (!resourceOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Resource not found!"));
        }
        return ResponseEntity.ok(resourceOptional.get());
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<?> getResourcesByType(@PathVariable String type) {
        List<Resource> resources = resourceRepository.findByType(type);
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/learning-style/{style}")
    public ResponseEntity<?> getResourcesByLearningStyle(@PathVariable String style) {
        List<Resource> resources = resourceRepository.findByLearningStyle(style);
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/cost/{cost}")
    public ResponseEntity<?> getResourcesByCost(@PathVariable String cost) {
        List<Resource> resources = resourceRepository.findByCost(cost);
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/recommendations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUserRecommendations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        List<ResourceRecommendation> recommendations = 
            resourceRecommendationRepository.findByUserIdOrderByRelevanceScoreDesc(userDetails.getId());
        
        return ResponseEntity.ok(recommendations);
    }

    @PostMapping("/generate-recommendations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> generateResourceRecommendations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<User> userOptional = userRepository.findById(userDetails.getId());
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found!"));
        }
        
        // Get all resources
        List<Resource> resources = resourceRepository.findAll();
        
        // Delete existing recommendations for this user
        List<ResourceRecommendation> existingRecommendations = 
            resourceRecommendationRepository.findByUserId(userDetails.getId());
        resourceRecommendationRepository.deleteAll(existingRecommendations);
        
        // Generate new recommendations
        // This is a simplified algorithm - in a real application, this would be more sophisticated
        List<ResourceRecommendation> newRecommendations = new ArrayList<>();
        
        Random random = new Random(); // For demo purposes only
        
        for (Resource resource : resources) {
            ResourceRecommendation recommendation = new ResourceRecommendation();
            recommendation.setUser(userOptional.get());
            recommendation.setResource(resource);
            
            // In a real application, this would analyze user preferences and calculate relevance
            // For demo purposes, we're using a random relevance score
            double relevanceScore = 50.0 + random.nextDouble() * 50.0; // Between 50% and 100%
            recommendation.setRelevanceScore(relevanceScore);
            
            newRecommendations.add(recommendation);
        }
        
        // Save all new recommendations
        resourceRecommendationRepository.saveAll(newRecommendations);
        
        // Sort by relevance score descending
        newRecommendations.sort(Comparator.comparing(ResourceRecommendation::getRelevanceScore).reversed());
        
        return ResponseEntity.ok(newRecommendations);
    }
}
