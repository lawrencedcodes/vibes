package com.techcareer.app.service;

import com.techcareer.app.model.*;
import com.techcareer.app.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CommunityService {

    @Autowired
    private ForumCategoryRepository categoryRepository;
    
    @Autowired
    private ForumTopicRepository topicRepository;
    
    @Autowired
    private ForumPostRepository postRepository;
    
    @Autowired
    private ExpertQASessionRepository qaSessionRepository;
    
    @Autowired
    private SuccessStoryRepository successStoryRepository;
    
    @Autowired
    private PeerSupportConnectionRepository peerSupportRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Forum Category methods
    public List<ForumCategory> getAllActiveCategories() {
        return categoryRepository.findByIsActiveOrderByDisplayOrderAsc(true);
    }
    
    public ForumCategory getCategoryById(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }
    
    public ForumCategory createCategory(ForumCategory category) {
        return categoryRepository.save(category);
    }
    
    public ForumCategory updateCategory(ForumCategory category) {
        return categoryRepository.save(category);
    }
    
    // Forum Topic methods
    public Page<ForumTopic> getTopicsByCategory(Long categoryId, Pageable pageable) {
        return topicRepository.findByCategoryId(categoryId, pageable);
    }
    
    public List<ForumTopic> getRecentTopicsByCategory(Long categoryId) {
        return topicRepository.findTop5ByCategoryIdOrderByLastActivityAtDesc(categoryId);
    }
    
    public List<ForumTopic> getPinnedTopics() {
        return topicRepository.findByIsPinnedOrderByLastActivityAtDesc(true);
    }
    
    public ForumTopic getTopicById(Long id) {
        return topicRepository.findById(id).orElse(null);
    }
    
    public ForumTopic createTopic(ForumTopic topic) {
        return topicRepository.save(topic);
    }
    
    public ForumTopic updateTopic(ForumTopic topic) {
        return topicRepository.save(topic);
    }
    
    public void incrementTopicViewCount(Long topicId) {
        Optional<ForumTopic> topicOpt = topicRepository.findById(topicId);
        if (topicOpt.isPresent()) {
            ForumTopic topic = topicOpt.get();
            topic.setViewCount(topic.getViewCount() + 1);
            topicRepository.save(topic);
        }
    }
    
    public void updateTopicLastActivity(Long topicId) {
        Optional<ForumTopic> topicOpt = topicRepository.findById(topicId);
        if (topicOpt.isPresent()) {
            ForumTopic topic = topicOpt.get();
            topic.setLastActivityAt(new Date());
            topicRepository.save(topic);
        }
    }
    
    // Forum Post methods
    public Page<ForumPost> getPostsByTopic(Long topicId, Pageable pageable) {
        return postRepository.findByTopicId(topicId, pageable);
    }
    
    public List<ForumPost> getAnswersByTopic(Long topicId) {
        return postRepository.findByTopicIdAndIsAnswer(topicId, true);
    }
    
    public List<ForumPost> getTopLikedPosts() {
        return postRepository.findTop10ByOrderByLikeCountDesc();
    }
    
    public ForumPost getPostById(Long id) {
        return postRepository.findById(id).orElse(null);
    }
    
    public ForumPost createPost(ForumPost post) {
        ForumPost savedPost = postRepository.save(post);
        
        // Update topic reply count and last activity
        Optional<ForumTopic> topicOpt = topicRepository.findById(post.getTopic().getId());
        if (topicOpt.isPresent()) {
            ForumTopic topic = topicOpt.get();
            topic.setReplyCount(topic.getReplyCount() + 1);
            topic.setLastActivityAt(new Date());
            topicRepository.save(topic);
        }
        
        return savedPost;
    }
    
    public ForumPost updatePost(ForumPost post) {
        return postRepository.save(post);
    }
    
    public void incrementPostLikeCount(Long postId) {
        Optional<ForumPost> postOpt = postRepository.findById(postId);
        if (postOpt.isPresent()) {
            ForumPost post = postOpt.get();
            post.setLikeCount(post.getLikeCount() + 1);
            postRepository.save(post);
        }
    }
    
    public void markPostAsAnswer(Long postId) {
        Optional<ForumPost> postOpt = postRepository.findById(postId);
        if (postOpt.isPresent()) {
            ForumPost post = postOpt.get();
            post.setIsAnswer(true);
            postRepository.save(post);
        }
    }
    
    // Expert Q&A Session methods
    public Page<ExpertQASession> getUpcomingQASessions(Pageable pageable) {
        return qaSessionRepository.findByIsActiveAndScheduledDateAfter(true, new Date(), pageable);
    }
    
    public List<ExpertQASession> getNextQASessions() {
        return qaSessionRepository.findTop5ByIsActiveAndScheduledDateAfterOrderByScheduledDateAsc(true, new Date());
    }
    
    public List<ExpertQASession> getExpertSessions(Long expertId) {
        return qaSessionRepository.findByExpertId(expertId);
    }
    
    public ExpertQASession getQASessionById(Long id) {
        return qaSessionRepository.findById(id).orElse(null);
    }
    
    public ExpertQASession createQASession(ExpertQASession session) {
        return qaSessionRepository.save(session);
    }
    
    public ExpertQASession updateQASession(ExpertQASession session) {
        return qaSessionRepository.save(session);
    }
    
    public boolean registerForQASession(Long sessionId, Long userId) {
        Optional<ExpertQASession> sessionOpt = qaSessionRepository.findById(sessionId);
        Optional<User> userOpt = userRepository.findById(userId);
        
        if (sessionOpt.isPresent() && userOpt.isPresent()) {
            ExpertQASession session = sessionOpt.get();
            
            // Check if there's space available
            if (session.getCurrentParticipants() < session.getMaxParticipants()) {
                session.setCurrentParticipants(session.getCurrentParticipants() + 1);
                qaSessionRepository.save(session);
                return true;
            }
        }
        
        return false;
    }
    
    // Success Story methods
    public Page<SuccessStory> getApprovedSuccessStories(Pageable pageable) {
        return successStoryRepository.findByIsApproved(true, pageable);
    }
    
    public List<SuccessStory> getFeaturedSuccessStories() {
        return successStoryRepository.findTop5ByIsApprovedAndIsFeaturedOrderByCreatedAtDesc(true, true);
    }
    
    public List<SuccessStory> getUserSuccessStories(Long userId) {
        return successStoryRepository.findByAuthorId(userId);
    }
    
    public SuccessStory getSuccessStoryById(Long id) {
        return successStoryRepository.findById(id).orElse(null);
    }
    
    public SuccessStory createSuccessStory(SuccessStory story) {
        return successStoryRepository.save(story);
    }
    
    public SuccessStory updateSuccessStory(SuccessStory story) {
        return successStoryRepository.save(story);
    }
    
    public void incrementSuccessStoryLikeCount(Long storyId) {
        Optional<SuccessStory> storyOpt = successStoryRepository.findById(storyId);
        if (storyOpt.isPresent()) {
            SuccessStory story = storyOpt.get();
            story.setLikeCount(story.getLikeCount() + 1);
            successStoryRepository.save(story);
        }
    }
    
    public void approveSuccessStory(Long storyId) {
        Optional<SuccessStory> storyOpt = successStoryRepository.findById(storyId);
        if (storyOpt.isPresent()) {
            SuccessStory story = storyOpt.get();
            story.setIsApproved(true);
            successStoryRepository.save(story);
        }
    }
    
    public void featureSuccessStory(Long storyId) {
        Optional<SuccessStory> storyOpt = successStoryRepository.findById(storyId);
        if (storyOpt.isPresent()) {
            SuccessStory story = storyOpt.get();
            story.setIsFeatured(true);
            successStoryRepository.save(story);
        }
    }
    
    // Peer Support Connection methods
    public List<PeerSupportConnection> getUserRequestedConnections(Long userId) {
        return peerSupportRepository.findByRequesterId(userId);
    }
    
    public List<PeerSupportConnection> getUserProvidedConnections(Long userId) {
        return peerSupportRepository.findByProviderId(userId);
    }
    
    public List<PeerSupportConnection> getUserPendingRequests(Long userId) {
        return peerSupportRepository.findByRequesterIdAndStatus(userId, "PENDING");
    }
    
    public List<PeerSupportConnection> getUserPendingSupport(Long userId) {
        return peerSupportRepository.findByProviderIdAndStatus(userId, "PENDING");
    }
    
    public Page<PeerSupportConnection> getPendingSupportRequests(Pageable pageable) {
        return peerSupportRepository.findByStatus("PENDING", pageable);
    }
    
    public PeerSupportConnection getSupportConnectionById(Long id) {
        return peerSupportRepository.findById(id).orElse(null);
    }
    
    public PeerSupportConnection createSupportConnection(PeerSupportConnection connection) {
        connection.setStatus("PENDING");
        return peerSupportRepository.save(connection);
    }
    
    public PeerSupportConnection updateSupportConnection(PeerSupportConnection connection) {
        return peerSupportRepository.save(connection);
    }
    
    public void acceptSupportRequest(Long connectionId) {
        Optional<PeerSupportConnection> connectionOpt = peerSupportRepository.findById(connectionId);
        if (connectionOpt.isPresent()) {
            PeerSupportConnection connection = connectionOpt.get();
            connection.setStatus("ACCEPTED");
            connection.setAcceptedAt(new Date());
            peerSupportRepository.save(connection);
        }
    }
    
    public void declineSupportRequest(Long connectionId) {
        Optional<PeerSupportConnection> connectionOpt = peerSupportRepository.findById(connectionId);
        if (connectionOpt.isPresent()) {
            PeerSupportConnection connection = connectionOpt.get();
            connection.setStatus("DECLINED");
            peerSupportRepository.save(connection);
        }
    }
    
    public void completeSupportConnection(Long connectionId) {
        Optional<PeerSupportConnection> connectionOpt = peerSupportRepository.findById(connectionId);
        if (connectionOpt.isPresent()) {
            PeerSupportConnection connection = connectionOpt.get();
            connection.setStatus("COMPLETED");
            connection.setCompletedAt(new Date());
            peerSupportRepository.save(connection);
        }
    }
}
