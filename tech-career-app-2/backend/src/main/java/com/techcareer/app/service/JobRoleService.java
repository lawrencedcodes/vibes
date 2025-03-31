package com.techcareer.app.service;

import com.techcareer.app.model.*;
import com.techcareer.app.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class JobRoleService {

    @Autowired
    private JobRoleRepository jobRoleRepository;
    
    @Autowired
    private SkillRepository skillRepository;
    
    /**
     * Initialize job role data with detailed descriptions
     * This method populates the database with common entry-level tech job roles
     */
    public void initializeJobRoleData() {
        // Check if data already exists
        if (jobRoleRepository.count() > 0) {
            return;
        }
        
        // Web Development Career Path
        CareerPath webDevPath = new CareerPath();
        webDevPath.setId(1L);
        
        createFrontendDeveloperRole(webDevPath);
        createBackendDeveloperRole(webDevPath);
        createFullStackDeveloperRole(webDevPath);
        createWordPressDevRole(webDevPath);
        createWebContentManagerRole(webDevPath);
        
        // Software Engineering Career Path
        CareerPath softwareEngineeringPath = new CareerPath();
        softwareEngineeringPath.setId(2L);
        
        createJuniorSoftwareEngineerRole(softwareEngineeringPath);
        createMobileAppDeveloperRole(softwareEngineeringPath);
        createQAEngineerRole(softwareEngineeringPath);
        createBuildEngineerRole(softwareEngineeringPath);
        createSupportEngineerRole(softwareEngineeringPath);
        
        // Data Career Path
        CareerPath dataPath = new CareerPath();
        dataPath.setId(3L);
        
        createDataAnalystRole(dataPath);
        createJuniorDataScientistRole(dataPath);
        createDatabaseAdminRole(dataPath);
        createBIAnalystRole(dataPath);
        createDataEngineerRole(dataPath);
        
        // Design Career Path
        CareerPath designPath = new CareerPath();
        designPath.setId(4L);
        
        createUIDesignerRole(designPath);
        createUXDesignerRole(designPath);
        createGraphicDesignerRole(designPath);
        createProductDesignerRole(designPath);
        createVisualDesignerRole(designPath);
        
        // DevOps & Cloud Career Path
        CareerPath devOpsPath = new CareerPath();
        devOpsPath.setId(5L);
        
        createCloudSupportEngineerRole(devOpsPath);
        createJuniorDevOpsEngineerRole(devOpsPath);
        createSystemsAdminRole(devOpsPath);
        createNetworkOperationsTechRole(devOpsPath);
        createITSupportSpecialistRole(devOpsPath);
        
        // Cybersecurity Career Path
        CareerPath securityPath = new CareerPath();
        securityPath.setId(6L);
        
        createSecurityAnalystRole(securityPath);
        createITSecuritySpecialistRole(securityPath);
        createSOCAnalystRole(securityPath);
        createComplianceSpecialistRole(securityPath);
        createIAMSpecialistRole(securityPath);
        
        // Project Management Career Path
        CareerPath pmPath = new CareerPath();
        pmPath.setId(7L);
        
        createProjectCoordinatorRole(pmPath);
        createScrumMasterRole(pmPath);
        createTechnicalPMRole(pmPath);
        createProductOwnerRole(pmPath);
        createAgileCoachRole(pmPath);
    }
    
    private void createFrontendDeveloperRole(CareerPath careerPath) {
        JobRole role = new JobRole();
        role.setTitle("Frontend Developer");
        role.setCareerPath(careerPath);
        role.setDescription("Frontend developers build the user interfaces of websites and web applications. They focus on what users see and interact with in a browser.");
        role.setResponsibilities(
            "- Implement visual elements and user interfaces using HTML, CSS, and JavaScript\n" +
            "- Ensure websites are responsive and work well on different devices and browsers\n" +
            "- Collaborate with designers to translate mockups into functional interfaces\n" +
            "- Optimize applications for maximum speed and scalability\n" +
            "- Implement responsive design principles for mobile compatibility"
        );
        role.setRequiredSkills(getSkillsForFrontendDev());
        role.setAverageSalaryRange("$60,000 - $85,000");
        role.setMarketDemand("High");
        role.setRemoteWorkPotential("Excellent");
        role.setEntryLevelAccessibility("High - Many companies hire junior frontend developers");
        role.setGrowthOpportunities(
            "- Senior Frontend Developer\n" +
            "- UI/UX Developer\n" +
            "- Frontend Architect\n" +
            "- Full Stack Developer\n" +
            "- Technical Lead"
        );
        role.setLearningResources(
            "- freeCodeCamp's Responsive Web Design and JavaScript Algorithms & Data Structures certifications\n" +
            "- The Odin Project's Frontend track\n" +
            "- Frontend Masters courses\n" +
            "- MDN Web Docs for HTML, CSS, and JavaScript reference\n" +
            "- Frontend focused YouTube channels like Traversy Media and Web Dev Simplified"
        );
        
        jobRoleRepository.save(role);
    }
    
    private List<Skill> getSkillsForFrontendDev() {
        List<Skill> skills = new ArrayList<>();
        // In a real application, these would be fetched from the database
        // For this example, we're creating placeholder skills
        skills.add(createSkill(1L, "HTML", "Technical"));
        skills.add(createSkill(2L, "CSS", "Technical"));
        skills.add(createSkill(3L, "JavaScript", "Technical"));
        skills.add(createSkill(4L, "Responsive Design", "Technical"));
        skills.add(createSkill(5L, "React/Angular/Vue", "Technical"));
        skills.add(createSkill(20L, "Problem Solving", "Soft"));
        skills.add(createSkill(21L, "Attention to Detail", "Soft"));
        skills.add(createSkill(22L, "Communication", "Soft"));
        return skills;
    }
    
    private void createBackendDeveloperRole(CareerPath careerPath) {
        JobRole role = new JobRole();
        role.setTitle("Backend Developer");
        role.setCareerPath(careerPath);
        role.setDescription("Backend developers build and maintain the server-side logic that powers websites and applications. They focus on databases, server configuration, and application logic.");
        role.setResponsibilities(
            "- Design and implement server-side logic and APIs\n" +
            "- Develop and maintain databases and data storage solutions\n" +
            "- Ensure high performance and responsiveness of applications\n" +
            "- Collaborate with frontend developers to integrate user-facing elements\n" +
            "- Implement security and data protection measures"
        );
        role.setRequiredSkills(getSkillsForBackendDev());
        role.setAverageSalaryRange("$65,000 - $90,000");
        role.setMarketDemand("High");
        role.setRemoteWorkPotential("Excellent");
        role.setEntryLevelAccessibility("Medium - Often requires some programming knowledge");
        role.setGrowthOpportunities(
            "- Senior Backend Developer\n" +
            "- API Architect\n" +
            "- Database Administrator\n" +
            "- Full Stack Developer\n" +
            "- Technical Lead"
        );
        role.setLearningResources(
            "- freeCodeCamp's APIs and Microservices certification\n" +
            "- The Odin Project's NodeJS track\n" +
            "- Codecademy's Backend Engineer career path\n" +
            "- Official documentation for languages like Node.js, Python, Java, etc.\n" +
            "- YouTube channels like Traversy Media and Programming with Mosh"
        );
        
        jobRoleRepository.save(role);
    }
    
    private List<Skill> getSkillsForBackendDev() {
        List<Skill> skills = new ArrayList<>();
        skills.add(createSkill(6L, "Node.js/Python/Java/PHP", "Technical"));
        skills.add(createSkill(7L, "RESTful APIs", "Technical"));
        skills.add(createSkill(8L, "SQL Databases", "Technical"));
        skills.add(createSkill(9L, "Server Management", "Technical"));
        skills.add(createSkill(10L, "Authentication & Authorization", "Technical"));
        skills.add(createSkill(20L, "Problem Solving", "Soft"));
        skills.add(createSkill(23L, "Logical Thinking", "Soft"));
        skills.add(createSkill(24L, "Debugging", "Soft"));
        return skills;
    }
    
    private void createFullStackDeveloperRole(CareerPath careerPath) {
        JobRole role = new JobRole();
        role.setTitle("Full Stack Developer");
        role.setCareerPath(careerPath);
        role.setDescription("Full Stack Developers work on both client and server-side of applications. They can develop complete web applications, handling everything from the user interface to the database.");
        role.setResponsibilities(
            "- Develop both frontend and backend components of web applications\n" +
            "- Design and implement database structures\n" +
            "- Build user interfaces with modern JavaScript frameworks\n" +
            "- Ensure cross-platform compatibility and responsiveness\n" +
            "- Implement security and data protection measures"
        );
        role.setRequiredSkills(getSkillsForFullStackDev());
        role.setAverageSalaryRange("$70,000 - $95,000");
        role.setMarketDemand("Very High");
        role.setRemoteWorkPotential("Excellent");
        role.setEntryLevelAccessibility("Medium-Low - Often requires broader knowledge");
        role.setGrowthOpportunities(
            "- Senior Full Stack Developer\n" +
            "- Software Architect\n" +
            "- Technical Lead\n" +
            "- DevOps Engineer\n" +
            "- Engineering Manager"
        );
        role.setLearningResources(
            "- freeCodeCamp's full curriculum\n" +
            "- The Odin Project's Full Stack JavaScript track\n" +
            "- Codecademy's Full-Stack Engineer career path\n" +
            "- Udemy courses by Colt Steele, Angela Yu, or Stephen Grider\n" +
            "- YouTube channels like Traversy Media and Programming with Mosh"
        );
        
        jobRoleRepository.save(role);
    }
    
    private List<Skill> getSkillsForFullStackDev() {
        List<Skill> skills = new ArrayList<>();
        // Combine frontend and backend skills
        skills.addAll(getSkillsForFrontendDev());
        skills.addAll(getSkillsForBackendDev());
        // Remove duplicates
        return skills.stream().distinct().collect(Collectors.toList());
    }
    
    private void createWordPressDevRole(CareerPath careerPath) {
        JobRole role = new JobRole();
        role.setTitle("WordPress Developer");
        role.setCareerPath(careerPath);
        role.setDescription("WordPress Developers specialize in creating and customizing websites using the WordPress content management system. They work with themes, plugins, and custom code to build tailored solutions.");
        role.setResponsibilities(
            "- Develop and customize WordPress themes and plugins\n" +
            "- Configure and optimize WordPress installations\n" +
            "- Implement responsive designs and ensure cross-browser compatibility\n" +
            "- Troubleshoot WordPress issues and conflicts\n" +
            "- Maintain and update WordPress sites for security and performance"
        );
        role.setRequiredSkills(getSkillsForWordPressDev());
        role.setAverageSalaryRange("$50,000 - $75,000");
        role.setMarketDemand("Medium-High");
        role.setRemoteWorkPotential("Excellent");
        role.setEntryLevelAccessibility("High - Good entry point for web development");
        role.setGrowthOpportunities(
            "- Senior WordPress Developer\n" +
            "- WordPress Consultant\n" +
            "- Frontend Developer\n" +
            "- PHP Developer\n" +
            "- Web Development Team Lead"
        );
        role.setLearningResources(
            "- WordPress.org documentation\n" +
            "- WordPress Developer Handbook\n" +
            "- Udemy WordPress development courses\n" +
            "- WPBeginner tutorials\n" +
            "- YouTube channels like WPCrafter and Darrel Wilson"
        );
        
        jobRoleRepository.save(role);
    }
    
    private List<Skill> getSkillsForWordPressDev() {
        List<Skill> skills = new ArrayList<>();
        skills.add(createSkill(1L, "HTML", "Technical"));
        skills.add(createSkill(2L, "CSS", "Technical"));
        skills.add(createSkill(3L, "JavaScript", "Technical"));
        skills.add(createSkill(11L, "PHP", "Technical"));
        skills.add(createSkill(12L, "WordPress", "Technical"));
        skills.add(createSkill(13L, "Theme Development", "Technical"));
        skills.add(createSkill(20L, "Problem Solving", "Soft"));
        skills.add(createSkill(22L, "Communication", "Soft"));
        return skills;
    }
    
    private void createWebContentManagerRole(CareerPath careerPath) {
        JobRole role = new JobRole();
        role.setTitle("Web Content Manager");
        role.setCareerPath(careerPath);
        role.setDescription("Web Content Managers oversee the content strategy and implementation for websites. They combine technical skills with content creation and management abilities.");
        role.setResponsibilities(
            "- Manage and update website content using content management systems\n" +
            "- Ensure content is optimized for search engines (SEO)\n" +
            "- Coordinate with content creators, designers, and developers\n" +
            "- Monitor website analytics and user engagement\n" +
            "- Implement content governance and quality standards"
        );
        role.setRequiredSkills(getSkillsForWebContentManager());
        role.setAverageSalaryRange("$45,000 - $70,000");
        role.setMarketDemand("Medium");
        role.setRemoteWorkPotential("Very Good");
        role.setEntryLevelAccessibility("High - Good for those with content and basic technical skills");
        role.setGrowthOpportunities(
            "- Senior Content Manager\n" +
            "- Digital Marketing Manager\n" +
            "- Content Strategist\n" +
            "- SEO Specialist\n" +
            "- Digital Producer"
        );
        role.setLearningResources(
            "- Content Management System documentation (WordPress, Drupal, etc.)\n" +
            "- Google's SEO Starter Guide\n" +
            "- HubSpot Academy content marketing courses\n" +
            "- Coursera's Content Strategy for Professionals specialization\n" +
            "- YouTube channels like Ahrefs and Moz"
        );
        
        jobRoleRepository.save(role);
    }
    
    private List<Skill> getSkillsForWebContentManager() {
        List<Skill> skills = new ArrayList<>();
        skills.add(createSkill(1L, "HTML", "Technical"));
        skills.add(createSkill(2L, "CSS", "Technical"));
        skills.add(createSkill(12L, "WordPress/CMS", "Technical"));
        skills.add(createSkill(14L, "SEO", "Technical"));
        skills.add(createSkill(15L, "Content Strategy", "Technical"));
        skills.add(createSkill(22L, "Communication", "Soft"));
        skills.add(createSkill(25L, "Writing", "Soft"));
        skills.add(createSkill(26L, "Project Management", "Soft"));
        return skills;
    }
    
    // Additional job role creation methods for other career paths...
    
    private void createJuniorSoftwareEngineerRole(CareerPath careerPath) {
        JobRole role = new JobRole();
        role.setTitle("Junior Software Engineer");
        role.setCareerPath(careerPath);
        role.setDescription("Junior Software Engineers work on developing, testing, and maintaining software applications. They collabo<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>