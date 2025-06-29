'use client';

import React from 'react';

// Define types for learning resources
interface LearningResource {
  id: string;
  title: string;
  type: 'course' | 'tutorial' | 'book' | 'video' | 'project' | 'community' | 'tool';
  provider: string;
  url: string;
  description: string;
  duration: string; // e.g., "4 weeks", "2 hours"
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  cost: 'free' | 'freemium' | 'paid';
  tags: string[];
}

// Define types for learning milestones
interface LearningMilestone {
  id: string;
  title: string;
  description: string;
  timeframe: string; // e.g., "Week 1-2", "Month 3"
  skills: string[];
  resources: LearningResource[];
  projects?: {
    title: string;
    description: string;
    skills: string[];
  }[];
}

// Define types for career learning path
interface CareerLearningPath {
  id: string;
  careerTitle: string;
  description: string;
  duration: string; // e.g., "12 months"
  prerequisites: string[];
  milestones: LearningMilestone[];
  certifications?: {
    name: string;
    provider: string;
    url: string;
    description: string;
  }[];
  communityResources: {
    name: string;
    type: string;
    url: string;
    description: string;
  }[];
}

export class LearningPlanGenerator {
  private learningPaths: Record<string, CareerLearningPath>;

  constructor() {
    // Initialize with learning path data
    this.learningPaths = this.getLearningPathsData();
  }

  // Method to generate a personalized learning plan based on career path and user preferences
  public generateLearningPlan(
    careerPathId: string,
    userPreferences: {
      timeCommitment: 'full-time' | 'part-time-20' | 'part-time-10' | 'few-hours' | 'weekends';
      currentSkills: string[];
      learningStyle?: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
      budget?: 'free-only' | 'low-cost' | 'any';
    }
  ): {
    learningPath: CareerLearningPath;
    adjustedTimeframe: string;
    personalizedMilestones: LearningMilestone[];
    recommendedStartingPoint: string;
  } {
    // Get the base learning path for the career
    const basePath = this.learningPaths[careerPathId];
    
    if (!basePath) {
      throw new Error(`Learning path not found for career: ${careerPathId}`);
    }
    
    // Adjust timeframe based on time commitment
    const adjustedTimeframe = this.adjustTimeframe(basePath.duration, userPreferences.timeCommitment);
    
    // Personalize milestones based on user preferences
    const personalizedMilestones = this.personalizeMilestones(
      basePath.milestones,
      userPreferences
    );
    
    // Determine recommended starting point based on current skills
    const recommendedStartingPoint = this.determineStartingPoint(
      basePath,
      userPreferences.currentSkills
    );
    
    return {
      learningPath: basePath,
      adjustedTimeframe,
      personalizedMilestones,
      recommendedStartingPoint
    };
  }

  // Adjust the overall timeframe based on user's time commitment
  private adjustTimeframe(
    baseDuration: string,
    timeCommitment: 'full-time' | 'part-time-20' | 'part-time-10' | 'few-hours' | 'weekends'
  ): string {
    // Extract the numeric value and unit from the base duration
    const match = baseDuration.match(/(\d+)\s+(\w+)/);
    if (!match) return baseDuration;
    
    const [_, value, unit] = match;
    const numericValue = parseInt(value);
    
    // Apply multiplier based on time commitment
    let multiplier = 1;
    switch (timeCommitment) {
      case 'full-time':
        multiplier = 1;
        break;
      case 'part-time-20':
        multiplier = 1.5;
        break;
      case 'part-time-10':
        multiplier = 2;
        break;
      case 'few-hours':
        multiplier = 3;
        break;
      case 'weekends':
        multiplier = 2.5;
        break;
    }
    
    const adjustedValue = Math.round(numericValue * multiplier);
    return `${adjustedValue} ${unit}`;
  }

  // Personalize milestones based on user preferences
  private personalizeMilestones(
    baseMilestones: LearningMilestone[],
    userPreferences: {
      timeCommitment: string;
      currentSkills: string[];
      learningStyle?: string;
      budget?: string;
    }
  ): LearningMilestone[] {
    return baseMilestones.map(milestone => {
      // Create a copy of the milestone to modify
      const personalizedMilestone = { ...milestone };
      
      // Filter resources based on budget constraints
      if (userPreferences.budget) {
        personalizedMilestone.resources = milestone.resources.filter(resource => {
          if (userPreferences.budget === 'free-only') {
            return resource.cost === 'free';
          } else if (userPreferences.budget === 'low-cost') {
            return resource.cost === 'free' || resource.cost === 'freemium';
          }
          return true;
        });
      }
      
      // Prioritize resources based on learning style
      if (userPreferences.learningStyle) {
        personalizedMilestone.resources = this.prioritizeResourcesByLearningStyle(
          personalizedMilestone.resources,
          userPreferences.learningStyle
        );
      }
      
      // Adjust timeframe based on time commitment
      personalizedMilestone.timeframe = this.adjustMilestoneTimeframe(
        milestone.timeframe,
        userPreferences.timeCommitment
      );
      
      return personalizedMilestone;
    });
  }

  // Prioritize resources based on learning style
  private prioritizeResourcesByLearningStyle(
    resources: LearningResource[],
    learningStyle: string
  ): LearningResource[] {
    // Create a copy of resources to sort
    const sortedResources = [...resources];
    
    // Define resource types that match each learning style
    const learningStylePreferences: Record<string, string[]> = {
      'visual': ['video', 'tutorial'],
      'auditory': ['video', 'course'],
      'reading': ['book', 'tutorial', 'course'],
      'kinesthetic': ['project', 'tutorial']
    };
    
    // Sort resources based on learning style preference
    return sortedResources.sort((a, b) => {
      const preferredTypes = learningStylePreferences[learningStyle] || [];
      const aIsPreferred = preferredTypes.includes(a.type);
      const bIsPreferred = preferredTypes.includes(b.type);
      
      if (aIsPreferred && !bIsPreferred) return -1;
      if (!aIsPreferred && bIsPreferred) return 1;
      return 0;
    });
  }

  // Adjust milestone timeframe based on time commitment
  private adjustMilestoneTimeframe(
    baseTimeframe: string,
    timeCommitment: string
  ): string {
    // Parse the timeframe (e.g., "Week 1-2", "Month 3")
    const match = baseTimeframe.match(/(Week|Month)\s+(\d+)(?:-(\d+))?/);
    if (!match) return baseTimeframe;
    
    const [_, unit, start, end] = match;
    const startNum = parseInt(start);
    const endNum = end ? parseInt(end) : startNum;
    
    // Apply multiplier based on time commitment
    let multiplier = 1;
    switch (timeCommitment) {
      case 'full-time':
        multiplier = 1;
        break;
      case 'part-time-20':
        multiplier = 1.5;
        break;
      case 'part-time-10':
        multiplier = 2;
        break;
      case 'few-hours':
        multiplier = 3;
        break;
      case 'weekends':
        multiplier = 2.5;
        break;
    }
    
    const adjustedStart = Math.round(startNum * multiplier);
    const adjustedEnd = end ? Math.round(endNum * multiplier) : adjustedStart;
    
    if (adjustedStart === adjustedEnd) {
      return `${unit} ${adjustedStart}`;
    } else {
      return `${unit} ${adjustedStart}-${adjustedEnd}`;
    }
  }

  // Determine recommended starting point based on current skills
  private determineStartingPoint(
    learningPath: CareerLearningPath,
    currentSkills: string[]
  ): string {
    // Check if user already has prerequisites
    const hasAllPrerequisites = learningPath.prerequisites.every(prereq => 
      currentSkills.some(skill => skill.toLowerCase().includes(prereq.toLowerCase()))
    );
    
    if (hasAllPrerequisites) {
      // Check if user has skills from early milestones
      for (let i = 0; i < learningPath.milestones.length; i++) {
        const milestone = learningPath.milestones[i];
        const hasAllMilestoneSkills = milestone.skills.every(skill => 
          currentSkills.some(userSkill => userSkill.toLowerCase().includes(skill.toLowerCase()))
        );
        
        if (!hasAllMilestoneSkills) {
          return `We recommend starting at ${milestone.title} since you already have the prerequisite skills.`;
        }
      }
      
      return "Based on your current skills, you can start with more advanced milestones in the learning path.";
    }
    
    return "We recommend starting from the beginning of the learning path to build a solid foundation.";
  }

  // Sample learning paths data
  private getLearningPathsData(): Record<string, CareerLearningPath> {
    return {
      'frontend_developer': {
        id: 'frontend_developer',
        careerTitle: 'Frontend Developer',
        description: 'A structured learning path to become a professional Frontend Developer, focusing on building responsive and interactive web interfaces.',
        duration: '12 months',
        prerequisites: ['Basic computer skills', 'Internet access'],
        milestones: [
          {
            id: 'fd_milestone_1',
            title: 'Web Development Fundamentals',
            description: 'Learn the core technologies of the web: HTML, CSS, and JavaScript basics.',
            timeframe: 'Week 1-4',
            skills: ['HTML5', 'CSS3', 'JavaScript Basics'],
            resources: [
              {
                id: 'fd_resource_1',
                title: 'HTML & CSS Crash Course',
                type: 'course',
                provider: 'freeCodeCamp',
                url: 'https://www.freecodecamp.org/learn/responsive-web-design/',
                description: 'A comprehensive introduction to HTML and CSS with hands-on projects.',
                duration: '2 weeks',
                difficulty: 'beginner',
                cost: 'free',
                tags: ['HTML', 'CSS', 'Web Development']
              },
              {
                id: 'fd_resource_2',
                title: 'JavaScript Basics',
                type: 'course',
                provider: 'MDN Web Docs',
                url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript',
                description: 'Learn JavaScript fundamentals from the official Mozilla documentation.',
                duration: '2 weeks',
                difficulty: 'beginner',
                cost: 'free',
                tags: ['JavaScript', 'Web Development']
              }
            ],
            projects: [
              {
                title: 'Personal Portfolio Page',
                description: 'Create a simple portfolio page using HTML and CSS to showcase your projects.',
                skills: ['HTML5', 'CSS3', 'Responsive Design']
              }
            ]
          },
          {
            id: 'fd_milestone_2',
            title: 'Interactive Web Development',
            description: 'Deepen your JavaScript knowledge and learn to create interactive web elements.',
            timeframe: 'Week 5-8',
            skills: ['JavaScript DOM Manipulation', 'ES6 Features', 'Web APIs'],
            resources: [
              {
                id: 'fd_resource_3',
                title: 'JavaScript: Understanding the Weird Parts',
                type: 'course',
                provider: 'Udemy',
                url: 'https://www.udemy.com/course/understand-javascript/',
                description: 'Deep dive into JavaScript concepts and how they work under the hood.',
                duration: '3 weeks',
                difficulty: 'intermediate',
                cost: 'paid',
                tags: ['JavaScript', 'Web Development']
              },
              {
                id: 'fd_resource_4',
                title: 'JavaScript30',
                type: 'tutorial',
                provider: 'Wes Bos',
                url: 'https://javascript30.com/',
                description: '30 day vanilla JS coding challenge with 30 different projects.',
                duration: '1 month',
                difficulty: 'intermediate',
                cost: 'free',
                tags: ['JavaScript', 'Web Development', 'Projects']
              }
            ],
            projects: [
              {
                title: 'Interactive Web App',
                description: 'Build a to-do list or weather app using JavaScript and Web APIs.',
                skills: ['JavaScript', 'DOM Manipulation', 'API Integration']
              }
            ]
          },
          {
            id: 'fd_milestone_3',
            title: 'Frontend Frameworks',
            description: 'Learn a modern JavaScript framework (React) to build complex user interfaces.',
            timeframe: 'Week 9-16',
            skills: ['React.js', 'State Management', 'Component Architecture'],
            resources: [
              {
                id: 'fd_resource_5',
                title: 'React - The Complete Guide',
                type: 'course',
                provider: 'Udemy',
                url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
                description: 'Comprehensive guide to React including Hooks, Redux, and Next.js.',
                duration: '6 weeks',
                difficulty: 'intermediate',
                cost: 'paid',
                tags: ['React', 'JavaScript', 'Web Development']
              },
              {
                id: 'fd_resource_6',
                title: 'React Documentation',
                type: 'tutorial',
                provider: 'React',
                url: 'https://reactjs.org/docs/getting-started.html',
                description: 'Official React documentation with tutorials and guides.',
                duration: '2 weeks',
                difficulty: 'intermediate',
                cost: 'free',
                tags: ['React', 'JavaScript', 'Web Development']
              }
            ],
            projects: [
              {
                title: 'React Application',
                description: 'Build a multi-page React application with state management and API integration.',
                skills: ['React.js', 'State Management', 'API Integration']
              }
            ]
          },
          {
            id: 'fd_milestone_4',
            title: 'Advanced Frontend Development',
            description: 'Master advanced frontend concepts and prepare for professional work.',
            timeframe: 'Week 17-24',
            skills: ['TypeScript', 'Testing', 'Performance Optimization', 'Accessibility'],
            resources: [
              {
                id: 'fd_resource_7',
                title: 'TypeScript Documentation',
                type: 'tutorial',
                provider: 'TypeScript',
                url: 'https://www.typescriptlang.org/docs/',
                description: 'Official TypeScript documentation with guides and examples.',
                duration: '2 weeks',
                difficulty: 'advanced',
                cost: 'free',
                tags: ['TypeScript', 'JavaScript', 'Web Development']
              },
              {
                id: 'fd_resource_8',
                title: 'Testing JavaScript Applications',
                type: 'course',
                provider: 'Kent C. Dodds',
                url: 'https://testingjavascript.com/',
                description: 'Learn to test JavaScript applications with Jest, React Testing Library, and Cypress.',
                duration: '3 weeks',
                difficulty: 'advanced',
                cost: 'paid',
                tags: ['Testing', 'JavaScript', 'Web Development']
              }
            ],
            projects: [
<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>