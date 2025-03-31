package com.techcareer.app;

import com.techcareer.app.model.LearningPlan;
import com.techcareer.app.model.LearningPlanMilestone;
import com.techcareer.app.model.User;
import com.techcareer.app.model.JobRole;
import com.techcareer.app.service.LearningPlanService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
public class LearningPlanServiceTests {

    @InjectMocks
    private LearningPlanService learningPlanService;

    @Mock
    private User mockUser;
    
    @Mock
    private JobRole mockJobRole;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        
        // Setup mock user data
        when(mockUser.getId()).thenReturn(1L);
        
        // Setup mock job role data
        when(mockJobRole.getId()).thenReturn(1L);
        when(mockJobRole.getTitle()).thenReturn("Frontend Developer");
        
        Map<String, Integer> skillLevels = new HashMap<>();
        skillLevels.put("javascript", 3); // Beginner
        skillLevels.put("html_css", 4); // Intermediate
        skillLevels.put("react", 1); // Novice
        
        when(mockUser.getSkillLevels()).thenReturn(skillLevels);
    }

    @Test
    public void testGenerateLearningPlan() {
        // Execute
        LearningPlan plan = learningPlanService.generateLearningPlan(mockUser, mockJobRole, "balanced", 10);
        
        // Assert
        assertThat(plan).isNotNull();
        assertThat(plan.getUser().getId()).isEqualTo(mockUser.getId());
        assertThat(plan.getTargetRole().getId()).isEqualTo(mockJobRole.getId());
        assertThat(plan.getMilestones()).isNotEmpty();
        assertThat(plan.getDurationWeeks()).isEqualTo(52); // 1 year
    }

    @Test
    public void testLearningPlanHasFourPhases() {
        // Execute
        LearningPlan plan = learningPlanService.generateLearningPlan(mockUser, mockJobRole, "balanced", 10);
        
        // Assert
        List<LearningPlanMilestone> milestones = plan.getMilestones();
        
        // Check for foundation phase (months 1-3)
        boolean hasFoundationPhase = milestones.stream()
            .anyMatch(m -> m.getPhase().equalsIgnoreCase("foundation"));
            
        // Check for building phase (months 4-6)
        boolean hasBuildingPhase = milestones.stream()
            .anyMatch(m -> m.getPhase().equalsIgnoreCase("building"));
            
        // Check for specialization phase (months 7-9)
        boolean hasSpecializationPhase = milestones.stream()
            .anyMatch(m -> m.getPhase().equalsIgnoreCase("specialization"));
            
        // Check for career preparation phase (months 10-12)
        boolean hasCareerPrepPhase = milestones.stream()
            .anyMatch(m -> m.getPhase().equalsIgnoreCase("career_preparation"));
            
        assertThat(hasFoundationPhase).isTrue();
        assertThat(hasBuildingPhase).isTrue();
        assertThat(hasSpecializationPhase).isTrue();
        assertThat(hasCareerPrepPhase).isTrue();
    }

    @Test
    public void testMilestonesAreChronologicallyOrdered() {
        // Execute
        LearningPlan plan = learningPlanService.generateLearningPlan(mockUser, mockJobRole, "balanced", 10);
        
        // Assert
        List<LearningPlanMilestone> milestones = plan.getMilestones();
        
        // Check that milestones are ordered by week
        int previousWeek = 0;
        for (LearningPlanMilestone milestone : milestones) {
            assertThat(milestone.getWeekNumber()).isGreaterThanOrEqualTo(previousWeek);
            previousWeek = milestone.getWeekNumber();
        }
    }

    @Test
    public void testLearningPlanAdaptsToSkillLevel() {
        // Setup a user with advanced skills
        Map<String, Integer> advancedSkills = new HashMap<>();
        advancedSkills.put("javascript", 8); // Advanced
        advancedSkills.put("html_css", 9); // Expert
        advancedSkills.put("react", 7); // Advanced
        
        when(mockUser.getSkillLevels()).thenReturn(advancedSkills);
        
        // Execute
        LearningPlan advancedPlan = learningPlanService.generateLearningPlan(mockUser, mockJobRole, "balanced", 10);
        
        // Reset to beginner skills
        Map<String, Integer> beginnerSkills = new HashMap<>();
        beginnerSkills.put("javascript", 2); // Novice
        beginnerSkills.put("html_css", 3); // Beginner
        beginnerSkills.put("react", 1); // Novice
        
        when(mockUser.getSkillLevels()).thenReturn(beginnerSkills);
        
        // Execute
        LearningPlan beginnerPlan = learningPlanService.generateLearningPlan(mockUser, mockJobRole, "balanced", 10);
        
        // Assert - advanced plan should have more advanced content
        boolean advancedPlanHasAdvancedContent = advancedPlan.getMilestones().stream()
            .anyMatch(m -> m.getTitle().toLowerCase().contains("advanced") || 
                          m.getDescription().toLowerCase().contains("advanced"));
                          
        boolean beginnerPlanHasBasicContent = beginnerPlan.getMilestones().stream()
            .anyMatch(m -> m.getTitle().toLowerCase().contains("basic") || 
                          m.getDescription().toLowerCase().contains("basic") ||
                          m.getTitle().toLowerCase().contains("introduction") || 
                          m.getDescription().toLowerCase().contains("introduction"));
        
        assertThat(advancedPlanHasAdvancedContent).isTrue();
        assertThat(beginnerPlanHasBasicContent).isTrue();
    }

    @Test
    public void testLearningPlanIncludesAllRequiredSections() {
        // Execute
        LearningPlan plan = learningPlanService.generateLearningPlan(mockUser, mockJobRole, "balanced", 10);
        
        // Assert - check for required sections
        List<LearningPlanMilestone> milestones = plan.getMilestones();
        
        boolean hasPortfolioBuilding = milestones.stream()
            .anyMatch(m -> m.getTitle().toLowerCase().contains("portfolio") || 
                          m.getDescription().toLowerCase().contains("portfolio"));
                          
        boolean hasNetworking = milestones.stream()
            .anyMatch(m -> m.getTitle().toLowerCase().contains("network") || 
                          m.getDescription().toLowerCase().contains("network"));
                          
        boolean hasInterviewPrep = milestones.stream()
            .anyMatch(m -> m.getTitle().toLowerCase().contains("interview") || 
                          m.getDescription().toLowerCase().contains("interview"));
                          
        boolean hasResume = milestones.stream()
            .anyMatch(m -> m.getTitle().toLowerCase().contains("resume") || 
                          m.getDescription().toLowerCase().contains("resume") ||
                          m.getTitle().toLowerCase().contains("cv") || 
                          m.getDescription().toLowerCase().contains("cv"));
        
        assertThat(hasPortfolioBuilding).isTrue();
        assertThat(hasNetworking).isTrue();
        assertThat(hasInterviewPrep).isTrue();
        assertThat(hasResume).isTrue();
    }
}
