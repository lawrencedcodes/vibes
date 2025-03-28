package com.techpathways.api.services;

import com.techpathways.api.models.Assessment;
import com.techpathways.api.models.AssessmentAnswer;
import com.techpathways.api.models.CareerPath;
import com.techpathways.api.models.CareerRecommendation;
import com.techpathways.api.models.User;
import com.techpathways.api.repositories.CareerPathRepository;
import com.techpathways.api.repositories.CareerRecommendationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CareerRecommendationService {

    @Autowired
    private CareerPathRepository careerPathRepository;

    @Autowired
    private CareerRecommendationRepository careerRecommendationRepository;

    /**
     * Generates career recommendations based on user assessment answers
     * 
     * @param user The user to generate recommendations for
     * @param assessment The completed assessment
     * @param answers The user's answers to the assessment questions
     * @return List of career recommendations sorted by match percentage
     */
    public List<CareerRecommendation> generateRecommendations(User user, Assessment assessment, List<AssessmentAnswer> answers) {
        // Get all available career paths
        List<CareerPath> allCareerPaths = careerPathRepository.findAll();
        
        // Calculate match scores for each career path
        List<CareerRecommendation> recommendations = new ArrayList<>();
        
        for (CareerPath careerPath : allCareerPaths) {
            double matchPercentage = calculateMatchPercentage(careerPath, answers);
            
            // Create a new recommendation if the match percentage is above a threshold (e.g., 50%)
            if (matchPercentage >= 50.0) {
                CareerRecommendation recommendation = new CareerRecommendation();
                recommendation.setUser(user);
                recommendation.setCareerPath(careerPath);
                recommendation.setMatchPercentage(matchPercentage);
                recommendation.setAssessment(assessment);
                recommendation.setCreatedAt(new Date());
                
                recommendations.add(recommendation);
            }
        }
        
        // Sort recommendations by match percentage (descending)
        recommendations.sort(Comparator.comparing(CareerRecommendation::getMatchPercentage).reversed());
        
        // Save recommendations to database
        careerRecommendationRepository.saveAll(recommendations);
        
        return recommendations;
    }
    
    /**
     * Calculates the match percentage between a career path and user's assessment answers
     * 
     * @param careerPath The career path to match against
     * @param answers The user's assessment answers
     * @return Match percentage (0-100)
     */
    private double calculateMatchPercentage(CareerPath careerPath, List<AssessmentAnswer> answers) {
        // This is where the core algorithm logic lives
        
        // Define weights for different assessment categories
        Map<String, Double> categoryWeights = new HashMap<>();
        categoryWeights.put("interest", 0.35);       // Interest & passion exploration
        categoryWeights.put("skill", 0.25);          // Skill & strength assessment
        categoryWeights.put("work_style", 0.20);     // Work style & preferences
        categoryWeights.put("tech_access", 0.10);    // Technological access
        categoryWeights.put("background", 0.10);     // Educational & professional background
        
        // Initialize category scores
        Map<String, Double> categoryScores = new HashMap<>();
        for (String category : categoryWeights.keySet()) {
            categoryScores.put(category, 0.0);
        }
        
        // Count answers per category for normalization
        Map<String, Integer> categoryAnswerCounts = new HashMap<>();
        for (String category : categoryWeights.keySet()) {
            categoryAnswerCounts.put(category, 0);
        }
        
        // Process each answer
        for (AssessmentAnswer answer : answers) {
            String questionId = answer.getQuestion().getQuestionId();
            String category = getQuestionCategory(questionId);
            
            if (category != null && categoryScores.containsKey(category)) {
                // Increment the answer count for this category
                categoryAnswerCounts.put(category, categoryAnswerCounts.get(category) + 1);
                
                // Calculate the score contribution for this answer
                double answerScore = calculateAnswerScore(careerPath, answer);
                
                // Add to the category score
                categoryScores.put(category, categoryScores.get(category) + answerScore);
            }
        }
        
        // Normalize category scores (divide by number of answers in that category)
        for (String category : categoryScores.keySet()) {
            int answerCount = categoryAnswerCounts.get(category);
            if (answerCount > 0) {
                categoryScores.put(category, categoryScores.get(category) / answerCount);
            }
        }
        
        // Calculate weighted average of category scores
        double totalScore = 0.0;
        for (String category : categoryScores.keySet()) {
            totalScore += categoryScores.get(category) * categoryWeights.get(category);
        }
        
        // Convert to percentage
        return Math.round(totalScore * 100);
    }
    
    /**
     * Determines the category of a question based on its ID
     * 
     * @param questionId The question ID
     * @return The category name
     */
    private String getQuestionCategory(String questionId) {
        if (questionId.startsWith("interest_")) {
            return "interest";
        } else if (questionId.startsWith("skill_")) {
            return "skill";
        } else if (questionId.startsWith("work_")) {
            return "work_style";
        } else if (questionId.startsWith("tech_")) {
            return "tech_access";
        } else if (questionId.startsWith("background_")) {
            return "background";
        }
        return null;
    }
    
    /**
     * Calculates a score for an individual answer based on how well it matches a career path
     * 
     * @param careerPath The career path to match against
     * @param answer The user's answer
     * @return Score between 0 and 1
     */
    private double calculateAnswerScore(CareerPath careerPath, AssessmentAnswer answer) {
        String questionId = answer.getQuestion().getQuestionId();
        String answerValue = answer.getAnswerValue();
        
        // Career path attributes that we'll match against
        Map<String, Object> careerAttributes = getCareerAttributes(careerPath);
        
        // Different scoring logic based on question type
        switch (questionId) {
            // Interest questions
            case "interest_1": // Activity preference
                return scoreInterestActivity(careerAttributes, answerValue);
            case "interest_2": // Project type preference
                return scoreInterestProject(careerAttributes, answerValue);
            case "interest_3": // Technology curiosity (multiple selection)
                return scoreInterestTechnology(careerAttributes, answerValue);
                
            // Skill questions
            case "skill_1": // Problem-solving ability
                return scoreProblemSolving(careerAttributes, answerValue);
            case "skill_2": // Learning comfort
                return scoreLearningComfort(careerAttributes, answerValue);
            case "skill_3": // Strength areas (multiple selection)
                return scoreStrengths(careerAttributes, answerValue);
                
            // Work style questions
            case "work_1": // Work environment
                return scoreWorkEnvironment(careerAttributes, answerValue);
            case "work_2": // Problem-solving approach
                return scoreProblemSolvingApproach(careerAttributes, answerValue);
            case "work_3": // Job priorities (multiple selection)
                return scoreJobPriorities(careerAttributes, answerValue);
                
            // Tech access questions
            case "tech_1": // Computer access
                return scoreComputerAccess(careerAttributes, answerValue);
            case "tech_2": // Internet connection
                return scoreInternetConnection(careerAttributes, answerValue);
            case "tech_3": // Learning time availability
                return scoreLearningTime(careerAttributes, answerValue);
                
            // Default case
            default:
                return 0.5; // Neutral score for unknown questions
        }
    }
    
    /**
     * Extracts relevant attributes from a career path for matching
     * 
     * @param careerPath The career path
     * @return Map of career attributes
     */
    private Map<String, Object> getCareerAttributes(CareerPath careerPath) {
        Map<String, Object> attributes = new HashMap<>();
        
        // Basic attributes
        attributes.put("id", careerPath.getId());
        attributes.put("title", careerPath.getTitle());
        attributes.put("description", careerPath.getDescription());
        
        // Required skills (parsed from skills field)
        List<String> skills = Arrays.asList(careerPath.getRequiredSkills().split(","));
        attributes.put("skills", skills);
        
        // Career-specific attributes (these would be stored in the database in a real implementation)
        // For demonstration purposes, we'll hardcode some attributes for common tech careers
        
        switch (careerPath.getTitle().toLowerCase()) {
            case "frontend developer":
                attributes.put("visual_orientation", 0.8);
                attributes.put("logical_orientation", 0.6);
                attributes.put("creativity", 0.7);
                attributes.put("detail_orientation", 0.8);
                attributes.put("collaboration", 0.7);
                attributes.put("independent_work", 0.6);
                attributes.put("learning_curve", 0.6);
                attributes.put("remote_friendly", 0.9);
                attributes.put("tech_requirements", "moderate");
                attributes.put("project_types", Arrays.asList("websites", "mobile applications", "user interfaces"));
                attributes.put("technologies", Arrays.asList("html", "css", "javascript", "react", "angular", "vue"));
                break;
                
            case "backend developer":
                attributes.put("visual_orientation", 0.3);
                attributes.put("logical_orientation", 0.9);
                attributes.put("creativity", 0.5);
                attributes.put("detail_orientation", 0.8);
                attributes.put("collaboration", 0.6);
                attributes.put("independent_work", 0.8);
                attributes.put("learning_curve", 0.7);
                attributes.put("remote_friendly", 0.9);
                attributes.put("tech_requirements", "moderate");
                attributes.put("project_types", Arrays.asList("apis", "databases", "server applications"));
                attributes.put("technologies", Arrays.asList("java", "python", "node.js", "sql", "nosql"));
                break;
                
            case "data scientist":
                attributes.put("visual_orientation", 0.6);
                attributes.put("logical_orientation", 0.9);
                attributes.put("creativity", 0.6);
                attributes.put("detail_orientation", 0.8);
                attributes.put("collaboration", 0.6);
                attributes.put("independent_work", 0.8);
                attributes.put("learning_curve", 0.8);
                attributes.put("remote_friendly", 0.8);
                attributes.put("tech_requirements", "high");
                attributes.put("project_types", Arrays.asList("data analysis", "machine learning", "visualization"));
                attributes.put("technologies", Arrays.asList("python", "r", "sql", "machine learning", "statistics"));
                break;
                
            case "ux designer":
                attributes.put("visual_orientation", 0.9);
                attributes.put("logical_orientation", 0.7);
                attributes.put("creativity", 0.9);
                attributes.put("detail_orientation", 0.8);
                attributes.put("collaboration", 0.8);
                attributes.put("independent_work", 0.6);
                attributes.put("learning_curve", 0.6);
                attributes.put("remote_friendly", 0.8);
                attributes.put("tech_requirements", "moderate");
                attributes.put("project_types", Arrays.asList("user interfaces", "user research", "prototyping"));
                attributes.put("technologies", Arrays.asList("figma", "sketch", "adobe xd", "user testing"));
                break;
                
            case "cybersecurity specialist":
                attributes.put("visual_orientation", 0.5);
                attributes.put("logical_orientation", 0.9);
                attributes.put("creativity", 0.6);
                attributes.put("detail_orientation", 0.9);
                attributes.put("collaboration", 0.6);
                attributes.put("independent_work", 0.8);
                attributes.put("learning_curve", 0.8);
                attributes.put("remote_friendly", 0.7);
                attributes.put("tech_requirements", "high");
                attributes.put("project_types", Arrays.asList("security systems", "penetration testing", "risk assessment"));
                attributes.put("technologies", Arrays.asList("networking", "linux", "security tools", "cryptography"));
                break;
                
            default:
                // Default values for other career paths
                attributes.put("visual_orientation", 0.5);
                attributes.put("logical_orientation", 0.5);
                attributes.put("creativity", 0.5);
                attributes.put("detail_orientation", 0.5);
                attributes.put("collaboration", 0.5);
                attributes.put("independent_work", 0.5);
                attributes.put("learning_curve", 0.5);
                attributes.put("remote_friendly", 0.5);
                attributes.put("tech_requirements", "moderate");
                attributes.put("project_types", Collections.emptyList());
                attributes.put("technologies", Collections.emptyList());
        }
        
        return attributes;
    }
    
    // Scoring methods for different question types
    
    private double scoreInterestActivity(Map<String, Object> careerAttributes, String answerValue) {
        // Match activity preferences to career attributes
        switch (answerValue) {
            case "Designing user interfaces and visual elements":
                return (double) careerAttributes.getOrDefault("visual_orientation", 0.5);
            case "Solving complex logical problems":
                return (double) careerAttributes.getOrDefault("logical_orientation", 0.5);
            case "Analyzing data and finding patterns":
                return careerAttributes.getTitle().toLowerCase().contains("data") ? 0.9 : 0.5;
            case "Building and fixing things":
                return careerAttributes.getTitle().toLowerCase().contains("developer") ? 0.8 : 0.5;
            case "Teaching or explaining concepts to others":
                return 0.5; // Neutral for most tech careers
            default:
                return 0.5;
        }
    }
    
    private double scoreInterestProject(Map<String, Object> careerAttributes, String answerValue) {
        // Match project type preferences to career attributes
        @SuppressWarnings("unchecked")
        List<String> projectTypes = (List<String>) careerAttributes.getOrDefault("project_types", Collections.emptyList());
        
        switch (answerValue) {
            case "Websites and mobile applications":
                return projectTypes.stream().anyMatch(p -> p.contains("website") || p.contains("mobile")) ? 0.9 : 0.4;
            case "Data analysis and visualization":
                return projectTypes.stream().anyMatch(p -> p.contains("data") || p.contains("visualization")) ? 0.9 : 0.4;
            case "Cybersecurity and system protection":
                return projectTypes.stream().anyMatch(p -> p.contains("security")) ? 0.9 : 0.4;
            case "Artificial intelligence and machine learning":
                return projectTypes.stream().anyMatch(p -> p.contains("machine learning") || p.contains("ai")) ? 0.9 : 0.4;
            case "Game development":
                return projectTypes.stream().anyMatch(p -> p.contains("game")) ? 0.9 : 0.4;
            default:
                return 0.5;
        }
    }
    
    private double scoreInterestTechnology(Map<String, Object> careerAttributes, String answerValue) {
        // For multiple selection questions, answerValue contains comma-separated values
        List<String> selectedTechnologies = Arrays.asList(answerValue.split(","));
        
        @SuppressWarnings("unchecked")
        List<String> careerTechnologies = (List<String>) careerAttributes.getOrDefault("technologies", Collections.emptyList());
        
        // Count matches between selected technologies and career technologies
        long matchCount = selectedTechnologies.stream()
                .filter(selected -> careerTechnologies.stream()
                        .anyMatch(tech -> tech.toLowerCase().contains(selected.toLowerCase())))
                .count();
        
        // Calculate match ratio (0 to 1)
        return Math.min(1.0, (double) matchCount / Math.max(1, Math.min(selectedTechnologies.size(), 3)));
    }
    
    private double scoreProblemSolving(Map<String, Object> careerAttributes, String answerValue) {
        // Match problem-solving ability to career learning curve
        double learningCurve = (double) careerAttributes.getOrDefault("learning_curve", 0.5);
        
        switch (answerValue) {
            case "Very strong - I enjoy complex problems":
                return learningCurve >= 0.7 ? 0.9 : 0.6;
            case "Strong - I can usually find solutions":
                return learningCurve >= 0.5 && learningCurve <= 0.8 ? 0.9 : 0.6;
            case "Average - I can solve problems with some guidance":
                return learningCurve <= 0.6 ? 0.8 : 0.5;
            case "Developing - I find problem-solving challenging":
                return learningCurve <= 0.5 ? 0.7 : 0.3;
            case "Not sure":
                return 0.5;
            default:
                return 0.5;
        }
    }
    
    private double scoreLearningComfort(Map<String, Object> careerAttributes, String answerValue) {
        // Match learning comfort to career learning curve
        double learningCurve = (double) careerAttributes.getOrDefault("learning_curve", 0.5);
        
        switch (answerValue) {
            case "Very comfortable - I enjoy learning new tech":
                return learningCurve >= 0.7 ? 0.9 : 0.7;
            case "Comfortable - I can adapt to new tech with some effort":
                return learningCurve >= 0.5 && learningCurve <= 0.8 ? 0.9 : 0.6;
            case "Neutral - It depends on the technology":
                return learningCurve <= 0.7 ? 0.8 : 0.5;
            case "Somewhat uncomfortable - I prefer familiar tools":
                return learningCurve <= 0.6 ? 0.7 : 0.3;
            case "Very uncomfortable - I find new tech intimidating":
                return learningCurve <= 0.5 ? 0.6 : 0.2;
            default:
                return 0.5;
        }
    }
    
    private double scoreStrengths(Map<String, Object> careerAttributes, String answerValue) {
        // For multiple selection questions, answerValue contains comma-separated values
        List<String> selectedStrengths = Arrays.asList(answerValue.split(","));
        
        // Map strengths to career attributes
        Map<String, Double> strengthScores = new HashMap<>();
        
        // Calculate score for each strength based on career attributes
        for (String strength : selectedStrengths) {
            switch (strength.trim()) {
                case "Attention to detail":
                    strengthScores.put(strength, (double) careerAttributes.getOrDefault("detail_orientation", 0.5));
                    break;
                case "Creative thinking":
                    strengthScores.put(strength, (double) careerAttributes.getOrDefault("creativity", 0.5));
                    break;
                case "Logical reasoning":
                    strengthScores.put(strength, (double) careerAttributes.getOrDefault("logical_orientation", 0.5));
                    break;
                case "Communication":
                    strengthScores.put(strength, (double) careerAttributes.getOrDefault("collaboration", 0.5));
                    break;
                case "Organization":
                    strengthScores.put(strength, (double) careerAttributes.getOrDefault("detail_orientation", 0.5));
                    break;
                case "Persistence":
                    strengthScores.put(strength, (double) careerAttributes.getOrDefault("learning_curve", 0.5));
                    break;
                case "Teamwork":
                    strengthScores.put(strength, (double) careerAttributes.getOrDefault("collaboration", 0.5));
                    break;
                case "Self-motivation":
                    strengthScores.put(strength, (double) careerAttributes.getOrDefault("independent_work", 0.5));
                    break;
                default:
                    strengthScores.put(strength, 0.5);
            }
        }
        
        // Calculate average score across all selected strengths
        return strengthScores.values().stream()
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.5);
    }
    
    private double scoreWorkEnvironment(Map<String, Object> careerAttributes, String answerValue) {
        // Match work environment preference to remote-friendliness of career
        double remoteFriendly = (double) careerAttributes.getOrDefault("remote_friendly", 0.5);
        
        switch (answerValue) {
            case "Office-based with a team":
                return remoteFriendly <= 0.7 ? 0.8 : 0.5;
            case "Remote work from home":
                return remoteFriendly >= 0.8 ? 0.9 : 0.4;
            case "Hybrid (mix of remote and office)":
                return remoteFriendly >= 0.6 ? 0.8 : 0.5;
            case "Flexible co-working spaces":
                return remoteFriendly >= 0.7 ? 0.8 : 0.6;
            case "No strong preference":
                return 0.7;
            default:
                return 0.5;
        }
    }
    
    private double scoreProblemSolvingApproach(Map<String, Object> careerAttributes, String answerValue) {
        // Match problem-solving approach to collaboration vs. independent work balance
        double collaboration = (double) careerAttributes.getOrDefault("collaboration", 0.5);
        double independentWork = (double) careerAttributes.getOrDefault("independent_work", 0.5);
        
        switch (answerValue) {
            case "Independently, figuring things out on my own":
                return independentWork >= 0.7 ? 0.9 : 0.5;
            case "Collaboratively, discussing with others":
                return collaboration >= 0.7 ? 0.9 : 0.5;
            case "Research-based, looking up solutions":
                return independentWork >= 0.6 ? 0.8 : 0.6;
            case "Structured approach with clear guidelines":
                return (double) careerAttributes.getOrDefault("detail_orientation", 0.5);
            case "Mix of approaches depending on the problem":
                return (collaboration + independentWork) / 2 >= 0.6 ? 0.8 : 0.6;
            default:
                return 0.5;
        }
    }
    
    private double scoreJobPriorities(Map<String, Object> careerAttributes, String answerValue) {
        // For multiple selection questions, answerValue contains comma-separated values
        List<String> selectedPriorities = Arrays.asList(answerValue.split(","));
        
        // Calculate score based on career attributes and common priorities for that career
        // This is simplified and would be more sophisticated in a real implementation
        double score = 0.5; // Default neutral score
        
        String careerTitle = ((String) careerAttributes.getOrDefault("title", "")).toLowerCase();
        
        // Adjust score based on selected priorities and career
        if (selectedPriorities.contains("Work-life balance") && 
                (careerTitle.contains("developer") || careerTitle.contains("designer"))) {
            score += 0.1;
        }
        
        if (selectedPriorities.contains("High salary potential") && 
                (careerTitle.contains("data") || careerTitle.contains("security"))) {
            score += 0.1;
        }
        
        if (selectedPriorities.contains("Creative freedom") && 
                (careerTitle.contains("designer") || careerTitle.contains("frontend"))) {
            score += 0.1;
        }
        
        if (selectedPriorities.contains("Clear advancement path") && 
                (careerTitle.contains("developer") || careerTitle.contains("engineer"))) {
            score += 0.1;
        }
        
        if (selectedPriorities.contains("Making a positive impact") && 
                (careerTitle.contains("data") || careerTitle.contains("ai"))) {
            score += 0.1;
        }
        
        if (selectedPriorities.contains("Continuous learning")) {
            score += 0.1; // Good for all tech careers
        }
        
        if (selectedPriorities.contains("Job security") && 
                (careerTitle.contains("security") || careerTitle.contains("data"))) {
            score += 0.1;
        }
        
        return Math.min(1.0, score);
    }
    
    private double scoreComputerAccess(Map<String, Object> careerAttributes, String answerValue) {
        // Match computer access to tech requirements of career
        String techRequirements = (String) careerAttributes.getOrDefault("tech_requirements", "moderate");
        
        switch (answerValue) {
            case "Modern desktop or laptop (less than 3 years old)":
                return 1.0; // Suitable for all careers
            case "Older desktop or laptop (3+ years old)":
                return techRequirements.equals("high") ? 0.6 : 0.8;
            case "Tablet device only":
                return techRequirements.equals("high") ? 0.3 : techRequirements.equals("moderate") ? 0.5 : 0.7;
            case "Smartphone only":
                return techRequirements.equals("high") ? 0.1 : techRequirements.equals("moderate") ? 0.3 : 0.5;
            case "Limited or shared computer access":
                return techRequirements.equals("high") ? 0.4 : techRequirements.equals("moderate") ? 0.6 : 0.7;
            case "No regular computer access":
                return 0.2; // Challenging for any tech career
            default:
                return 0.5;
        }
    }
    
    private double scoreInternetConnection(Map<String, Object> careerAttributes, String answerValue) {
        // Match internet connection to tech requirements and remote-friendliness
        String techRequirements = (String) careerAttributes.getOrDefault("tech_requirements", "moderate");
        double remoteFriendly = (double) careerAttributes.getOrDefault("remote_friendly", 0.5);
        
        // Calculate base score based on tech requirements
        double baseScore;
        switch (answerValue) {
            case "High-speed reliable connection":
                baseScore = 1.0;
                break;
            case "Moderate speed, generally reliable":
                baseScore = techRequirements.equals("high") ? 0.8 : 0.9;
                break;
            case "Slow but functional":
                baseScore = techRequirements.equals("high") ? 0.6 : techRequirements.equals("moderate") ? 0.7 : 0.8;
                break;
            case "Unreliable or limited data":
                baseScore = techRequirements.equals("high") ? 0.4 : techRequirements.equals("moderate") ? 0.5 : 0.6;
                break;
            case "Public access only (library, cafe, etc.)":
                baseScore = techRequirements.equals("high") ? 0.3 : techRequirements.equals("moderate") ? 0.4 : 0.5;
                break;
            case "No regular internet access":
                baseScore = 0.2; // Challenging for any tech career
                break;
            default:
                baseScore = 0.5;
        }
        
        // Adjust score based on remote-friendliness (more important for remote-friendly careers)
        return baseScore * (1 - (remoteFriendly - 0.5) * 0.2);
    }
    
    private double scoreLearningTime(Map<String, Object> careerAttributes, String answerValue) {
        // Match learning time availability to learning curve of career
        double learningCurve = (double) careerAttributes.getOrDefault("learning_curve", 0.5);
        
        switch (answerValue) {
            case "20+ hours":
                return 1.0; // Ideal for any career
            case "10-20 hours":
                return learningCurve >= 0.8 ? 0.8 : 0.9;
            case "5-10 hours":
                return learningCurve >= 0.8 ? 0.6 : learningCurve >= 0.6 ? 0.8 : 0.9;
            case "1-5 hours":
                return learningCurve >= 0.8 ? 0.4 : learningCurve >= 0.6 ? 0.6 : 0.7;
            case "Less than 1 hour":
                return learningCurve >= 0.7 ? 0.2 : 0.4;
            case "Irregular schedule":
                return 0.6; // Workable for most careers but not ideal
            default:
                return 0.5;
        }
    }
}
