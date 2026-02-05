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
@RequestMapping("/api/community")
public class CommunityController {
    @Autowired
    ForumTopicRepository forumTopicRepository;

    @Autowired
    ForumPostRepository forumPostRepository;

    @Autowired
    SuccessStoryRepository successStoryRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    CareerPathRepository careerPathRepository;

    // Forum Topics Endpoints
    @GetMapping("/topics")
    public ResponseEntity<?> getAllTopics() {
        List<ForumTopic> topics = forumTopicRepository.findAllByOrderByUpdatedAtDesc();
        return ResponseEntity.ok(topics);
    }

    @GetMapping("/topics/{id}")
    public ResponseEntity<?> getTopicById(@PathVariable Long id) {
        Optional<ForumTopic> topicOptional = forumTopicRepository.findById(id);
        if (!topicOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Topic not found!"));
        }
        return ResponseEntity.ok(topicOptional.get());
    }

    @PostMapping("/topics")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createTopic(@RequestBody ForumTopic topic) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<User> userOptional = userRepository.findById(userDetails.getId());
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found!"));
        }
        
        topic.setUser(userOptional.get());
        ForumTopic savedTopic = forumTopicRepository.save(topic);
        
        return ResponseEntity.ok(savedTopic);
    }

    // Forum Posts Endpoints
    @GetMapping("/topics/{topicId}/posts")
    public ResponseEntity<?> getPostsByTopic(@PathVariable Long topicId) {
        Optional<ForumTopic> topicOptional = forumTopicRepository.findById(topicId);
        if (!topicOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Topic not found!"));
        }
        
        List<ForumPost> posts = forumPostRepository.findByTopicIdOrderByCreatedAtAsc(topicId);
        return ResponseEntity.ok(posts);
    }

    @PostMapping("/topics/{topicId}/posts")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createPost(@PathVariable Long topicId, @RequestBody ForumPost post) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<User> userOptional = userRepository.findById(userDetails.getId());
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found!"));
        }
        
        Optional<ForumTopic> topicOptional = forumTopicRepository.findById(topicId);
        if (!topicOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Topic not found!"));
        }
        
        post.setUser(userOptional.get());
        post.setTopic(topicOptional.get());
        ForumPost savedPost = forumPostRepository.save(post);
        
        // Update the topic's updated_at timestamp
        ForumTopic topic = topicOptional.get();
        forumTopicRepository.save(topic);
        
        return ResponseEntity.ok(savedPost);
    }

    // Success Stories Endpoints
    @GetMapping("/success-stories")
    public ResponseEntity<?> getAllSuccessStories() {
        List<SuccessStory> stories = successStoryRepository.findAll();
        return ResponseEntity.ok(stories);
    }

    @GetMapping("/success-stories/{id}")
    public ResponseEntity<?> getSuccessStoryById(@PathVariable Long id) {
        Optional<SuccessStory> storyOptional = successStoryRepository.findById(id);
        if (!storyOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Success story not found!"));
        }
        return ResponseEntity.ok(storyOptional.get());
    }

    @GetMapping("/success-stories/career/{careerPathId}")
    public ResponseEntity<?> getSuccessStoriesByCareerPath(@PathVariable Long careerPathId) {
        List<SuccessStory> stories = successStoryRepository.findByCareerPathId(careerPathId);
        return ResponseEntity.ok(stories);
    }

    @PostMapping("/success-stories")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createSuccessStory(@RequestBody SuccessStory story) {
        Optional<CareerPath> careerPathOptional = careerPathRepository.findById(story.getCareerPath().getId());
        if (!careerPathOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Career path not found!"));
        }
        
        story.setCareerPath(careerPathOptional.get());
        SuccessStory savedStory = successStoryRepository.save(story);
        
        return ResponseEntity.ok(savedStory);
    }
}
