package com.techcareer.app.service;

import com.techcareer.app.model.*;
import com.techcareer.app.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CareerRecommendationService {

    @Autowired
    private UserAssessmentRepository userAssessmentRepository;
    
    @Autowired
    private CareerPathRepository careerPathRepository;
    
    @Autowired
    private JobRoleRepository jobRoleRepository;
    
    @Autowired
    private SkillRepository skillRepository;
    
    @Autowired
    private UserSkillRepository userSkillRepository;
    
    /**
     * Generate career recommendations based on user assessment data
     * 
     * @param userId The ID of the user to generate recommendations for
     * @return List of career recommendations with matching scores
     */
    public List<CareerRecommendation> generateRecommendations(Long userId) {
        // Retrieve user assessment data
        List<UserAssessment> assessments = userAssessmentRepository.findByUserId(userId);
        
        if (assessments.isEmpty()) {
            throw new IllegalStateException("User has not completed any assessments");
        }
        
        // Get user skills
        List<UserSkill> userSkills = userSkillRepository.findByUserId(userId);
        
        // Get all available career paths
        List<CareerPath> allCareerPaths = careerPathRepository.findAll();
        
        // Calculate match scores for each career path
        List<CareerRecommendation> recommendations = new ArrayList<>();
        
        for (CareerPath careerPath : allCareerPaths) {
            double matchScore = calculateMatchScore(assessments, userSkills, careerPath);
            
            // Get job roles for this career path
            List<JobRole> jobRoles = jobRoleRepository.findByCareerPathId(careerPath.getId());
            
            // Find best matching job roles
            List<JobRole> matchingRoles = findMatchingJobRoles(assessments, userSkills, jobRoles);
            
            // Create recommendation
            CareerRecommendation recommendation = new CareerRecommendation();
            recommendation.setUserId(userId);
            recommendation.setCareerPath(careerPath);
            recommendation.setMatchScore(matchScore);
            recommendation.setRecommendedJobRoles(matchingRoles);
            recommendation.setRecommendationDate(new Date());
            recommendation.setExplanation(generateExplanation(assessments, userSkills, careerPath, matchingRoles));
            
            recommendations.add(recommendation);
        }
        
        // Sort recommendations by match score (descending)
        recommendations.sort(Comparator.comparing(CareerRecommendation::getMatchScore).reversed());
        
        return recommendations;
    }
    
    /**
     * Calculate match score between user assessment data and a career path
     * 
     * @param assessments User assessment data
     * @param userSkills User skills
     * @param careerPath Career path to match against
     * @return Match score (0-100)
     */
    private double calculateMatchScore(List<UserAssessment> assessments, List<UserSkill> userSkills, CareerPath careerPath) {
        double interestScore = calculateInterestScore(assessments, careerPath);
        double skillScore = calculateSkillScore(userSkills, careerPath);
        double workStyleScore = calculateWorkStyleScore(assessments, careerPath);
        double accessScore = calculateAccessScore(assessments, careerPath);
        
        // Weighted average of scores
        // Interest and skills are weighted more heavily
        return (interestScore * 0.35) + (skillScore * 0.35) + (workStyleScore * 0.2) + (accessScore * 0.1);
    }
    
    /**
     * Calculate interest match score
     */
    private double calculateInterestScore(List<UserAssessment> assessments, CareerPath careerPath) {
        // Find interest assessment
        Optional<UserAssessment> interestAssessment = assessments.stream()
                .filter(a -> a.getAssessmentType().equals("INTEREST"))
                .findFirst();
        
        if (interestAssessment.isEmpty()) {
            return 50.0; // Default score if no assessment
        }
        
        Map<String, Object> responses = interestAssessment.get().getResponses();
        
        // Extract tech interests
        List<String> techInterests = (List<String>) responses.getOrDefault("techInterests", new ArrayList<>());
        
        // Match interests with career path keywords
        Set<String> careerKeywords = new HashSet<>(Arrays.asList(careerPath.getKeywords().split(",")));
        
        int matchCount = 0;
        for (String interest : techInterests) {
            for (String keyword : careerKeywords) {
                if (keyword.trim().toLowerCase().contains(interest.toLowerCase()) || 
                    interest.toLowerCase().contains(keyword.trim().toLowerCase())) {
                    matchCount++;
                    break;
                }
            }
        }
        
        // Calculate percentage match
        double interestMatchPercentage = careerKeywords.isEmpty() ? 0 : 
            (double) matchCount / careerKeywords.size() * 100;
        
        // Consider problem-solving approach
        String problemSolving = (String) responses.getOrDefault("problemSolving", "");
        if (careerPath.getRequiredProblemSolvingApproach().contains(problemSolving)) {
            interestMatchPercentage += 10;
        }
        
        return Math.min(interestMatchPercentage, 100);
    }
    
    /**
     * Calculate skill match score
     */
    private double calculateSkillScore(List<UserSkill> userSkills, CareerPath careerPath) {
        // Get required skills for career path
        List<Skill> requiredSkills = careerPath.getRequiredSkills();
        
        if (requiredSkills.isEmpty()) {
            return 50.0; // Default score if no required skills
        }
        
        // Create map of user skills for easy lookup
        Map<Long, UserSkill> userSkillMap = userSkills.stream()
                .collect(Collectors.toMap(
                    userSkill -> userSkill.getSkill().getId(),
                    userSkill -> userSkill
                ));
        
        double totalScore = 0;
        int skillCount = 0;
        
        for (Skill requiredSkill : requiredSkills) {
            UserSkill userSkill = userSkillMap.get(requiredSkill.getId());
            
            if (userSkill != null) {
                // Calculate match based on proficiency level
                double proficiencyMatch = (double) userSkill.getProficiencyLevel() / 5.0 * 100;
                
                // Bonus for skills marked as strengths
                if (userSkill.isStrength()) {
                    proficiencyMatch += 10;
                }
                
                // Bonus for skills marked as interests
                if (userSkill.isInterest()) {
                    proficiencyMatch += 10;
                }
                
                totalScore += Math.min(proficiencyMatch, 100);
                skillCount++;
            } else {
                // Missing required skill
                totalScore += 0;
                skillCount++;
            }
        }
        
        return skillCount > 0 ? totalScore / skillCount : 50.0;
    }
    
    /**
     * Calculate work style match score
     */
    private double calculateWorkStyleScore(List<UserAssessment> assessments, CareerPath careerPath) {
        // Find work style assessment
        Optional<UserAssessment> workStyleAssessment = assessments.stream()
                .filter(a -> a.getAssessmentType().equals("WORK_STYLE"))
                .findFirst();
        
        if (workStyleAssessment.isEmpty()) {
            return 50.0; // Default score if no assessment
        }
        
        Map<String, Object> responses = workStyleAssessment.get().getResponses();
        
        // Extract work environment preference
        String workEnvironment = (String) responses.getOrDefault("workEnvironment", "");
        String teamSize = (String) responses.getOrDefault("teamSize", "");
        String workSchedule = (String) responses.getOrDefault("workSchedule", "");
        List<String> workCulture = (List<String>) responses.getOrDefault("workCulture", new ArrayList<>());
        
        // Match with career path work environment
        double environmentMatch = 0;
        if (careerPath.getTypicalWorkEnvironment().contains(workEnvironment)) {
            environmentMatch = 100;
        } else if (workEnvironment.equals("flexible")) {
            environmentMatch = 80; // Flexible preference gets good match
        } else {
            environmentMatch = 40; // Some match for different preferences
        }
        
        // Match with team size
        double teamMatch = 0;
        if (careerPath.getTypicalTeamSize().contains(teamSize)) {
            teamMatch = 100;
        } else if (teamSize.equals("flexible")) {
            teamMatch = 80;
        } else {
            teamMatch = 40;
        }
        
        // Match with work culture
        double cultureMatch = 0;
        List<String> careerCulture = Arrays.asList(careerPath.getWorkCulture().split(","));
        
        int cultureMatchCount = 0;
        for (String culture : workCulture) {
            if (careerCulture.stream().anyMatch(c -> c.trim().equalsIgnoreCase(culture))) {
                cultureMatchCount++;
            }
        }
        
        cultureMatch = workCulture.isEmpty() ? 50 : 
            (double) cultureMatchCount / workCulture.size() * 100;
        
        // Weighted average of work style factors
        return (environmentMatch * 0.4) + (teamMatch * 0.3) + (cultureMatch * 0.3);
    }
    
    /**
     * Calculate technological access match score
     */
    private double calculateAccessScore(List<UserAssessment> assessments, CareerPath careerPath) {
        // Find tech access assessment
        Optional<UserAssessment> accessAssessment = assessments.stream()
                .filter(a -> a.getAssessmentType().equals("TECH_ACCESS"))
                .findFirst();
        
        if (accessAssessment.isEmpty()) {
            return 50.0; // Default score if no assessment
        }
        
        Map<String, Object> responses = accessAssessment.get().getResponses();
        
        // Extract access information
        String computerAccess = (String) responses.getOrDefault("computerAccess", "");
        String internetAccess = (String) responses.getOrDefault("internetAccess", "");
        Integer internetSpeed = (Integer) responses.getOrDefault("internetSpeed", 5);
        String timeAvailability = (String) responses.getOrDefault("timeAvailability", "");
        
        // Calculate computer access score
        double computerScore = 0;
        if (computerAccess.equals("dedicated")) {
            computerScore = 100;
        } else if (computerAccess.equals("shared")) {
            computerScore = 80;
        } else if (computerAccess.equals("limited")) {
            computerScore = 50;
        } else {
            computerScore = 20;
        }
        
        // Calculate internet access score
        double internetScore = 0;
        if (internetAccess.equals("high-speed") || internetAccess.equals("moderate")) {
            internetScore = 100;
        } else if (internetAccess.equals("mobile")) {
            internetScore = 70;
        } else if (internetAccess.equals("public")) {
            internetScore = 50;
        } else {
            internetScore = 30;
        }
        
        // Adjust internet score based on speed
        internetScore = internetScore * (internetSpeed / 10.0);
        
        // Calculate time availability score
        double timeScore = 0;
        if (timeAvailability.equals("30+")) {
            timeScore = 100;
        } else if (timeAvailability.equals("20-30")) {
            timeScore = 90;
        } else if (timeAvailability.equals("10-20")) {
            timeScore = 70;
        } else if (timeAvailability.equals("5-10")) {
            timeScore = 50;
        } else {
            timeScore = 30;
        }
        
        // Get minimum requirements for career path
        String requiredComputer = careerPath.getMinimumComputerRequirements();
        String requiredInternet = careerPath.getMinimumInternetRequirements();
        String recommendedTime = careerPath.getRecommendedTimeCommitment();
        
        // Adjust scores based on career path requirements
        double finalComputerScore = computerScore;
        double finalInternetScore = internetScore;
        double finalTimeScore = timeScore;
        
        if (requiredComputer.equals("high") && !computerAccess.equals("dedicated")) {
            finalComputerScore *= 0.7;
        }
        
        if (requiredInternet.equals("high-speed") && !internetAccess.equals("high-speed")) {
            finalInternetScore *= 0.7;
        }
        
        if (recommendedTime.equals("full-time") && !timeAvailability.equals("30+")) {
            finalTimeScore *= 0.7;
        }
        
        // Weighted average of access factors
        return (finalComputerScore * 0.3) + (finalInternetScore * 0.3) + (finalTimeScore * 0.4);
    }
    
    /**
     * Find matching job roles based on user assessment data
     */
    private List<JobRole> findMatchingJobRoles(List<UserAssessment> assessments, List<UserSkill> userSkills, List<JobRole> jobRoles) {
        // Find job role interest assessment
        Optional<UserAssessment> roleAssessment = assessments.stream()
                .filter(a -> a.getAssessmentType().equals("JOB_ROLE"))
                .findFirst();
        
        // Map to store job role scores
        Map<JobRole, Double> roleScores = new HashMap<>();
        
        for (JobRole role : jobRoles) {
            double score = 0;
            
            // Check if user explicitly selected this role
            if (roleAssessment.isPresent()) {
                Map<String, Object> responses = roleAssessment.get().getResponses();
                List<String> selectedRoles = (List<String>) responses.getOrDefault("selectedRoles", new ArrayList<>());
                
                if (selectedRoles.contains(role.getTitle())) {
                    // Get user's interest level for this role (1-5)
                    Map<String, String> rolePreferences = (Map<String, String>) responses.getOrDefault("rolePreferences", new HashMap<>());
                    String interestLevel = rolePreferences.getOrDefault(role.getTitle(), "3");
                    
                    // Convert interest level to score (1=60, 2=70, 3=80, 4=90, 5=100)
                    score += 50 + (Integer.parseInt(interestLevel) * 10);
                }
            }
            
            // Check skill match
            double skillMatchScore = calculateRoleSkillMatch(userSkills, role);
            
            // Final score is average of explicit interest and skill match
            if (score > 0) {
                score = (score + skillMatchScore) / 2;
            } else {
                score = skillMatchScore;
            }
            
            roleScores.put(role, score);
        }
        
        // Sort roles by score and take top 3
        return roleScores.entrySet().stream()
                .sorted(Map.Entry.<JobRole, Double>comparingByValue().reversed())
                .limit(3)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }
    
    /**
     * Calculate skill match for a specific job role
     */
    private double calculateRoleSkillMatch(List<UserSkill> userSkills, JobRole role) {
        // Get required skills for job role
        List<Skill> requiredSkills = role<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>