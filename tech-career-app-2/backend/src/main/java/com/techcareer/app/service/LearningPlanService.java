package com.techcareer.app.service;

import com.techcareer.app.model.*;
import com.techcareer.app.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class LearningPlanService {

    @Autowired
    private LearningPlanRepository learningPlanRepository;
    
    @Autowired
    private LearningPlanMilestoneRepository milestoneRepository;
    
    @Autowired
    private LearningResourceRepository resourceRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserSkillRepository userSkillRepository;
    
    @Autowired
    private JobRoleRepository jobRoleRepository;
    
    @Autowired
    private UserAssessmentRepository assessmentRepository;
    
    /**
     * Generate a personalized 1-year learning plan for a user based on their selected job role
     * and assessment results
     * 
     * @param userId The ID of the user
     * @param jobRoleId The ID of the selected job role
     * @return The generated learning plan
     */
    public LearningPlan generateLearningPlan(Long userId, Long jobRoleId) {
        // Get user data
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        // Get job role data
        JobRole jobRole = jobRoleRepository.findById(jobRoleId)
                .orElseThrow(() -> new IllegalArgumentException("Job role not found"));
        
        // Get user skills
        List<UserSkill> userSkills = userSkillRepository.findByUserId(userId);
        
        // Get user assessments
        List<UserAssessment> assessments = assessmentRepository.findByUserId(userId);
        
        // Create new learning plan
        LearningPlan learningPlan = new LearningPlan();
        learningPlan.setUser(user);
        learningPlan.setJobRole(jobRole);
        learningPlan.setCreationDate(new Date());
        learningPlan.setStartDate(new Date());
        
        // Calculate end date (1 year from start)
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(learningPlan.getStartDate());
        calendar.add(Calendar.YEAR, 1);
        learningPlan.setEndDate(calendar.getTime());
        
        learningPlan.setTitle("1-Year Career Path: " + jobRole.getTitle());
        learningPlan.setDescription(generatePlanDescription(user, jobRole, assessments));
        
        // Save the learning plan to get an ID
        learningPlan = learningPlanRepository.save(learningPlan);
        
        // Generate milestones
        List<LearningPlanMilestone> milestones = generateMilestones(learningPlan, jobRole, userSkills, assessments);
        learningPlan.setMilestones(milestones);
        
        // Update learning plan with milestones
        return learningPlanRepository.save(learningPlan);
    }
    
    /**
     * Generate a description for the learning plan
     */
    private String generatePlanDescription(User user, JobRole jobRole, List<UserAssessment> assessments) {
        StringBuilder description = new StringBuilder();
        
        description.append("This personalized 1-year learning plan is designed to help you become a ")
                  .append(jobRole.getTitle())
                  .append(". ");
        
        description.append("The plan is tailored to your current skills, learning style, and available resources. ");
        
        description.append("It includes a structured progression of learning activities, projects, and resources ");
        description.append("organized into weekly and monthly milestones. ");
        
        description.append("By following this plan, you'll develop the technical skills, portfolio projects, ");
        description.append("and professional network needed to successfully transition into this role. ");
        
        // Add learning style customization if available
        Optional<UserAssessment> interestAssessment = assessments.stream()
                .filter(a -> a.getAssessmentType().equals("INTEREST"))
                .findFirst();
        
        if (interestAssessment.isPresent()) {
            Map<String, Object> responses = interestAssessment.get().getResponses();
            String learningStyle = (String) responses.getOrDefault("learningStyle", "");
            
            if (!learningStyle.isEmpty()) {
                description.append("This plan emphasizes ");
                
                switch (learningStyle) {
                    case "visual":
                        description.append("visual learning resources like video tutorials, diagrams, and demonstrations ");
                        description.append("to match your visual learning preference. ");
                        break;
                    case "auditory":
                        description.append("auditory learning resources like podcasts, lectures, and discussions ");
                        description.append("to match your auditory learning preference. ");
                        break;
                    case "reading":
                        description.append("reading and writing resources like books, articles, and documentation ");
                        description.append("to match your reading/writing learning preference. ");
                        break;
                    case "kinesthetic":
                        description.append("hands-on practice and project-based learning ");
                        description.append("to match your kinesthetic learning preference. ");
                        break;
                    default:
                        description.append("a mix of different learning approaches ");
                        description.append("to provide a well-rounded learning experience. ");
                }
            }
        }
        
        description.append("Remember that this is a flexible guide that you can adjust based on your progress and changing needs.");
        
        return description.toString();
    }
    
    /**
     * Generate milestones for the learning plan
     */
    private List<LearningPlanMilestone> generateMilestones(LearningPlan learningPlan, JobRole jobRole, 
                                                         List<UserSkill> userSkills, List<UserAssessment> assessments) {
        List<LearningPlanMilestone> milestones = new ArrayList<>();
        
        // Get required skills for the job role
        List<Skill> requiredSkills = jobRole.getRequiredSkills();
        
        // Map user skills by skill ID for easy lookup
        Map<Long, UserSkill> userSkillMap = userSkills.stream()
                .collect(Collectors.toMap(
                    userSkill -> userSkill.getSkill().getId(),
                    userSkill -> userSkill,
                    (existing, replacement) -> existing
                ));
        
        // Categorize skills into beginner, intermediate, and advanced based on user's current level
        List<Skill> beginnerSkills = new ArrayList<>();
        List<Skill> intermediateSkills = new ArrayList<>();
        List<Skill> advancedSkills = new ArrayList<>();
        
        for (Skill skill : requiredSkills) {
            UserSkill userSkill = userSkillMap.get(skill.getId());
            
            if (userSkill == null || userSkill.getProficiencyLevel() < 2) {
                beginnerSkills.add(skill);
            } else if (userSkill.getProficiencyLevel() < 4) {
                intermediateSkills.add(skill);
            } else {
                advancedSkills.add(skill);
            }
        }
        
        // Get time availability from assessment
        int weeklyHours = getWeeklyHoursAvailability(assessments);
        
        // Generate foundation phase (Months 1-3)
        milestones.addAll(generateFoundationPhase(learningPlan, beginnerSkills, weeklyHours));
        
        // Generate building phase (Months 4-6)
        milestones.addAll(generateBuildingPhase(learningPlan, intermediateSkills, weeklyHours));
        
        // Generate specialization phase (Months 7-9)
        milestones.addAll(generateSpecializationPhase(learningPlan, advancedSkills, jobRole, weeklyHours));
        
        // Generate career preparation phase (Months 10-12)
        milestones.addAll(generateCareerPrepPhase(learningPlan, jobRole, weeklyHours));
        
        return milestones;
    }
    
    /**
     * Get weekly hours availability from user assessment
     */
    private int getWeeklyHoursAvailability(List<UserAssessment> assessments) {
        Optional<UserAssessment> accessAssessment = assessments.stream()
                .filter(a -> a.getAssessmentType().equals("TECH_ACCESS"))
                .findFirst();
        
        if (accessAssessment.isPresent()) {
            Map<String, Object> responses = accessAssessment.get().getResponses();
            String timeAvailability = (String) responses.getOrDefault("timeAvailability", "10-20");
            
            switch (timeAvailability) {
                case "less-than-5":
                    return 5;
                case "5-10":
                    return 10;
                case "10-20":
                    return 15;
                case "20-30":
                    return 25;
                case "30+":
                    return 35;
                default:
                    return 15; // Default to 15 hours per week
            }
        }
        
        return 15; // Default to 15 hours per week
    }
    
    /**
     * Generate foundation phase milestones (Months 1-3)
     */
    private List<LearningPlanMilestone> generateFoundationPhase(LearningPlan learningPlan, List<Skill> beginnerSkills, int weeklyHours) {
        List<LearningPlanMilestone> milestones = new ArrayList<>();
        Date startDate = learningPlan.getStartDate();
        
        // Month 1: Orientation and Fundamentals
        LearningPlanMilestone month1 = new LearningPlanMilestone();
        month1.setLearningPlan(learningPlan);
        month1.setTitle("Month 1: Orientation and Fundamentals");
        month1.setDescription("Get oriented with the field and start building fundamental skills.");
        month1.setStartDate(startDate);
        
        // Calculate end date (1 month from start)
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(startDate);
        calendar.add(Calendar.MONTH, 1);
        Date month1EndDate = calendar.getTime();
        month1.setEndDate(month1EndDate);
        
        month1.setType("MONTHLY");
        month1.setStatus("NOT_STARTED");
        
        // Create content based on beginner skills
        StringBuilder content = new StringBuilder();
        content.append("## Week 1-2: Introduction and Setup\n\n");
        content.append("- Research and understand the " + learningPlan.getJobRole().getTitle() + " role\n");
        content.append("- Set up your development environment\n");
        
        if (!beginnerSkills.isEmpty()) {
            content.append("- Begin learning the basics of " + beginnerSkills.get(0).getName() + "\n");
            if (beginnerSkills.size() > 1) {
                content.append("- Explore introductory resources for " + beginnerSkills.get(1).getName() + "\n");
            }
        }
        
        content.append("- Join online communities related to your field\n\n");
        
        content.append("## Week 3-4: Building Core Knowledge\n\n");
        
        if (beginnerSkills.size() > 2) {
            content.append("- Continue learning " + beginnerSkills.get(0).getName() + " and " + beginnerSkills.get(1).getName() + "\n");
            content.append("- Start exploring " + beginnerSkills.get(2).getName() + "\n");
        } else if (!beginnerSkills.isEmpty()) {
            content.append("- Deepen your understanding of " + String.join(" and ", 
                    beginnerSkills.stream().map(Skill::getName).collect(Collectors.toList())) + "\n");
        }
        
        content.append("- Complete your first small project combining these skills\n");
        content.append("- Begin building a study routine that fits your schedule\n");
        
        // Add resources based on weekly hours
        content.append("\n## Recommended Learning Resources:\n\n");
        
        // Add more resources for those with more time
        if (weeklyHours >= 20) {
            content.append("- Complete 2-3 courses on fundamental skills\n");
            content.append("- Read 1 book on industry best practices\n");
            content.append("- Spend 5-7 hours per week on hands-on practice\n");
        } else {
            content.append("- Complete 1-2 courses on fundamental skills\n");
            content.append("- Spend 3-5 hours per week on hands-on practice\n");
        }
        
        content.append("- Join at least 2 online communities or forums in your field\n");
        
        month1.setContent(content.toString());
        month1 = milestoneRepository.save(month1);
        milestones.add(month1);
        
        // Month 2: Skill Building
        LearningPlanMilestone month2 = new LearningPlanMilestone();
        month2.setLearningPlan(learningPlan);
        month2.setTitle("Month 2: Skill Building");
        month2.setDescription("Focus on building core technical skills required for your role.");
        month2.setStartDate(month1EndDate);
        
        // Calculate end date (1 month from Month 1 end)
        calendar.setTime(month1EndDate);
        calendar.add(Calendar.MONTH, 1);
        Date month2EndDate = calendar.getTime();
        month2.setEndDate(month2EndDate);
        
        month2.setType("MONTHLY");
        month2.setStatus("NOT_STARTED");
        
        // Create content based on beginner skills
        content = new StringBuilder();
        content.append("## Week 5-6: Deepening Technical Skills\n\n");
        
        if (beginnerSkills.size() > 3) {
            content.append("- Continue practicing " + beginnerSkills.get(0).getName() + " and " + beginnerSkills.get(1).getName() + "\n");
            content.append("- Expand knowledge of " + beginnerSkills.get(2).getName() + " and " + beginnerSkills.get(3).getName() + "\n");
        } else if (!beginnerSkills.isEmpty()) {
            content.append("- Deepen your understanding of all fundamental skills\n");
            content.append("- Start working on more complex exercises\n");
        }
        
        content.append("- Begin a medium-sized project that combines multiple skills\n");
        content.append("- Start documenting your learning journey\n\n");
        
        content.append("## Week 7-8: Practical Application\n\n");
        content.append("- Complete your medium-sized project\n");
        content.append("- Get feedback on your project from peers or mentors\n");
        content.append("- Begin exploring how these skills are applied in real-world scenarios\n");
        content.append("- Start following industry blogs and news sources\n");
        
        // Add resources based on weekly hours
        content.append("\n## Recommended Learning Resources:\n\n");
        
        if (weeklyHours >= 20) {
            content.append("- Complete 2-3 intermediate courses or tutorials\n");
            content.append("- Spend 8-10 hours on project work\n");
            content.append("- Begin contributing to open discussions in communities\n");
        } else {
            content.append("- Complete 1-2 intermediate courses or tutorials\n");
            content.append("- Spend 5-7 hours on project work\n");
        }
        
        content.append("- Find and follow 5 industry experts on social media\n");
        
        month2.setContent(content.toString());
        month2 = milestoneRepository.save(month2);
        milestones.add(m<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>