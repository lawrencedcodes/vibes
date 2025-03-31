package com.techcareer.app;

import com.techcareer.app.model.CareerPath;
import com.techcareer.app.model.JobRole;
import com.techcareer.app.model.UserAssessment;
import com.techcareer.app.service.CareerRecommendationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
public class CareerRecommendationServiceTests {

    @InjectMocks
    private CareerRecommendationService recommendationService;

    @Mock
    private UserAssessment mockAssessment;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        
        // Setup mock assessment data
        Map<String, Integer> interestScores = new HashMap<>();
        interestScores.put("web_development", 8);
        interestScores.put("data_science", 5);
        interestScores.put("cybersecurity", 3);
        
        Map<String, Integer> skillScores = new HashMap<>();
        skillScores.put("javascript", 7);
        skillScores.put("html_css", 8);
        skillScores.put("problem_solving", 6);
        
        when(mockAssessment.getInterestScores()).thenReturn(interestScores);
        when(mockAssessment.getSkillScores()).thenReturn(skillScores);
        when(mockAssessment.getPreferredWorkStyle()).thenReturn("remote");
    }

    @Test
    public void testGenerateCareerRecommendations() {
        // Execute
        List<Map<String, Object>> recommendations = recommendationService.generateRecommendations(mockAssessment);
        
        // Assert
        assertThat(recommendations).isNotNull();
        assertThat(recommendations.size()).isGreaterThan(0);
        
        // Verify first recommendation has expected structure
        Map<String, Object> firstRecommendation = recommendations.get(0);
        assertThat(firstRecommendation).containsKeys("jobRole", "matchScore", "reasons");
        assertThat(firstRecommendation.get("matchScore")).isInstanceOf(Number.class);
        assertThat(firstRecommendation.get("reasons")).isInstanceOf(List.class);
    }

    @Test
    public void testRecommendationsSortedByMatchScore() {
        // Execute
        List<Map<String, Object>> recommendations = recommendationService.generateRecommendations(mockAssessment);
        
        // Assert
        assertThat(recommendations.size()).isGreaterThan(1);
        
        double previousScore = Double.MAX_VALUE;
        for (Map<String, Object> recommendation : recommendations) {
            double currentScore = ((Number) recommendation.get("matchScore")).doubleValue();
            assertThat(currentScore).isLessThanOrEqualTo(previousScore);
            previousScore = currentScore;
        }
    }

    @Test
    public void testWebDevelopmentHighestRecommendation() {
        // Given assessment with high web development interest
        Map<String, Integer> interestScores = new HashMap<>();
        interestScores.put("web_development", 10);
        interestScores.put("data_science", 2);
        interestScores.put("cybersecurity", 1);
        
        when(mockAssessment.getInterestScores()).thenReturn(interestScores);
        
        // Execute
        List<Map<String, Object>> recommendations = recommendationService.generateRecommendations(mockAssessment);
        
        // Assert
        assertThat(recommendations.size()).isGreaterThan(0);
        Map<String, Object> topRecommendation = recommendations.get(0);
        JobRole topRole = (JobRole) topRecommendation.get("jobRole");
        
        // The top recommendation should be in the web development path
        assertThat(topRole.getCareerPath().getName().toLowerCase()).contains("web");
    }

    @Test
    public void testExplanationGeneration() {
        // Execute
        List<Map<String, Object>> recommendations = recommendationService.generateRecommendations(mockAssessment);
        
        // Assert
        assertThat(recommendations.size()).isGreaterThan(0);
        Map<String, Object> recommendation = recommendations.get(0);
        List<String> reasons = (List<String>) recommendation.get("reasons");
        
        assertThat(reasons).isNotNull();
        assertThat(reasons.size()).isGreaterThan(0);
        
        // Reasons should be non-empty strings
        for (String reason : reasons) {
            assertThat(reason).isNotEmpty();
        }
    }
}
