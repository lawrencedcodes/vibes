package com.techpathways.api.services;

import com.techpathways.api.models.*;
import com.techpathways.api.repositories.LearningPlanRepository;
import com.techpathways.api.repositories.MilestoneRepository;
import com.techpathways.api.repositories.ResourceRepository;
import com.techpathways.api.repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LearningPlanService {

    @Autowired
    private LearningPlanRepository learningPlanRepository;

    @Autowired
    private MilestoneRepository milestoneRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    /**
     * Generates a personalized learning plan based on a career recommendation
     * 
     * @param user The user to generate the plan for
     * @param recommendation The career recommendation to base the plan on
     * @return The generated learning plan
     */
    public LearningPlan generateLearningPlan(User user, CareerRecommendation recommendation) {
        CareerPath careerPath = recommendation.getCareerPath();
        
        // Create a new learning plan
        LearningPlan learningPlan = new LearningPlan();
        learningPlan.setUser(user);
        learningPlan.setCareerPath(careerPath);
        learningPlan.setTitle("1-Year " + careerPath.getTitle() + " Learning Path");
        learningPlan.setDescription("A personalized learning plan to help you become a " + 
                                   careerPath.getTitle() + " within one year.");
        learningPlan.setCreatedAt(new Date());
        learningPlan.setStartDate(new Date());
        
        // Calculate end date (1 year from now)
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        calendar.add(Calendar.YEAR, 1);
        learningPlan.setEndDate(calendar.getTime());
        
        // Save the learning plan to get an ID
        learningPlan = learningPlanRepository.save(learningPlan);
        
        // Generate milestones based on career path
        List<Milestone> milestones = generateMilestones(learningPlan, careerPath);
        learningPlan.setMilestones(milestones);
        
        // Update the learning plan with milestones
        return learningPlanRepository.save(learningPlan);
    }
    
    /**
     * Generates milestones for a learning plan based on career path
     * 
     * @param learningPlan The learning plan to generate milestones for
     * @param careerPath The career path to base milestones on
     * @return List of generated milestones
     */
    private List<Milestone> generateMilestones(LearningPlan learningPlan, CareerPath careerPath) {
        List<Milestone> milestones = new ArrayList<>();
        
        // Get career path title for milestone customization
        String careerTitle = careerPath.getTitle().toLowerCase();
        
        // Define milestone templates based on career path
        List<MilestoneTemplate> templates = getMilestoneTemplates(careerTitle);
        
        // Calculate milestone durations and dates
        int totalDays = 365; // 1 year
        int milestoneCount = templates.size();
        int daysPerMilestone = totalDays / milestoneCount;
        
        Date startDate = learningPlan.getStartDate();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(startDate);
        
        // Create milestones from templates
        for (int i = 0; i < templates.size(); i++) {
            MilestoneTemplate template = templates.get(i);
            
            Milestone milestone = new Milestone();
            milestone.setLearningPlan(learningPlan);
            milestone.setTitle(template.title);
            milestone.setDescription(template.description);
            milestone.setOrderIndex(i + 1);
            milestone.setCompleted(false);
            
            // Calculate due date for this milestone
            calendar.add(Calendar.DAY_OF_YEAR, daysPerMilestone);
            milestone.setDueDate(calendar.getTime());
            
            // Save milestone to get an ID
            milestone = milestoneRepository.save(milestone);
            
            // Generate tasks for this milestone
            List<Task> tasks = generateTasks(milestone, template.taskTemplates);
            milestone.setTasks(tasks);
            
            // Update milestone with tasks
            milestone = milestoneRepository.save(milestone);
            
            milestones.add(milestone);
        }
        
        return milestones;
    }
    
    /**
     * Generates tasks for a milestone based on task templates
     * 
     * @param milestone The milestone to generate tasks for
     * @param taskTemplates The task templates to base tasks on
     * @return List of generated tasks
     */
    private List<Task> generateTasks(Milestone milestone, List<TaskTemplate> taskTemplates) {
        List<Task> tasks = new ArrayList<>();
        
        for (int i = 0; i < taskTemplates.size(); i++) {
            TaskTemplate template = taskTemplates.get(i);
            
            Task task = new Task();
            task.setMilestone(milestone);
            task.setTitle(template.title);
            task.setDescription(template.description);
            task.setOrderIndex(i + 1);
            task.setCompleted(false);
            
            // Save task
            task = taskRepository.save(task);
            
            tasks.add(task);
        }
        
        return tasks;
    }
    
    /**
     * Recommends resources for a learning plan based on career path and user profile
     * 
     * @param learningPlan The learning plan to recommend resources for
     * @param userProfile The user's profile with preferences
     * @return List of recommended resources
     */
    public List<ResourceRecommendation> recommendResources(LearningPlan learningPlan, UserProfile userProfile) {
        // Get all available resources
        List<Resource> allResources = resourceRepository.findAll();
        
        // Filter and rank resources based on career path and user preferences
        List<Resource> filteredResources = allResources.stream()
            .filter(resource -> isResourceRelevant(resource, learningPlan.getCareerPath()))
            .sorted((r1, r2) -> compareResourceRelevance(r1, r2, learningPlan.getCareerPath(), userProfile))
            .limit(10) // Limit to top 10 resources
            .collect(Collectors.toList());
        
        // Create resource recommendations
        List<ResourceRecommendation> recommendations = new ArrayList<>();
        for (Resource resource : filteredResources) {
            ResourceRecommendation recommendation = new ResourceRecommendation();
            recommendation.setUser(learningPlan.getUser());
            recommendation.setResource(resource);
            recommendation.setLearningPlan(learningPlan);
            recommendation.setRecommendationDate(new Date());
            
            recommendations.add(recommendation);
        }
        
        return recommendations;
    }
    
    /**
     * Checks if a resource is relevant for a career path
     * 
     * @param resource The resource to check
     * @param careerPath The career path to check against
     * @return True if the resource is relevant, false otherwise
     */
    private boolean isResourceRelevant(Resource resource, CareerPath careerPath) {
        // Check if resource categories match career path skills
        List<String> resourceCategories = Arrays.asList(resource.getCategories().split(","));
        List<String> careerSkills = Arrays.asList(careerPath.getRequiredSkills().split(","));
        
        return resourceCategories.stream()
            .anyMatch(category -> careerSkills.stream()
                .anyMatch(skill -> skill.toLowerCase().contains(category.toLowerCase()) || 
                         category.toLowerCase().contains(skill.toLowerCase())));
    }
    
    /**
     * Compares two resources based on relevance to career path and user preferences
     * 
     * @param r1 First resource
     * @param r2 Second resource
     * @param careerPath Career path to compare against
     * @param userProfile User profile with preferences
     * @return Comparison result (-1, 0, 1)
     */
    private int compareResourceRelevance(Resource r1, Resource r2, CareerPath careerPath, UserProfile userProfile) {
        // Calculate relevance scores for both resources
        double score1 = calculateResourceRelevanceScore(r1, careerPath, userProfile);
        double score2 = calculateResourceRelevanceScore(r2, careerPath, userProfile);
        
        // Compare scores (higher is better)
        return Double.compare(score2, score1);
    }
    
    /**
     * Calculates a relevance score for a resource based on career path and user preferences
     * 
     * @param resource The resource to score
     * @param careerPath The career path to compare against
     * @param userProfile The user profile with preferences
     * @return Relevance score
     */
    private double calculateResourceRelevanceScore(Resource resource, CareerPath careerPath, UserProfile userProfile) {
        double score = 0.0;
        
        // Base score from resource rating
        score += resource.getRating() * 0.3;
        
        // Score based on resource type matching user preferences
        if (userProfile.getLearningPreferences() != null && 
            userProfile.getLearningPreferences().contains(resource.getType())) {
            score += 0.3;
        }
        
        // Score based on skill relevance
        List<String> resourceCategories = Arrays.asList(resource.getCategories().split(","));
        List<String> careerSkills = Arrays.asList(careerPath.getRequiredSkills().split(","));
        
        long matchCount = resourceCategories.stream()
            .filter(category -> careerSkills.stream()
                .anyMatch(skill -> skill.toLowerCase().contains(category.toLowerCase()) || 
                         category.toLowerCase().contains(skill.toLowerCase())))
            .count();
        
        score += (double) matchCount / resourceCategories.size() * 0.4;
        
        return score;
    }
    
    /**
     * Updates a learning plan's progress based on completed tasks
     * 
     * @param learningPlan The learning plan to update
     * @return The updated learning plan
     */
    public LearningPlan updateProgress(LearningPlan learningPlan) {
        int totalTasks = 0;
        int completedTasks = 0;
        
        for (Milestone milestone : learningPlan.getMilestones()) {
            List<Task> tasks = milestone.getTasks();
            totalTasks += tasks.size();
            completedTasks += tasks.stream().filter(Task::isCompleted).count();
            
            // Update milestone completion status
            boolean allTasksCompleted = tasks.stream().allMatch(Task::isCompleted);
            milestone.setCompleted(allTasksCompleted);
            milestoneRepository.save(milestone);
        }
        
        // Calculate overall progress percentage
        int progressPercentage = totalTasks > 0 ? (int) ((double) completedTasks / totalTasks * 100) : 0;
        learningPlan.setProgressPercentage(progressPercentage);
        
        return learningPlanRepository.save(learningPlan);
    }
    
    // Helper classes for milestone and task templates
    
    private static class MilestoneTemplate {
        String title;
        String description;
        List<TaskTemplate> taskTemplates;
        
        MilestoneTemplate(String title, String description, List<TaskTemplate> taskTemplates) {
            this.title = title;
            this.description = description;
            this.taskTemplates = taskTemplates;
        }
    }
    
    private static class TaskTemplate {
        String title;
        String description;
        
        TaskTemplate(String title, String description) {
            this.title = title;
            this.description = description;
        }
    }
    
    /**
     * Gets milestone templates based on career path
     * 
     * @param careerTitle The career path title
     * @return List of milestone templates
     */
    private List<MilestoneTemplate> getMilestoneTemplates(String careerTitle) {
        // Common milestone templates for all tech careers
        List<MilestoneTemplate> commonTemplates = new ArrayList<>();
        
        // Milestone 1: Fundamentals (common for all paths)
        List<TaskTemplate> fundamentalsTasks = new ArrayList<>();
        fundamentalsTasks.add(new TaskTemplate(
            "Learn programming basics", 
            "Understand variables, data types, control structures, and functions."
        ));
        fundamentalsTasks.add(new TaskTemplate(
            "Set up your development environment", 
            "Install necessary software and tools for your learning journey."
        ));
        fundamentalsTasks.add(new TaskTemplate(
            "Complete an introductory course", 
            "Take an online course that covers the fundamentals of your chosen field."
        ));
        fundamentalsTasks.add(new TaskTemplate(
            "Build a simple project", 
            "Apply your knowledge to create a basic project that demonstrates fundamental concepts."
        ));
        
        commonTemplates.add(new MilestoneTemplate(
            "Technology Fundamentals",
            "Learn the core concepts and tools needed for your tech career journey.",
            fundamentalsTasks
        ));
        
        // Milestone 5: Professional Development (common for all paths)
        List<TaskTemplate> professionalTasks = new ArrayList<>();
        professionalTasks.add(new TaskTemplate(
            "Build a portfolio", 
            "Create a professional portfolio to showcase your projects and skills."
        ));
        professionalTasks.add(new TaskTemplate(
            "Prepare for technical interviews", 
            "Practice common interview questions and coding challenges for your field."
        ));
        professionalTasks.add(new TaskTemplate(
            "Create a resume/CV", 
            "Develop a professional resume highlighting your skills and projects."
        ));
        professionalTasks.add(new TaskTemplate(
            "Network with professionals", 
            "Join communities, attend meetups, and connect with professionals in your field."
        ));
        
        // Career-specific milestone templates
        List<MilestoneTemplate> careerSpecificTemplates = new ArrayList<>();
        
        if (careerTitle.contains("frontend") || careerTitle.contains("web")) {
            // Frontend Developer path
            
            // Milestone 2: Web Development Fundamentals
            List<TaskTemplate> webFundamentalsTasks = new ArrayList<>();
            webFundamentalsTasks.add(new TaskTemplate(
                "Learn HTML basics", 
                "Understand HTML structure, elements, and semantic markup."
            ));
            webFundamentalsTasks.add(new TaskTemplate(
                "Learn CSS basics", 
                "Understand CSS selectors, properties, and layout techniques."
            ));
            webFundamentalsTasks.add(new TaskTemplate(
                "Learn JavaScript basics", 
                "Understand variables, data types, functions, and control flow."
            ));
            webFundamentalsTasks.add(new TaskTemplate(
                "Build a simple static website", 
                "Apply your HTML and CSS knowledge to create a personal portfolio."
            ));
            
            careerSpecificTemplates.add(new MilestoneTemplate(
                "Web Development Fundamentals",
                "Learn the core technologies of the web: HTML, CSS, and JavaScript.",
                webFundamentalsTasks
            ));
            
            // Milestone 3: CSS Frameworks & Responsive Design
            List<TaskTemplate> cssTasks = new ArrayList<>();
            cssTasks.add(new TaskTemplate(
                "Learn responsive design principles", 
                "Understand media queries, flexible grids, and responsive images."
            ));
            cssTasks.add(new TaskTemplate(
                "Learn a CSS framework", 
                "Understand how to use a CSS framework like Bootstrap or Tailwind to speed up development."
            ));
            cssTasks.add(new TaskTemplate(
                "Build a responsive website", 
                "Apply your knowledge to create a responsive website that works on mobile and desktop."
            ));
            cssTasks.add(new TaskTemplate(
                "Optimize for performance", 
                "Learn techniques to improve website loading speed and performance."
            ));
            
            careerSpecificTemplates.add(new MilestoneTemplate(
                "CSS Frameworks & Responsive Design",
                "Learn how to create responsive websites that work well on all devices.",
                cssTasks
            ));
            
            // Milestone 4: JavaScript & Frontend Frameworks
            List<TaskTemplate> jsTasks = new ArrayList<>();
            jsTasks.add(new TaskTemplate(
                "Advanced JavaScript concepts", 
                "Learn about closures, promises, async/await, and ES6+ features."
            ));
            jsTasks.add(new TaskTemplate(
                "Learn a frontend framework", 
                "Understand components, state management, and routing in React, Vue, or Angular."
            ));
            jsTasks.add(new TaskTemplate(
                "Build interactive applications", 
                "Create dynamic web applications with user interactions and API integration."
            ));
            jsTasks.add(new TaskTemplate(
                "Learn testing techniques", 
                "Understand how to write unit tests and integration tests for your code."
            ));
            
            careerSpecificTemplates.add(new MilestoneTemplate(
                "JavaScript & Frontend Frameworks",
                "Master JavaScript and learn a modern frontend framework.",
                jsTasks
            ));
            
        } else if (careerTitle.contains("backend") || careerTitle.contains("full stack")) {
            // Backend Developer path
            
            // Milestone 2: Backend Fundamentals
            List<TaskTemplate> backendFundamentalsTasks = new ArrayList<>();
            backendFundamentalsTasks.add(new TaskTemplate(
                "Learn a backend language", 
                "Master a language like Java, Python, Node.js, or C#."
            ));
            backendFundamentalsTasks.add(new TaskTemplate(
                "Understand HTTP and APIs", 
                "Learn about HTTP methods, status codes, and RESTful API design."
            ));
            backendFundamentalsTasks.add(new TaskTemplate(
                "Learn basic data structures and algorithms", 
                "Understand common data structures and algorithms used in backend development."
            ));
            backendFundamentalsTasks.add(new TaskTemplate(
                "Build a simple API", 
                "Create a basic API that handles CRUD operations."
            ));
            
            careerSpecificTemplates.add(new MilestoneTemplate(
                "Backend Fundamentals",
                "Learn the core concepts of backend development.",
                backendFundamentalsTasks
            ));
            
            // Milestone 3: Databases & Data Modeling
            List<TaskTemplate> databaseTasks = new ArrayList<>();
            databaseTasks.add(new TaskTemplate(
                "Learn SQL fundamentals", 
                "Understand database design, SQL queries, and relationships."
            ));
            databaseTasks.add(new TaskTemplate(
                "Explore NoSQL databases", 
                "Learn about document databases like MongoDB and when to use them."
            ));
            databaseTasks.add(new TaskTemplate(
                "Implement data models", 
                "Design and implement data models for a backend application."
            ));
            databaseTasks.add(new TaskTemplate(
                "Learn about ORMs", 
                "Understand how to use Object-Relational Mapping tools."
            ));
            
            careerSpecificTemplates.add(new MilestoneTemplate(
                "Databases & Data Modeling",
                "Master database concepts and data modeling techniques.",
                databaseTasks
            ));
            
            // Milestone 4: Backend Frameworks & Architecture
            List<TaskTemplate> backendFrameworkTasks = new ArrayList<>();
            backendFrameworkTasks.add(new TaskTemplate(
                "Learn a backend framework", 
                "Master a framework like Spring Boot, Django, Express, or ASP.NET Core."
            ));
            backendFrameworkTasks.add(new TaskTemplate(
                "Understand authentication and authorization", 
                "Implement secure user authentication and role-based access control."
            ));
            backendFrameworkTasks.add(new TaskTemplate(
                "Learn about microservices", 
                "Understand microservice architecture and its benefits."
            ));
            backendFrameworkTasks.add(new TaskTemplate(
                "Build a complete backend application", 
                "Create a backend application with authentication, database integration, and API endpoints."
            ));
            
            careerSpecificTemplates.add(new MilestoneTemplate(
                "Backend Frameworks & Architecture",
                "Master backend frameworks and architectural patterns.",
                backendFrameworkTasks
            ));
            
        } else if (careerTitle.contains("data") || careerTitle.contains("analyst")) {
            // Data Analyst/Scientist path
            
            // Milestone 2: Data Analysis Fundamentals
            List<TaskTemplate> dataFundamentalsTasks = new ArrayList<>();
            dataFundamentalsTasks.add(new TaskTemplate(
                "Learn Python for data analysis", 
                "Master Python basics and libraries like NumPy and Pandas."
            ));
            dataFundamentalsTasks.add(new TaskTemplate(
                "Understand basic statistics", 
                "Learn descriptive statistics, probability, and statistical inference."
            ));
            dataFundamentalsTasks.add(new TaskTemplate(
                "Learn data cleaning techniques", 
                "Understand how to clean and preprocess data for analysis."
            ));
            dataFundamentalsTasks.add(new TaskTemplate(
                "Complete a basic data analysis project", 
                "Analyze a dataset and draw meaningful conclusions."
            ));
            
            careerSpecificTemplates.add(new MilestoneTemplate(
                "Data Analysis Fundamentals",
                "Learn the core concepts and tools for data analysis.",
                dataFundamentalsTasks
            ));
            
            // Milestone 3: Data Visualization & SQL
            List<TaskTemplate> dataVisTasks = new ArrayList<>();
            dataVisTasks.add(new TaskTemplate(
                "Learn data visualization techniques", 
                "Master tools like Matplotlib, Seaborn, or Tableau."
            ));
            dataVisTasks.add(new TaskTemplate(
                "Learn SQL for data analysis", 
                "Understand how to query databases and extract insights."
            ));
            dataVisTasks.add(new TaskTemplate(
                "Create interactive dashboards", 
                "Build interactive visualizations to communicate findings."
            ));
            dataVisTasks.add(new TaskTemplate(
                "Complete a data visualization project", 
                "Create visualizations that tell a compelling story with data."
            ));
            
            careerSpecificTemplates.add(new MilestoneTemplate(
                "Data Visualization & SQL",
                "Master data visualization techniques and SQL for data analysis.",
                dataVisTasks
            ));
            
            // Milestone 4: Advanced Analytics & Machine Learning
            List<TaskTemplate> mlTasks = new ArrayList<>();
            mlTasks.add(new TaskTemplate(
                "Learn machine learning fundamentals", 
                "Understand supervised and unsupervised learning algorithms."
            ));
            mlTasks.add(new TaskTemplate(
                "Master scikit-learn", 
                "Learn how to use scikit-learn for machine learning tasks."
            ));
            mlTasks.add(new TaskTemplate(
                "Understand model evaluation", 
                "Learn techniques to evaluate and improve machine learning models."
            ));
            mlTasks.add(new TaskTemplate(
                "Complete a machine learning project", 
                "Build and deploy a machine learning model to solve a real problem."
            ));
            
            careerSpecificTemplates.add(new MilestoneTemplate(
                "Advanced Analytics & Machine Learning",
                "Learn advanced analytics techniques and machine learning fundamentals.",
                mlTasks
            ));
            
        } else if (careerTitle.contains("ux") || careerTitle.contains("designer")) {
            // UX Designer path
            
            // Milestone 2: UX Fundamentals
            List<TaskTemplate> uxFundamentalsTasks = new ArrayList<>();
            uxFundamentalsTasks.add(new TaskTemplate(
                "Learn UX principles", 
                "Understand user-centered design, usability, and accessibility."
            ));
            uxFundamentalsTasks.add(new TaskTemplate(
                "Master design thinking", 
                "Learn the design thinking process and how to apply it."
            ));
            uxFundamentalsTasks.add(new TaskTemplate(
                "Learn user research methods", 
                "Understand interviews, surveys, and usability testing."
            ));
            uxFundamentalsTasks.add(new TaskTemplate(
                "Complete a UX case study", 
                "Document a design process from problem to solution."
            ));
            
            careerSpecificTemplates.add(new MilestoneTemplate(
                "UX Fundamentals",
                "Learn the core principles and methods of user experience design.",
                uxFundamentalsTasks
            ));
            
            // Milestone 3: UI Design & Prototyping
            List<TaskTemplate> uiTasks = new ArrayList<>();
            uiTasks.add(new TaskTemplate(
                "Learn visual design principles", 
                "Understand typography, color theory, and layout."
            ));
            uiTasks.add(new TaskTemplate(
                "Master a design tool", 
                "Learn Figma, Sketch, or Adobe XD for UI design."
            ));
            uiTasks.add(new TaskTemplate(
                "Create wireframes and prototypes", 
                "Build low and high-fidelity prototypes for user testing."
            ));
            uiTasks.add(new TaskTemplate(
                "Design a responsive interface", 
                "Create a UI that works across different devices and screen sizes."
            ));
            
            careerSpecificTemplates.add(new MilestoneTemplate(
                "UI Design & Prototyping",
                "Master user interface design and prototyping techniques.",
                uiTasks
            ));
            
            // Milestone 4: Advanced UX & Design Systems
            List<TaskTemplate> advancedUxTasks = new ArrayList<>();
            advancedUxTasks.add(new TaskTemplate(
                "Learn about design systems", 
                "Understand how to create and maintain design systems."
            ));
            advancedUxTasks.add(new TaskTemplate(
                "Master interaction design", 
                "Create meaningful animations and micro-interactions."
            ));
            advancedUxTasks.add(new TaskTemplate(
                "Understand UX writing", 
                "Learn how to write clear and effective UI copy."
            ));
            advancedUxTasks.add(new TaskTemplate(
                "Complete an end-to-end product design", 
                "Design a complete product from research to final UI."
            ));
            
            careerSpecificTemplates.add(new MilestoneTemplate(
                "Advanced UX & Design Systems",
                "Master advanced UX techniques and design systems.",
                advancedUxTasks
            ));
            
        } else if (careerTitle.contains("security") || careerTitle.contains("cyber")) {
            // Cybersecurity Specialist path
            
            // Milestone 2: Security Fundamentals
            List<TaskTemplate> securityFundamentalsTasks = new ArrayList<>();
            securityFundamentalsTasks.add(new TaskTemplate(
                "Learn networking basics", 
                "Understand TCP/IP, DNS, and network protocols."
            ));
            securityFundamentalsTasks.add(new TaskTemplate(
                "Understand security principles", 
                "Learn about CIA triad, authentication, and authorization."
            ));
            securityFundamentalsTasks.add(new TaskTemplate(
                "Learn about common vulnerabilities", 
                "Understand OWASP Top 10 and common attack vectors."
            ));
            securityFundamentalsTasks.add(new TaskTemplate(
                "Set up a security lab", 
                "Create a virtual environment for security testing."
            ));
            
            careerSpecificTemplates.add(new MilestoneTemplate(
                "Security Fundamentals",
                "Learn the core concepts and principles of cybersecurity.",
                securityFundamentalsTasks
            ));
            
            // Milestone 3: Security Tools & Techniques
            List<TaskTemplate> securityToolsTasks = new ArrayList<>();
            securityToolsTasks.add(new TaskTemplate(
                "Learn penetration testing basics", 
                "Understand how to identify and exploit vulnerabilities."
            ));
            securityToolsTasks.add(new TaskTemplate(
                "Master security tools", 
                "Learn tools like Wireshark, Metasploit, and Burp Suite."
            ));
            securityToolsTasks.add(new TaskTemplate(
                "Understand cryptography", 
                "Learn about encryption, hashing, and secure communications."
            ));
            securityToolsTasks.add(new TaskTemplate(
                "Complete a vulnerability assessment", 
                "Identify and document vulnerabilities in a system."
            ));
            
            careerSpecificTemplates.add(new MilestoneTemplate(
                "Security Tools & Techniques",
                "Master essential security tools and techniques.",
                securityToolsTasks
            ));
            
            // Milestone 4: Advanced Security & Incident Response
            List<TaskTemplate> advancedSecurityTasks = new ArrayList<>();
            advancedSecurityTasks.add(new TaskTemplate(
                "Learn incident response", 
                "Understand how to detect, analyze, and respond to security incidents."
            ));
            advancedSecurityTasks.add(new TaskTemplate(
                "Master security hardening", 
                "Learn how to secure systems and networks against attacks."
            ));
            advancedSecurityTasks.add(new TaskTemplate(
                "Understand security compliance", 
                "Learn about security standards and regulations."
            ));
            advancedSecurityTasks.add(new TaskTemplate(
                "Complete a security project", 
                "Implement a comprehensive security solution for a system."
            ));
            
            careerSpecificTemplates.add(new MilestoneTemplate(
                "Advanced Security & Incident Response",
                "Master advanced security techniques and incident response.",
                advancedSecurityTasks
            ));
            
        } else {
            // Default path for other tech careers
            
            // Milestone 2: Core Skills Development
            List<TaskTemplate> coreSkillsTasks = new ArrayList<>();
            coreSkillsTasks.add(new TaskTemplate(
                "Learn industry-specific tools", 
                "Master the essential tools used in your chosen field."
            ));
            coreSkillsTasks.add(new TaskTemplate(
                "Understand domain fundamentals", 
                "Learn the core concepts and principles of your domain."
            ));
            coreSkillsTasks.add(new TaskTemplate(
                "Complete guided tutorials", 
                "Follow step-by-step tutorials to build practical skills."
            ));
            coreSkillsTasks.add(new TaskTemplate(
                "Build a basic project", 
                "Apply your knowledge to create a simple project in your field."
            ));
            
            careerSpecificTemplates.add(new MilestoneTemplate(
                "Core Skills Development",
                "Master the fundamental skills required for your tech career.",
                coreSkillsTasks
            ));
            
            // Milestone 3: Intermediate Techniques
            List<TaskTemplate> intermediateTasks = new ArrayList<>();
            intermediateTasks.add(new TaskTemplate(
                "Learn advanced concepts", 
                "Deepen your understanding with more complex topics."
            ));
            intermediateTasks.add(new TaskTemplate(
                "Explore specialized tools", 
                "Learn additional tools that enhance your capabilities."
            ));
            intermediateTasks.add(new TaskTemplate(
                "Understand best practices", 
                "Learn industry standards and best practices."
            ));
            intermediateTasks.add(new TaskTemplate(
                "Complete an intermediate project", 
                "Build a more complex project that demonstrates your growing skills."
            ));
            
            careerSpecificTemplates.add(new MilestoneTemplate(
                "Intermediate Techniques",
                "Expand your skills with more advanced techniques and tools.",
                intermediateTasks
            ));
            
            // Milestone 4: Advanced Skills & Specialization
            List<TaskTemplate> advancedTasks = new ArrayList<>();
            advancedTasks.add(new TaskTemplate(
                "Develop a specialization", 
                "Focus on a specific area within your field."
            ));
            advancedTasks.add(new TaskTemplate(
                "Learn cutting-edge techniques", 
                "Explore the latest advancements in your field."
            ));
            advancedTasks.add(new TaskTemplate(
                "Contribute to open source", 
                "Participate in open source projects related to your field."
            ));
            advancedTasks.add(new TaskTemplate(
                "Complete an advanced project", 
                "Build a comprehensive project that showcases your expertise."
            ));
            
            careerSpecificTemplates.add(new MilestoneTemplate(
                "Advanced Skills & Specialization",
                "Develop expertise in specialized areas of your field.",
                advancedTasks
            ));
        }
        
        // Combine common and career-specific templates
        List<MilestoneTemplate> allTemplates = new ArrayList<>();
        allTemplates.add(commonTemplates.get(0)); // Fundamentals (first)
        allTemplates.addAll(careerSpecificTemplates); // Career-specific milestones (middle)
        allTemplates.add(new MilestoneTemplate(
            "Professional Development & Job Readiness",
            "Prepare for the job market and develop professional skills.",
            professionalTasks
        )); // Professional Development (last)
        
        return allTemplates;
    }
}
