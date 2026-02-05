package com.techpathways.api.services;

import com.techpathways.api.models.*;
import com.techpathways.api.repositories.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

public class LearningPlanServiceTest {

    @Mock
    private LearningPlanRepository learningPlanRepository;

    @Mock
    private MilestoneRepository milestoneRepository;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ResourceRepository resourceRepository;

    @InjectMocks
    private LearningPlanService learningPlanService;

    private User testUser;
    private CareerPath testCareerPath;
    private CareerRecommendation testRecommendation;
    private UserProfile testUserProfile;
    private List<Resource> testResources;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);

        // Set up test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");

        // Set up test user profile
        testUserProfile = new UserProfile();
        testUserProfile.setId(1L);
        testUserProfile.setUser(testUser);
        testUserProfile.setFirstName("Test");
        testUserProfile.setLastName("User");
        testUserProfile.setLearningPreferences("Video Courses,Interactive Tutorials");

        // Set up test career path
        testCareerPath = new CareerPath();
        testCareerPath.setId(1L);
        testCareerPath.setTitle("Frontend Developer");
        testCareerPath.setDescription("Frontend developers build user interfaces for websites and applications.");
        testCareerPath.setRequiredSkills("HTML,CSS,JavaScript,React,UI/UX");

        // Set up test recommendation
        testRecommendation = new CareerRecommendation();
        testRecommendation.setId(1L);
        testRecommendation.setUser(testUser);
        testRecommendation.setCareerPath(testCareerPath);
        testRecommendation.setMatchPercentage(92.0);

        // Set up test resources
        testResources = new ArrayList<>();
        
        Resource resource1 = new Resource();
        resource1.setId(1L);
        resource1.setTitle("Frontend Masters");
        resource1.setDescription("Expert-led video courses on frontend development.");
        resource1.setUrl("https://frontendmasters.com");
        resource1.setType("Video Courses");
        resource1.setCategories("HTML,CSS,JavaScript,React");
        resource1.setRating(4.8);
        testResources.add(resource1);
        
        Resource resource2 = new Resource();
        resource2.setId(2L);
        resource2.setTitle("MDN Web Docs");
        resource2.setDescription("Comprehensive documentation for web technologies.");
        resource2.setUrl("https://developer.mozilla.org");
        resource2.setType("Documentation");
        resource2.setCategories("HTML,CSS,JavaScript,Web APIs");
        resource2.setRating(4.9);
        testResources.add(resource2);
        
        Resource resource3 = new Resource();
        resource3.setId(3L);
        resource3.setTitle("freeCodeCamp");
        resource3.setDescription("Interactive coding tutorials and projects.");
        resource3.setUrl("https://www.freecodecamp.org");
        resource3.setType("Interactive Tutorials");
        resource3.setCategories("HTML,CSS,JavaScript,React,Web Development");
        resource3.setRating(4.7);
        testResources.add(resource3);

        // Mock repository calls
        when(learningPlanRepository.save(any(LearningPlan.class))).thenAnswer(invocation -> {
            LearningPlan plan = invocation.getArgument(0);
            if (plan.getId() == null) {
                plan.setId(1L);
            }
            return plan;
        });
        
        when(milestoneRepository.save(any(Milestone.class))).thenAnswer(invocation -> {
            Milestone milestone = invocation.getArgument(0);
            if (milestone.getId() == null) {
                milestone.setId(new Random().nextLong());
            }
            return milestone;
        });
        
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> {
            Task task = invocation.getArgument(0);
            if (task.getId() == null) {
                task.setId(new Random().nextLong());
            }
            return task;
        });
        
        when(resourceRepository.findAll()).thenReturn(testResources);
    }

    @Test
    public void testGenerateLearningPlan_Success() {
        // Call the service method
        LearningPlan learningPlan = learningPlanService.generateLearningPlan(testUser, testRecommendation);
        
        // Verify the results
        assertNotNull(learningPlan);
        assertEquals(testUser, learningPlan.getUser());
        assertEquals(testCareerPath, learningPlan.getCareerPath());
        assertTrue(learningPlan.getTitle().contains(testCareerPath.getTitle()));
        assertNotNull(learningPlan.getDescription());
        assertNotNull(learningPlan.getCreatedAt());
        assertNotNull(learningPlan.getStartDate());
        assertNotNull(learningPlan.getEndDate());
        
        // Verify that the end date is approximately 1 year after the start date
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(learningPlan.getStartDate());
        calendar.add(Calendar.YEAR, 1);
        Date expectedEndDate = calendar.getTime();
        
        // Allow for a small difference due to execution time
        long difference = Math.abs(expectedEndDate.getTime() - learningPlan.getEndDate().getTime());
        assertTrue(difference < 1000); // Less than 1 second difference
        
        // Verify that milestones were created
        assertNotNull(learningPlan.getMilestones());
        assertFalse(learningPlan.getMilestones().isEmpty());
        
        // Verify that each milestone has tasks
        for (Milestone milestone : learningPlan.getMilestones()) {
            assertNotNull(milestone.getTasks());
            assertFalse(milestone.getTasks().isEmpty());
            assertEquals(learningPlan, milestone.getLearningPlan());
            assertFalse(milestone.isCompleted()); // All milestones should start as not completed
            
            // Verify that tasks are properly set up
            for (Task task : milestone.getTasks()) {
                assertEquals(milestone, task.getMilestone());
                assertNotNull(task.getTitle());
                assertNotNull(task.getDescription());
                assertFalse(task.isCompleted()); // All tasks should start as not completed
            }
        }
        
        // Verify repository calls
        verify(learningPlanRepository, times(2)).save(any(LearningPlan.class));
        verify(milestoneRepository, atLeastOnce()).save(any(Milestone.class));
        verify(taskRepository, atLeastOnce()).save(any(Task.class));
    }

    @Test
    public void testRecommendResources_Success() {
        // Set up a test learning plan
        LearningPlan learningPlan = new LearningPlan();
        learningPlan.setId(1L);
        learningPlan.setUser(testUser);
        learningPlan.setCareerPath(testCareerPath);
        learningPlan.setTitle("1-Year Frontend Developer Learning Path");
        
        // Call the service method
        List<ResourceRecommendation> recommendations = learningPlanService.recommendResources(
                learningPlan, testUserProfile);
        
        // Verify the results
        assertNotNull(recommendations);
        assertFalse(recommendations.isEmpty());
        
        // Verify that each recommendation is properly set up
        for (ResourceRecommendation recommendation : recommendations) {
            assertEquals(testUser, recommendation.getUser());
            assertEquals(learningPlan, recommendation.getLearningPlan());
            assertNotNull(recommendation.getResource());
            assertNotNull(recommendation.getRecommendationDate());
        }
        
        // Verify that resources relevant to frontend development are recommended
        boolean hasFrontendResource = recommendations.stream()
                .anyMatch(r -> r.getResource().getCategories().contains("React") || 
                               r.getResource().getCategories().contains("JavaScript"));
        
        assertTrue(hasFrontendResource);
        
        // Verify that resources matching user preferences are prioritized
        // The user prefers "Video Courses" and "Interactive Tutorials"
        List<ResourceRecommendation> topRecommendations = recommendations.subList(0, 
                Math.min(2, recommendations.size()));
        
        boolean hasPreferredType = topRecommendations.stream()
                .anyMatch(r -> r.getResource().getType().equals("Video Courses") || 
                               r.getResource().getType().equals("Interactive Tutorials"));
        
        assertTrue(hasPreferredType);
        
        // Verify repository calls
        verify(resourceRepository, times(1)).findAll();
    }

    @Test
    public void testUpdateProgress_Success() {
        // Set up a test learning plan with milestones and tasks
        LearningPlan learningPlan = new LearningPlan();
        learningPlan.setId(1L);
        learningPlan.setUser(testUser);
        learningPlan.setCareerPath(testCareerPath);
        
        List<Milestone> milestones = new ArrayList<>();
        
        // Milestone 1 with all tasks completed
        Milestone milestone1 = new Milestone();
        milestone1.setId(1L);
        milestone1.setLearningPlan(learningPlan);
        milestone1.setTitle("Milestone 1");
        milestone1.setCompleted(false); // Will be updated by the service
        
        List<Task> tasks1 = new ArrayList<>();
        Task task1 = new Task();
        task1.setId(1L);
        task1.setMilestone(milestone1);
        task1.setTitle("Task 1");
        task1.setCompleted(true);
        tasks1.add(task1);
        
        Task task2 = new Task();
        task2.setId(2L);
        task2.setMilestone(milestone1);
        task2.setTitle("Task 2");
        task2.setCompleted(true);
        tasks1.add(task2);
        
        milestone1.setTasks(tasks1);
        milestones.add(milestone1);
        
        // Milestone 2 with some tasks completed
        Milestone milestone2 = new Milestone();
        milestone2.setId(2L);
        milestone2.setLearningPlan(learningPlan);
        milestone2.setTitle("Milestone 2");
        milestone2.setCompleted(false); // Will be updated by the service
        
        List<Task> tasks2 = new ArrayList<>();
        Task task3 = new Task();
        task3.setId(3L);
        task3.setMilestone(milestone2);
        task3.setTitle("Task 3");
        task3.setCompleted(true);
        tasks2.add(task3);
        
        Task task4 = new Task();
        task4.setId(4L);
        task4.setMilestone(milestone2);
        task4.setTitle("Task 4");
        task4.setCompleted(false);
        tasks2.add(task4);
        
        milestone2.setTasks(tasks2);
        milestones.add(milestone2);
        
        learningPlan.setMilestones(milestones);
        
        // Call the service method
        LearningPlan updatedPlan = learningPlanService.updateProgress(learningPlan);
        
        // Verify the results
        assertNotNull(updatedPlan);
        
        // Calculate expected progress: 3 out of 4 tasks completed = 75%
        assertEquals(75, updatedPlan.getProgressPercentage());
        
        // Verify milestone completion status
        assertTrue(updatedPlan.getMilestones().get(0).isCompleted()); // All tasks completed
        assertFalse(updatedPlan.getMilestones().get(1).isCompleted()); // Not all tasks completed
        
        // Verify repository calls
        verify(milestoneRepository, times(2)).save(any(Milestone.class));
        verify(learningPlanRepository, times(1)).save(any(LearningPlan.class));
    }

    @Test
    public void testUpdateProgress_EmptyMilestones() {
        // Set up a test learning plan with no milestones
        LearningPlan learningPlan = new LearningPlan();
        learningPlan.setId(1L);
        learningPlan.setUser(testUser);
        learningPlan.setCareerPath(testCareerPath);
        learningPlan.setMilestones(new ArrayList<>());
        
        // Call the service method
        LearningPlan updatedPlan = learningPlanService.updateProgress(learningPlan);
        
        // Verify the results
        assertNotNull(updatedPlan);
        assertEquals(0, updatedPlan.getProgressPercentage()); // No tasks = 0% progress
        
        // Verify repository calls
        verify(milestoneRepository, never()).save(any(Milestone.class));
        verify(learningPlanRepository, times(1)).save(any(LearningPlan.class));
    }
}
