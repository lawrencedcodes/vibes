package com.techpathways.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.techpathways.api.models.*;
import com.techpathways.api.payload.response.MessageResponse;
import com.techpathways.api.repositories.*;
import com.techpathways.api.security.services.UserDetailsImpl;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/learning")
public class LearningPlanController {
    @Autowired
    LearningPlanRepository learningPlanRepository;

    @Autowired
    MilestoneRepository milestoneRepository;

    @Autowired
    TaskRepository taskRepository;

    @Autowired
    CareerPathRepository careerPathRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/plans")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUserLearningPlans() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        List<LearningPlan> plans = learningPlanRepository.findByUserId(userDetails.getId());
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/plans/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getLearningPlanById(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<LearningPlan> planOptional = learningPlanRepository.findById(id);
        if (!planOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Learning plan not found!"));
        }
        
        LearningPlan plan = planOptional.get();
        if (!plan.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Not authorized to view this learning plan!"));
        }
        
        return ResponseEntity.ok(plan);
    }

    @PostMapping("/generate-plan/{careerPathId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> generateLearningPlan(@PathVariable Long careerPathId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<User> userOptional = userRepository.findById(userDetails.getId());
        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found!"));
        }
        
        Optional<CareerPath> careerPathOptional = careerPathRepository.findById(careerPathId);
        if (!careerPathOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Career path not found!"));
        }
        
        // Check if a learning plan already exists for this user and career path
        Optional<LearningPlan> existingPlanOptional = 
            learningPlanRepository.findByUserIdAndCareerPathId(userDetails.getId(), careerPathId);
        
        if (existingPlanOptional.isPresent()) {
            return ResponseEntity.ok(existingPlanOptional.get());
        }
        
        // Create a new learning plan
        LearningPlan newPlan = new LearningPlan();
        newPlan.setUser(userOptional.get());
        newPlan.setCareerPath(careerPathOptional.get());
        newPlan.setTitle("1-Year Learning Plan for " + careerPathOptional.get().getTitle());
        newPlan.setDescription("A personalized learning plan to help you become a " + 
                              careerPathOptional.get().getTitle() + " within one year.");
        
        LearningPlan savedPlan = learningPlanRepository.save(newPlan);
        
        // Generate milestones (simplified for demo)
        generateMilestones(savedPlan);
        
        return ResponseEntity.ok(savedPlan);
    }

    @GetMapping("/plans/{planId}/milestones")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getPlanMilestones(@PathVariable Long planId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<LearningPlan> planOptional = learningPlanRepository.findById(planId);
        if (!planOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Learning plan not found!"));
        }
        
        LearningPlan plan = planOptional.get();
        if (!plan.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Not authorized to view this learning plan!"));
        }
        
        List<Milestone> milestones = milestoneRepository.findByLearningPlanIdOrderByOrderIndex(planId);
        return ResponseEntity.ok(milestones);
    }

    @GetMapping("/milestones/{milestoneId}/tasks")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getMilestoneTasks(@PathVariable Long milestoneId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<Milestone> milestoneOptional = milestoneRepository.findById(milestoneId);
        if (!milestoneOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Milestone not found!"));
        }
        
        Milestone milestone = milestoneOptional.get();
        if (!milestone.getLearningPlan().getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Not authorized to view these tasks!"));
        }
        
        List<Task> tasks = taskRepository.findByMilestoneIdOrderByOrderIndex(milestoneId);
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/milestones/{milestoneId}/complete")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> completeMilestone(@PathVariable Long milestoneId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<Milestone> milestoneOptional = milestoneRepository.findById(milestoneId);
        if (!milestoneOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Milestone not found!"));
        }
        
        Milestone milestone = milestoneOptional.get();
        if (!milestone.getLearningPlan().getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Not authorized to update this milestone!"));
        }
        
        milestone.setCompleted(true);
        milestoneRepository.save(milestone);
        
        return ResponseEntity.ok(new MessageResponse("Milestone completed successfully!"));
    }

    @PutMapping("/tasks/{taskId}/complete")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> completeTask(@PathVariable Long taskId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<Task> taskOptional = taskRepository.findById(taskId);
        if (!taskOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Task not found!"));
        }
        
        Task task = taskOptional.get();
        if (!task.getMilestone().getLearningPlan().getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Not authorized to update this task!"));
        }
        
        task.setCompleted(true);
        taskRepository.save(task);
        
        return ResponseEntity.ok(new MessageResponse("Task completed successfully!"));
    }

    // Helper method to generate milestones and tasks for a learning plan
    private void generateMilestones(LearningPlan plan) {
        // Month 1-3: Foundations
        Milestone foundations = new Milestone();
        foundations.setLearningPlan(plan);
        foundations.setTitle("Foundations");
        foundations.setDescription("Build the fundamental skills and knowledge required for your career path.");
        foundations.setDueDate(LocalDate.now().plusMonths(3));
        foundations.setOrderIndex(1);
        foundations.setCompleted(false);
        Milestone savedFoundations = milestoneRepository.save(foundations);
        
        // Create tasks for foundations
        createTask(savedFoundations, "Research the field", 
                  "Learn about the industry, key players, and current trends.", 1);
        createTask(savedFoundations, "Set up development environment", 
                  "Install necessary tools and software for learning.", 2);
        createTask(savedFoundations, "Complete introductory courses", 
                  "Take beginner-level courses to understand the basics.", 3);
        createTask(savedFoundations, "Build a simple project", 
                  "Apply what you've learned in a small project.", 4);
        
        // Month 4-6: Skill Building
        Milestone skillBuilding = new Milestone();
        skillBuilding.setLearningPlan(plan);
        skillBuilding.setTitle("Skill Building");
        skillBuilding.setDescription("Deepen your knowledge and develop specialized skills.");
        skillBuilding.setDueDate(LocalDate.now().plusMonths(6));
        skillBuilding.setOrderIndex(2);
        skillBuilding.setCompleted(false);
        Milestone savedSkillBuilding = milestoneRepository.save(skillBuilding);
        
        // Create tasks for skill building
        createTask(savedSkillBuilding, "Take intermediate courses", 
                  "Advance your knowledge with more specialized courses.", 1);
        createTask(savedSkillBuilding, "Join online communities", 
                  "Participate in forums, Discord servers, or other communities related to your field.", 2);
        createTask(savedSkillBuilding, "Build a portfolio project", 
                  "Create a more complex project that demonstrates your growing skills.", 3);
        createTask(savedSkillBuilding, "Get feedback on your work", 
                  "Share your project with peers or mentors for constructive criticism.", 4);
        
        // Month 7-9: Professional Development
        Milestone professionalDev = new Milestone();
        professionalDev.setLearningPlan(plan);
        professionalDev.setTitle("Professional Development");
        professionalDev.setDescription("Prepare for the job market and develop professional skills.");
        professionalDev.setDueDate(LocalDate.now().plusMonths(9));
        professionalDev.setOrderIndex(3);
        professionalDev.setCompleted(false);
        Milestone savedProfDev = milestoneRepository.save(professionalDev);
        
        // Create tasks for professional development
        createTask(savedProfDev, "Create a resume", 
                  "Develop a professional resume highlighting your skills and projects.", 1);
        createTask(savedProfDev, "Build an online presence", 
                  "Create profiles on LinkedIn, GitHub, or other relevant platforms.", 2);
        createTask(savedProfDev, "Practice interview questions", 
                  "Prepare for technical and behavioral interviews.", 3);
        createTask(savedProfDev, "Network with professionals", 
                  "Attend meetups, webinars, or conferences in your field.", 4);
        
        // Month 10-12: Job Readiness
        Milestone jobReadiness = new Milestone();
        jobReadiness.setLearningPlan(plan);
        jobReadiness.setTitle("Job Readiness");
        jobReadiness.setDescription("Finalize your preparation and begin applying for positions.");
        jobReadiness.setDueDate(LocalDate.now().plusMonths(12));
        jobReadiness.setOrderIndex(4);
        jobReadiness.setCompleted(false);
        Milestone savedJobReadiness = milestoneRepository.save(jobReadiness);
        
        // Create tasks for job readiness
        createTask(savedJobReadiness, "Complete a capstone project", 
                  "Build a comprehensive project that showcases all your skills.", 1);
        createTask(savedJobReadiness, "Finalize your portfolio", 
                  "Polish your portfolio website and project documentation.", 2);
        createTask(savedJobReadiness, "Apply for positions", 
                  "Start applying for jobs or freelance opportunities.", 3);
        createTask(savedJobReadiness, "Prepare for continuous learning", 
                  "Plan your ongoing education and skill development.", 4);
    }

    private void createTask(Milestone milestone, String title, String description, int orderIndex) {
        Task task = new Task();
        task.setMilestone(milestone);
        task.setTitle(title);
        task.setDescription(description);
        task.setOrderIndex(orderIndex);
        task.setCompleted(false);
        taskRepository.save(task);
    }
}
