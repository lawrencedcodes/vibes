package com.techcareer.app.controller;

import com.techcareer.app.model.*;
import com.techcareer.app.service.CommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community")
public class CommunityController {

    @Autowired
    private CommunityService communityService;
    
    // Forum Category endpoints
    @GetMapping("/categories")
    public ResponseEntity<List<ForumCategory>> getAllCategories() {
        return ResponseEntity.ok(communityService.getAllActiveCategories());
    }
    
    @GetMapping("/categories/{id}")
    public ResponseEntity<ForumCategory> getCategoryById(@PathVariable Long id) {
        ForumCategory category = communityService.getCategoryById(id);
        if (category != null) {
            return ResponseEntity.ok(category);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ForumCategory> createCategory(@RequestBody ForumCategory category) {
        return ResponseEntity.ok(communityService.createCategory(category));
    }
    
    @PutMapping("/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ForumCategory> updateCategory(@PathVariable Long id, @RequestBody ForumCategory category) {
        ForumCategory existingCategory = communityService.getCategoryById(id);
        if (existingCategory != null) {
            category.setId(id);
            return ResponseEntity.ok(communityService.updateCategory(category));
        }
        return ResponseEntity.notFound().build();
    }
    
    // Forum Topic endpoints
    @GetMapping("/categories/{categoryId}/topics")
    public ResponseEntity<Page<ForumTopic>> getTopicsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "lastActivityAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        return ResponseEntity.ok(communityService.getTopicsByCategory(categoryId, pageable));
    }
    
    @GetMapping("/categories/{categoryId}/recent-topics")
    public ResponseEntity<List<ForumTopic>> getRecentTopicsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(communityService.getRecentTopicsByCategory(categoryId));
    }
    
    @GetMapping("/topics/pinned")
    public ResponseEntity<List<ForumTopic>> getPinnedTopics() {
        return ResponseEntity.ok(communityService.getPinnedTopics());
    }
    
    @GetMapping("/topics/{id}")
    public ResponseEntity<ForumTopic> getTopicById(@PathVariable Long id) {
        ForumTopic topic = communityService.getTopicById(id);
        if (topic != null) {
            communityService.incrementTopicViewCount(id);
            return ResponseEntity.ok(topic);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/topics")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ForumTopic> createTopic(@RequestBody ForumTopic topic) {
        return ResponseEntity.ok(communityService.createTopic(topic));
    }
    
    @PutMapping("/topics/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ForumTopic> updateTopic(@PathVariable Long id, @RequestBody ForumTopic topic) {
        ForumTopic existingTopic = communityService.getTopicById(id);
        if (existingTopic != null) {
            topic.setId(id);
            return ResponseEntity.ok(communityService.updateTopic(topic));
        }
        return ResponseEntity.notFound().build();
    }
    
    // Forum Post endpoints
    @GetMapping("/topics/{topicId}/posts")
    public ResponseEntity<Page<ForumPost>> getPostsByTopic(
            @PathVariable Long topicId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));
        
        return ResponseEntity.ok(communityService.getPostsByTopic(topicId, pageable));
    }
    
    @GetMapping("/topics/{topicId}/answers")
    public ResponseEntity<List<ForumPost>> getAnswersByTopic(@PathVariable Long topicId) {
        return ResponseEntity.ok(communityService.getAnswersByTopic(topicId));
    }
    
    @GetMapping("/posts/top-liked")
    public ResponseEntity<List<ForumPost>> getTopLikedPosts() {
        return ResponseEntity.ok(communityService.getTopLikedPosts());
    }
    
    @GetMapping("/posts/{id}")
    public ResponseEntity<ForumPost> getPostById(@PathVariable Long id) {
        ForumPost post = communityService.getPostById(id);
        if (post != null) {
            return ResponseEntity.ok(post);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/posts")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ForumPost> createPost(@RequestBody ForumPost post) {
        return ResponseEntity.ok(communityService.createPost(post));
    }
    
    @PutMapping("/posts/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ForumPost> updatePost(@PathVariable Long id, @RequestBody ForumPost post) {
        ForumPost existingPost = communityService.getPostById(id);
        if (existingPost != null) {
            post.setId(id);
            return ResponseEntity.ok(communityService.updatePost(post));
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/posts/{id}/like")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> likePost(@PathVariable Long id) {
        ForumPost post = communityService.getPostById(id);
        if (post != null) {
            communityService.incrementPostLikeCount(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/posts/{id}/mark-as-answer")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> markPostAsAnswer(@PathVariable Long id) {
        ForumPost post = communityService.getPostById(id);
        if (post != null) {
            communityService.markPostAsAnswer(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    // Expert Q&A Session endpoints
    @GetMapping("/qa-sessions")
    public ResponseEntity<Page<ExpertQASession>> getUpcomingQASessions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "scheduledDate"));
        
        return ResponseEntity.ok(communityService.getUpcomingQASessions(pageable));
    }
    
    @GetMapping("/qa-sessions/next")
    public ResponseEntity<List<ExpertQASession>> getNextQASessions() {
        return ResponseEntity.ok(communityService.getNextQASessions());
    }
    
    @GetMapping("/experts/{expertId}/qa-sessions")
    public ResponseEntity<List<ExpertQASession>> getExpertSessions(@PathVariable Long expertId) {
        return ResponseEntity.ok(communityService.getExpertSessions(expertId));
    }
    
    @GetMapping("/qa-sessions/{id}")
    public ResponseEntity<ExpertQASession> getQASessionById(@PathVariable Long id) {
        ExpertQASession session = communityService.getQASessionById(id);
        if (session != null) {
            return ResponseEntity.ok(session);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/qa-sessions")
    @PreAuthorize("hasRole('EXPERT') or hasRole('ADMIN')")
    public ResponseEntity<ExpertQASession> createQASession(@RequestBody ExpertQASession session) {
        return ResponseEntity.ok(communityService.createQASession(session));
    }
    
    @PutMapping("/qa-sessions/{id}")
    @PreAuthorize("hasRole('EXPERT') or hasRole('ADMIN')")
    public ResponseEntity<ExpertQASession> updateQASession(@PathVariable Long id, @RequestBody ExpertQASession session) {
        ExpertQASession existingSession = communityService.getQASessionById(id);
        if (existingSession != null) {
            session.setId(id);
            return ResponseEntity.ok(communityService.updateQASession(session));
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/qa-sessions/{id}/register")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> registerForQASession(@PathVariable Long id, @RequestParam Long userId) {
        boolean registered = communityService.registerForQASession(id, userId);
        if (registered) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().body("Session is full or not available");
    }
    
    // Success Story endpoints
    @GetMapping("/success-stories")
    public ResponseEntity<Page<SuccessStory>> getApprovedSuccessStories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        return ResponseEntity.ok(communityService.getApprovedSuccessStories(pageable));
    }
    
    @GetMapping("/success-stories/featured")
    public ResponseEntity<List<SuccessStory>> getFeaturedSuccessStories() {
        return ResponseEntity.ok(communityService.getFeaturedSuccessStories());
    }
    
    @GetMapping("/users/{userId}/success-stories")
    public ResponseEntity<List<SuccessStory>> getUserSuccessStories(@PathVariable Long userId) {
        return ResponseEntity.ok(communityService.getUserSuccessStories(userId));
    }
    
    @GetMapping("/success-stories/{id}")
    public ResponseEntity<SuccessStory> getSuccessStoryById(@PathVariable Long id) {
        SuccessStory story = communityService.getSuccessStoryById(id);
        if (story != null) {
            return ResponseEntity.ok(story);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/success-stories")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<SuccessStory> createSuccessStory(@RequestBody SuccessStory story) {
        return ResponseEntity.ok(communityService.createSuccessStory(story));
    }
    
    @PutMapping("/success-stories/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<SuccessStory> updateSuccessStory(@PathVariable Long id, @RequestBody SuccessStory story) {
        SuccessStory existingStory = communityService.getSuccessStoryById(id);
        if (existingStory != null) {
            story.setId(id);
            return ResponseEntity.ok(communityService.updateSuccessStory(story));
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/success-stories/{id}/like")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> likeSuccessStory(@PathVariable Long id) {
        SuccessStory story = communityService.getSuccessStoryById(id);
        if (story != null) {
            communityService.incrementSuccessStoryLikeCount(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/success-stories/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveSuccessStory(@PathVariable Long id) {
        SuccessStory story = communityService.getSuccessStoryById(id);
        if (story != null) {
            communityService.approveSuccessStory(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/success-stories/{id}/feature")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> featureSuccessStory(@PathVariable Long id) {
        SuccessStory story = communityService.getSuccessStoryById(id);
        if (story != null) {
            communityService.featureSuccessStory(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    // Peer Support Connection endpoints
    @GetMapping("/users/{userId}/support-requests")
    public ResponseEntity<List<PeerSupportConnection>> getUserRequestedConnections(@PathVariable Long userId) {
        return ResponseEntity.ok(communityService.getUserRequestedConnections(userId));
    }
    
    @GetMapping("/users/{userId}/support-provided")
    public ResponseEntity<List<PeerSupportConnection>> getUserProvidedConnections(@PathVariable Long userId) {
        return ResponseEntity.ok(communityService.getUserProvidedConnections(userId));
    }
    
    @GetMapping("/users/{userId}/pending-requests")
    public ResponseEntity<List<PeerSupportConnection>> getUserPendingRequests(@PathVariable Long userId) {
        return ResponseEntity.ok(communityService.getUserPendingRequests(userId));
    }
    
    @GetMapping("/users/{userId}/pending-support")
    public ResponseEntity<List<PeerSupportConnection>> getUserPendingSupport(@PathVariable Long userId) {
        return ResponseEntity.ok(communityService.getUserPendingSupport(userId));
    }
    
    @GetMapping("/support-connections/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<PeerSupportConnection>> getPendingSupportRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        return ResponseEntity.ok(communityService.getPendingSupportRequests(pageable));
    }
    
    @GetMapping("/support-connections/{id}")
    public ResponseEntity<PeerSupportConnection> getSupportConnectionById(@PathVariable Long id) {
        PeerSupportConnection connection = communityService.getSupportConnectionById(id);
        if (connection != null) {
            return ResponseEntity.ok(connection);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/support-connections")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PeerSupportConnection> createSupportConnection(@RequestBody PeerSupportConnection connection) {
        return ResponseEntity.ok(communityService.createSupportConnection(connection));
    }
    
    @PutMapping("/support-connections/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PeerSupportConnection> updateSupportConnection(@PathVariable Long id, @RequestBody PeerSupportConnection connection) {
        PeerSupportConnection existingConnection = communityService.getSupportConnectionById(id);
        if (existingConnection != null) {
            connection.setId(id);
            return ResponseEntity.ok(communityService.updateSupportConnection(connection));
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/support-connections/{id}/accept")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> acceptSupportRequest(@PathVariable Long id) {
        PeerSupportConnection connection = communityService.getSupportConnectionById(id);
        if (connection != null) {
            communityService.acceptSupportRequest(id);
            return Respo<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>