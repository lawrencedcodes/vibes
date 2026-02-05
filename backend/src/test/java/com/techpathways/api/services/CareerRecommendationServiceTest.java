package com.techpathways.api.services;

import com.techpathways.api.models.*;
import com.techpathways.api.repositories.CareerPathRepository;
import com.techpathways.api.repositories.CareerRecommendationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

public class CareerRecommendationServiceTest {

    @Mock
    private CareerPathRepository careerPathRepository;

    @Mock
    private CareerRecommendationRepository careerRecommendationRepository;

    @InjectMocks
    private CareerRecommendationService careerRecommendationService;

    private User testUser;
    private Assessment testAssessment;
    private List<AssessmentAnswer> testAnswers;
    private List<CareerPath> testCareerPaths;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);

        // Set up test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");

        // Set up test assessment
        testAssessment = new Assessment();
        testAssessment.setId(1L);
        testAssessment.setTitle("Career Assessment");
        testAssessment.setUser(testUser);

        // Set up test answers
        testAnswers = new ArrayList<>();
        
        // Interest questions
        Question question1 = new Question();
        question1.setId(1L);
        question1.setQuestionId("interest_1");
        question1.setText("Which of these activities do you enjoy the most?");

        AssessmentAnswer answer1 = new AssessmentAnswer();
        answer1.setId(1L);
        answer1.setQuestion(question1);
        answer1.setAnswerValue("Designing user interfaces and visual elements");
        answer1.setAssessment(testAssessment);
        testAnswers.add(answer1);
        
        Question question2 = new Question();
        question2.setId(2L);
        question2.setQuestionId("interest_2");
        question2.setText("What type of projects would you be most excited to work on?");

        AssessmentAnswer answer2 = new AssessmentAnswer();
        answer2.setId(2L);
        answer2.setQuestion(question2);
        answer2.setAnswerValue("Websites and mobile applications");
        answer2.setAssessment(testAssessment);
        testAnswers.add(answer2);
        
        // Skill questions
        Question question3 = new Question();
        question3.setId(3L);
        question3.setQuestionId("skill_1");
        question3.setText("How would you rate your problem-solving abilities?");

        AssessmentAnswer answer3 = new AssessmentAnswer();
        answer3.setId(3L);
        answer3.setQuestion(question3);
        answer3.setAnswerValue("Strong - I can usually find solutions");
        answer3.setAssessment(testAssessment);
        testAnswers.add(answer3);
        
        // Set up test career paths
        testCareerPaths = new ArrayList<>();
        
        CareerPath frontendDev = new CareerPath();
        frontendDev.setId(1L);
        frontendDev.setTitle("Frontend Developer");
        frontendDev.setDescription("Frontend developers build user interfaces for websites and applications.");
        frontendDev.setRequiredSkills("HTML,CSS,JavaScript,React,UI/UX");
        testCareerPaths.add(frontendDev);
        
        CareerPath backendDev = new CareerPath();
        backendDev.setId(2L);
        backendDev.setTitle("Backend Developer");
        backendDev.setDescription("Backend developers build server-side logic and databases.");
        backendDev.setRequiredSkills("Java,Python,SQL,APIs,Algorithms");
        testCareerPaths.add(backendDev);
        
        CareerPath dataScientist = new CareerPath();
        dataScientist.setId(3L);
        dataScientist.setTitle("Data Scientist");
        dataScientist.setDescription("Data scientists analyze and interpret complex data.");
        dataScientist.setRequiredSkills("Python,R,Statistics,Machine Learning,SQL");
        testCareerPaths.add(dataScientist);
        
        // Mock repository calls
        when(careerPathRepository.findAll()).thenReturn(testCareerPaths);
        when(careerRecommendationRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    public void testGenerateRecommendations_Success() {
        // Call the service method
        List<CareerRecommendation> recommendations = careerRecommendationService.generateRecommendations(
                testUser, testAssessment, testAnswers);
        
        // Verify the results
        assertNotNull(recommendations);
        assertFalse(recommendations.isEmpty());
        
        // Verify that recommendations are sorted by match percentage (descending)
        for (int i = 0; i < recommendations.size() - 1; i++) {
            assertTrue(recommendations.get(i).getMatchPercentage() >= recommendations.get(i + 1).getMatchPercentage());
        }
        
        // Verify that each recommendation has the correct user and assessment
        for (CareerRecommendation recommendation : recommendations) {
            assertEquals(testUser, recommendation.getUser());
            assertEquals(testAssessment, recommendation.getAssessment());
            assertNotNull(recommendation.getCareerPath());
            assertTrue(recommendation.getMatchPercentage() >= 50.0); // Minimum threshold
            assertTrue(recommendation.getMatchPercentage() <= 100.0); // Maximum possible
            assertNotNull(recommendation.getCreatedAt());
        }
        
        // Verify repository calls
        verify(careerPathRepository, times(1)).findAll();
        verify(careerRecommendationRepository, times(1)).saveAll(anyList());
    }

    @Test
    public void testGenerateRecommendations_EmptyAnswers() {
        // Call the service method with empty answers
        List<CareerRecommendation> recommendations = careerRecommendationService.generateRecommendations(
                testUser, testAssessment, new ArrayList<>());
        
        // Verify the results
        assertNotNull(recommendations);
        // Even with empty answers, the algorithm should return some recommendations
        // with default/neutral scores
        assertFalse(recommendations.isEmpty());
        
        // Verify repository calls
        verify(careerPathRepository, times(1)).findAll();
        verify(careerRecommendationRepository, times(1)).saveAll(anyList());
    }

    @Test
    public void testGenerateRecommendations_NoCareerPaths() {
        // Mock empty career paths
        when(careerPathRepository.findAll()).thenReturn(new ArrayList<>());
        
        // Call the service method
        List<CareerRecommendation> recommendations = careerRecommendationService.generateRecommendations(
                testUser, testAssessment, testAnswers);
        
        // Verify the results
        assertNotNull(recommendations);
        assertTrue(recommendations.isEmpty());
        
        // Verify repository calls
        verify(careerPathRepository, times(1)).findAll();
        verify(careerRecommendationRepository, never()).saveAll(anyList());
    }

    @Test
    public void testGenerateRecommendations_FrontendDeveloperPreference() {
        // Set up answers that strongly indicate frontend developer preference
        List<AssessmentAnswer> frontendAnswers = new ArrayList<>();
        
        // Interest in visual design
        Question q1 = new Question();
        q1.setQuestionId("interest_1");
        AssessmentAnswer a1 = new AssessmentAnswer();
        a1.setQuestion(q1);
        a1.setAnswerValue("Designing user interfaces and visual elements");
        frontendAnswers.add(a1);
        
        // Interest in web projects
        Question q2 = new Question();
        q2.setQuestionId("interest_2");
        AssessmentAnswer a2 = new AssessmentAnswer();
        a2.setQuestion(q2);
        a2.setAnswerValue("Websites and mobile applications");
        frontendAnswers.add(a2);
        
        // Interest in web technologies
        Question q3 = new Question();
        q3.setQuestionId("interest_3");
        AssessmentAnswer a3 = new AssessmentAnswer();
        a3.setQuestion(q3);
        a3.setAnswerValue("Web development (HTML, CSS, JavaScript),Mobile app development");
        frontendAnswers.add(a3);
        
        // Call the service method
        List<CareerRecommendation> recommendations = careerRecommendationService.generateRecommendations(
                testUser, testAssessment, frontendAnswers);
        
        // Verify the results
        assertNotNull(recommendations);
        assertFalse(recommendations.isEmpty());
        
        // The first recommendation should be Frontend Developer
        assertEquals("Frontend Developer", recommendations.get(0).getCareerPath().getTitle());
        
        // Frontend Developer should have a high match percentage
        assertTrue(recommendations.get(0).getMatchPercentage() >= 75.0);
    }

    @Test
    public void testGenerateRecommendations_DataScientistPreference() {
        // Set up answers that strongly indicate data scientist preference
        List<AssessmentAnswer> dataAnswers = new ArrayList<>();
        
        // Interest in data analysis
        Question q1 = new Question();
        q1.setQuestionId("interest_1");
        AssessmentAnswer a1 = new AssessmentAnswer();
        a1.setQuestion(q1);
        a1.setAnswerValue("Analyzing data and finding patterns");
        dataAnswers.add(a1);
        
        // Interest in data projects
        Question q2 = new Question();
        q2.setQuestionId("interest_2");
        AssessmentAnswer a2 = new AssessmentAnswer();
        a2.setQuestion(q2);
        a2.setAnswerValue("Data analysis and visualization");
        dataAnswers.add(a2);
        
        // Strong problem-solving skills
        Question q3 = new Question();
        q3.setQuestionId("skill_1");
        AssessmentAnswer a3 = new AssessmentAnswer();
        a3.setQuestion(q3);
        a3.setAnswerValue("Very strong - I enjoy complex problems");
        dataAnswers.add(a3);
        
        // Call the service method
        List<CareerRecommendation> recommendations = careerRecommendationService.generateRecommendations(
                testUser, testAssessment, dataAnswers);
        
        // Verify the results
        assertNotNull(recommendations);
        assertFalse(recommendations.isEmpty());
        
        // Find the Data Scientist recommendation
        CareerRecommendation dataScientistRec = recommendations.stream()
                .filter(r -> r.getCareerPath().getTitle().equals("Data Scientist"))
                .findFirst()
                .orElse(null);
        
        // Data Scientist should be present and have a high match percentage
        assertNotNull(dataScientistRec);
        assertTrue(dataScientistRec.getMatchPercentage() >= 75.0);
    }
}
