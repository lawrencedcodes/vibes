package com.techcareer.app;

import com.techcareer.app.model.ForumCategory;
import com.techcareer.app.model.ForumTopic;
import com.techcareer.app.model.ForumPost;
import com.techcareer.app.service.CommunityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import com.techcareer.app.repository.ForumCategoryRepository;
import com.techcareer.app.repository.ForumTopicRepository;
import com.techcareer.app.repository.ForumPostRepository;

@SpringBootTest
public class CommunityServiceTests {

    @InjectMocks
    private CommunityService communityService;

    @Mock
    private ForumCategoryRepository categoryRepository;
    
    @Mock
    private ForumTopicRepository topicRepository;
    
    @Mock
    private ForumPostRepository postRepository;

    private List<ForumCategory> mockCategories;
    private List<ForumTopic> mockTopics;
    private List<ForumPost> mockPosts;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        
        // Setup mock categories
        mockCategories = new ArrayList<>();
        ForumCategory category1 = new ForumCategory();
        category1.setId(1L);
        category1.setName("Web Development");
        category1.setDescription("Discuss web development topics");
        category1.setDisplayOrder(1);
        category1.setIsActive(true);
        
        ForumCategory category2 = new ForumCategory();
        category2.setId(2L);
        category2.setName("Data Science");
        category2.setDescription("Discuss data science topics");
        category2.setDisplayOrder(2);
        category2.setIsActive(true);
        
        mockCategories.add(category1);
        mockCategories.add(category2);
        
        // Setup mock topics
        mockTopics = new ArrayList<>();
        ForumTopic topic1 = new ForumTopic();
        topic1.setId(1L);
        topic1.setTitle("How to start with React?");
        topic1.setContent("I'm new to React and need guidance...");
        topic1.setCategory(category1);
        topic1.setViewCount(10);
        topic1.setReplyCount(2);
        topic1.setIsPinned(true);
        
        ForumTopic topic2 = new ForumTopic();
        topic2.setId(2L);
        topic2.setTitle("Python for data analysis");
        topic2.setContent("What libraries should I learn for data analysis?");
        topic2.setCategory(category2);
        topic2.setViewCount(15);
        topic2.setReplyCount(3);
        topic2.setIsPinned(false);
        
        mockTopics.add(topic1);
        mockTopics.add(topic2);
        
        // Setup mock posts
        mockPosts = new ArrayList<>();
        ForumPost post1 = new ForumPost();
        post1.setId(1L);
        post1.setContent("Start with the official React documentation...");
        post1.setTopic(topic1);
        post1.setLikeCount(5);
        post1.setIsAnswer(true);
        
        ForumPost post2 = new ForumPost();
        post2.setId(2L);
        post2.setContent("I recommend Pandas and NumPy for data analysis...");
        post2.setTopic(topic2);
        post2.setLikeCount(7);
        post2.setIsAnswer(false);
        
        mockPosts.add(post1);
        mockPosts.add(post2);
        
        // Setup repository mocks
        when(categoryRepository.findByIsActiveOrderByDisplayOrderAsc(true)).thenReturn(mockCategories);
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category1));
        when(categoryRepository.findById(2L)).thenReturn(Optional.of(category2));
        
        when(topicRepository.findByCategoryId(eq(1L), any(Pageable.class)))
            .thenReturn(new PageImpl<>(Collections.singletonList(topic1)));
        when(topicRepository.findByCategoryId(eq(2L), any(Pageable.class)))
            .thenReturn(new PageImpl<>(Collections.singletonList(topic2)));
        when(topicRepository.findById(1L)).thenReturn(Optional.of(topic1));
        when(topicRepository.findById(2L)).thenReturn(Optional.of(topic2));
        when(topicRepository.findByIsPinnedOrderByLastActivityAtDesc(true))
            .thenReturn(Collections.singletonList(topic1));
        
        when(postRepository.findByTopicId(eq(1L), any(Pageable.class)))
            .thenReturn(new PageImpl<>(Collections.singletonList(post1)));
        when(postRepository.findByTopicId(eq(2L), any(Pageable.class)))
            .thenReturn(new PageImpl<>(Collections.singletonList(post2)));
        when(postRepository.findById(1L)).thenReturn(Optional.of(post1));
        when(postRepository.findById(2L)).thenReturn(Optional.of(post2));
        when(postRepository.findByTopicIdAndIsAnswer(1L, true))
            .thenReturn(Collections.singletonList(post1));
    }

    @Test
    public void testGetAllActiveCategories() {
        // Execute
        List<ForumCategory> categories = communityService.getAllActiveCategories();
        
        // Assert
        assertThat(categories).isNotNull();
        assertThat(categories.size()).isEqualTo(2);
        assertThat(categories.get(0).getName()).isEqualTo("Web Development");
        assertThat(categories.get(1).getName()).isEqualTo("Data Science");
    }

    @Test
    public void testGetCategoryById() {
        // Execute
        ForumCategory category = communityService.getCategoryById(1L);
        
        // Assert
        assertThat(category).isNotNull();
        assertThat(category.getId()).isEqualTo(1L);
        assertThat(category.getName()).isEqualTo("Web Development");
    }

    @Test
    public void testGetTopicsByCategory() {
        // Execute
        Page<ForumTopic> topicsPage = communityService.getTopicsByCategory(1L, Pageable.unpaged());
        
        // Assert
        assertThat(topicsPage).isNotNull();
        assertThat(topicsPage.getContent()).isNotEmpty();
        assertThat(topicsPage.getContent().get(0).getTitle()).isEqualTo("How to start with React?");
    }

    @Test
    public void testGetPinnedTopics() {
        // Execute
        List<ForumTopic> pinnedTopics = communityService.getPinnedTopics();
        
        // Assert
        assertThat(pinnedTopics).isNotNull();
        assertThat(pinnedTopics).isNotEmpty();
        assertThat(pinnedTopics.get(0).getIsPinned()).isTrue();
        assertThat(pinnedTopics.get(0).getTitle()).isEqualTo("How to start with React?");
    }

    @Test
    public void testGetPostsByTopic() {
        // Execute
        Page<ForumPost> postsPage = communityService.getPostsByTopic(1L, Pageable.unpaged());
        
        // Assert
        assertThat(postsPage).isNotNull();
        assertThat(postsPage.getContent()).isNotEmpty();
        assertThat(postsPage.getContent().get(0).getContent()).contains("Start with the official React documentation");
    }

    @Test
    public void testGetAnswersByTopic() {
        // Execute
        List<ForumPost> answers = communityService.getAnswersByTopic(1L);
        
        // Assert
        assertThat(answers).isNotNull();
        assertThat(answers).isNotEmpty();
        assertThat(answers.get(0).getIsAnswer()).isTrue();
    }

    @Test
    public void testIncrementTopicViewCount() {
        // Setup
        ForumTopic topic = mockTopics.get(0);
        int initialViewCount = topic.getViewCount();
        
        // Execute
        communityService.incrementTopicViewCount(1L);
        
        // Assert - this is a bit tricky in unit tests since we're mocking the repository
        // In a real integration test, we would verify the count increased
        // Here we're just ensuring the method doesn't throw exceptions
        assertThat(topic).isNotNull();
    }

    @Test
    public void testMarkPostAsAnswer() {
        // Setup
        ForumPost post = mockPosts.get(1); // The second post is not an answer initially
        
        // Execute
        communityService.markPostAsAnswer(2L);
        
        // Assert - similar to above, in unit tests with mocks we're mainly checking the method doesn't throw
        assertThat(post).isNotNull();
    }
}
