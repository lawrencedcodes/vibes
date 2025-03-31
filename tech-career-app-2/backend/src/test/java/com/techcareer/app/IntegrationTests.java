package com.techcareer.app;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class IntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testApplicationEndToEnd() throws Exception {
        // Test that the application context loads
        mockMvc.perform(MockMvcRequestBuilders.get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("UP")));
    }

    @Test
    public void testAuthenticationFlow() throws Exception {
        // Test registration
        String registrationJson = "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\"}";
        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registrationJson))
                .andExpect(status().isOk());

        // Test login
        String loginJson = "{\"username\":\"testuser\",\"password\":\"password123\"}";
        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("token")));
    }

    @Test
    public void testCareerRecommendationFlow() throws Exception {
        // Test submitting assessment and getting recommendations
        String assessmentJson = "{\"interestScores\":{\"web_development\":8,\"data_science\":5},\"skillScores\":{\"javascript\":7,\"html_css\":8},\"preferredWorkStyle\":\"remote\"}";
        mockMvc.perform(MockMvcRequestBuilders.post("/api/career/recommendations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(assessmentJson))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("matchScore")));
    }

    @Test
    public void testLearningPlanGeneration() throws Exception {
        // Test generating a learning plan
        String planRequestJson = "{\"userId\":1,\"jobRoleId\":1,\"learningStyle\":\"balanced\",\"hoursPerWeek\":10}";
        mockMvc.perform(MockMvcRequestBuilders.post("/api/learning/plan")
                .contentType(MediaType.APPLICATION_JSON)
                .content(planRequestJson))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("milestones")));
    }

    @Test
    public void testCommunityFeatures() throws Exception {
        // Test getting forum categories
        mockMvc.perform(MockMvcRequestBuilders.get("/api/community/categories"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("name")));

        // Test getting upcoming Q&A sessions
        mockMvc.perform(MockMvcRequestBuilders.get("/api/community/qa-sessions"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("title")));
    }
}
