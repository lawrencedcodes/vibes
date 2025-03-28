package com.techpathways.api.controllers;

import com.techpathways.api.models.*;
import com.techpathways.api.payload.response.MessageResponse;
import com.techpathways.api.repositories.AssessmentAnswerRepository;
import com.techpathways.api.repositories.AssessmentRepository;
import com.techpathways.api.repositories.CareerRecommendationRepository;
import com.techpathways.api.repositories.UserRepository;
import com.techpathways.api.services.CareerRecommendationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class CareerControllerTest {

    @Mock
    private CareerRecommendationService careerRecommendationService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AssessmentRepository assessmentRepository;

    @Mock
    private AssessmentAnswerRepository answerRepository;

    @Mock
    private CareerRecommendationRepository recommendationRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private CareerController careerController;

    private User testUser;
    private Assessment testAssessment;
    private List<AssessmentAnswer> testAnswers;
    private List<CareerRecommendation> testRecommendations;

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

        // Set up test recommendations
        testRecommendations = new ArrayList<>();
        CareerPath careerPath1 = new CareerPath();
        careerPath1.setId(1L);
        careerPath1.setTitle("Frontend Developer");
        careerPath1.setDescription("Frontend developers build user interfaces for websites and applications.");
        careerPath1.setRequiredSkills("HTML,CSS,JavaScript,React");

        CareerRecommendation recommendation1 = new CareerRecommendation();
        recommendation1.setId(1L);
        recommendation1.setUser(testUser);
        recommendation1.setCareerPath(careerPath1);
        recommendation1.setMatchPercentage(92.0);
        recommendation1.setAssessment(testAssessment);
        testRecommendations.add(recommendation1);

        // Mock authentication
        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
    }

    @Test
    public void testGetCareerRecommendations_Success() {
        // Mock repository calls
        when(recommendationRepository.findByUserOrderByMatchPercentageDesc(testUser))
                .thenReturn(testRecommendations);

        // Call the controller method
        ResponseEntity<?> response = careerController.getCareerRecommendations(authentication);

        // Verify the response
        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof List);
        List<?> recommendations = (List<?>) response.getBody();
        assertEquals(1, recommendations.size());
        
        // Verify repository was called
        verify(recommendationRepository, times(1)).findByUserOrderByMatchPercentageDesc(testUser);
    }

    @Test
    public void testGetCareerRecommendations_NoRecommendations() {
        // Mock repository calls
        when(recommendationRepository.findByUserOrderByMatchPercentageDesc(testUser))
                .thenReturn(Collections.emptyList());

        // Call the controller method
        ResponseEntity<?> response = careerController.getCareerRecommendations(authentication);

        // Verify the response
        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof List);
        List<?> recommendations = (List<?>) response.getBody();
        assertEquals(0, recommendations.size());
        
        // Verify repository was called
        verify(recommendationRepository, times(1)).findByUserOrderByMatchPercentageDesc(testUser);
    }

    @Test
    public void testGenerateRecommendations_Success() {
        // Mock repository calls
        when(assessmentRepository.findByIdAndUser(1L, testUser))
                .thenReturn(Optional.of(testAssessment));
        when(answerRepository.findByAssessment(testAssessment))
                .thenReturn(testAnswers);
        when(careerRecommendationService.generateRecommendations(testUser, testAssessment, testAnswers))
                .thenReturn(testRecommendations);

        // Call the controller method
        ResponseEntity<?> response = careerController.generateRecommendations(1L, authentication);

        // Verify the response
        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof List);
        List<?> recommendations = (List<?>) response.getBody();
        assertEquals(1, recommendations.size());
        
        // Verify service and repositories were called
        verify(assessmentRepository, times(1)).findByIdAndUser(1L, testUser);
        verify(answerRepository, times(1)).findByAssessment(testAssessment);
        verify(careerRecommendationService, times(1)).generateRecommendations(testUser, testAssessment, testAnswers);
    }

    @Test
    public void testGenerateRecommendations_AssessmentNotFound() {
        // Mock repository calls
        when(assessmentRepository.findByIdAndUser(1L, testUser))
                .thenReturn(Optional.empty());

        // Call the controller method
        ResponseEntity<?> response = careerController.generateRecommendations(1L, authentication);

        // Verify the response
        assertEquals(404, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof MessageResponse);
        MessageResponse messageResponse = (MessageResponse) response.getBody();
        assertEquals("Assessment not found", messageResponse.getMessage());
        
        // Verify repository was called
        verify(assessmentRepository, times(1)).findByIdAndUser(1L, testUser);
        verify(answerRepository, never()).findByAssessment(any());
        verify(careerRecommendationService, never()).generateRecommendations(any(), any(), any());
    }

    @Test
    public void testGenerateRecommendations_NoAnswers() {
        // Mock repository calls
        when(assessmentRepository.findByIdAndUser(1L, testUser))
                .thenReturn(Optional.of(testAssessment));
        when(answerRepository.findByAssessment(testAssessment))
                .thenReturn(Collections.emptyList());

        // Call the controller method
        ResponseEntity<?> response = careerController.generateRecommendations(1L, authentication);

        // Verify the response
        assertEquals(400, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof MessageResponse);
        MessageResponse messageResponse = (MessageResponse) response.getBody();
        assertEquals("No answers found for this assessment", messageResponse.getMessage());
        
        // Verify repositories were called
        verify(assessmentRepository, times(1)).findByIdAndUser(1L, testUser);
        verify(answerRepository, times(1)).findByAssessment(testAssessment);
        verify(careerRecommendationService, never()).generateRecommendations(any(), any(), any());
    }
}
