'use client';

import React from 'react';

// Define types for career data
interface CareerSkill {
  id: string;
  name: string;
  weight: number;
}

interface CareerInterest {
  id: string;
  name: string;
  weight: number;
}

interface CareerEnvironment {
  id: string;
  name: string;
  weight: number;
}

interface CareerPath {
  id: string;
  title: string;
  description: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  demandLevel: 'High' | 'Medium' | 'Low';
  requiredSkills: string[];
  careerInterests: string[];
  workEnvironments: string[];
  learningPath: string;
  skills: CareerSkill[];
  interests: CareerInterest[];
  environments: CareerEnvironment[];
}

// Define types for user assessment data
interface UserAssessment {
  interests: string[];
  skills: string[];
  challenges: string[];
  workStyles: string[];
  techAccess: string[];
}

export class CareerRecommendationEngine {
  private careerPaths: CareerPath[];

  constructor() {
    // Initialize with career data
    this.careerPaths = this.getCareerPathsData();
  }

  // Method to generate career recommendations based on user assessment
  public generateRecommendations(assessment: UserAssessment): {
    career: CareerPath;
    matchPercentage: number;
    matchReasons: string[];
  }[] {
    const recommendations = this.careerPaths.map(career => {
      const matchScore = this.calculateMatchScore(career, assessment);
      const matchPercentage = Math.round(matchScore * 100);
      const matchReasons = this.generateMatchReasons(career, assessment);
      
      return {
        career,
        matchPercentage,
        matchReasons
      };
    });

    // Sort by match percentage (highest first)
    return recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);
  }

  // Calculate match score between a career and user assessment (0-1)
  private calculateMatchScore(career: CareerPath, assessment: UserAssessment): number {
    let totalScore = 0;
    let maxPossibleScore = 0;
    
    // Calculate interest match
    career.interests.forEach(interest => {
      maxPossibleScore += interest.weight;
      if (assessment.interests.includes(interest.id)) {
        totalScore += interest.weight;
      }
    });
    
    // Calculate skill match
    career.skills.forEach(skill => {
      maxPossibleScore += skill.weight;
      if (assessment.skills.includes(skill.id)) {
        totalScore += skill.weight;
      }
    });
    
    // Calculate environment match
    career.environments.forEach(env => {
      maxPossibleScore += env.weight;
      if (assessment.workStyles.includes(env.id)) {
        totalScore += env.weight;
      }
    });
    
    // Return normalized score (0-1)
    return maxPossibleScore > 0 ? totalScore / maxPossibleScore : 0;
  }

  // Generate human-readable reasons for the match
  private generateMatchReasons(career: CareerPath, assessment: UserAssessment): string[] {
    const reasons: string[] = [];
    
    // Check interest matches
    const matchedInterests = career.interests
      .filter(interest => assessment.interests.includes(interest.id))
      .map(interest => interest.name);
    
    if (matchedInterests.length > 0) {
      reasons.push(`Aligns with your interest in ${matchedInterests.join(', ')}`);
    }
    
    // Check skill matches
    const matchedSkills = career.skills
      .filter(skill => assessment.skills.includes(skill.id))
      .map(skill => skill.name);
    
    if (matchedSkills.length > 0) {
      reasons.push(`Leverages your existing skills in ${matchedSkills.join(', ')}`);
    }
    
    // Check environment matches
    const matchedEnvironments = career.environments
      .filter(env => assessment.workStyles.includes(env.id))
      .map(env => env.name);
    
    if (matchedEnvironments.length > 0) {
      reasons.push(`Matches your preference for ${matchedEnvironments.join(', ')}`);
    }
    
    // Add a reason about tech access if relevant
    if (assessment.techAccess.includes('high_speed_internet') && 
        (career.id === 'web_developer' || career.id === 'data_scientist')) {
      reasons.push('Learning path is accessible with your current technology resources');
    }
    
    // Add a reason about remote work if relevant
    if (assessment.workStyles.includes('remote') && 
        (career.id === 'web_developer' || career.id === 'ux_designer')) {
      reasons.push('Offers good remote work opportunities, which you indicated as a preference');
    }
    
    return reasons;
  }

  // Sample career paths data
  private getCareerPathsData(): CareerPath[] {
    return [
      {
        id: 'frontend_developer',
        title: 'Frontend Developer',
        description: 'Frontend developers create the user interfaces and interactive elements of websites and web applications. They work with HTML, CSS, and JavaScript to build responsive and engaging user experiences.',
        salary: {
          min: 70000,
          max: 120000,
          currency: 'USD'
        },
        demandLevel: 'High',
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Responsive Design', 'Version Control'],
        careerInterests: ['web development', 'design', 'user experience'],
        workEnvironments: ['remote', 'office', 'hybrid'],
        learningPath: '/learning-path/frontend-developer',
        skills: [
          { id: 'problem_solving', name: 'Problem Solving', weight: 0.8 },
          { id: 'creativity', name: 'Creativity', weight: 0.7 },
          { id: 'attention_detail', name: 'Attention to Detail', weight: 0.9 },
          { id: 'programming', name: 'Basic Programming', weight: 0.6 }
        ],
        interests: [
          { id: 'web_dev', name: 'Web Development', weight: 1.0 },
          { id: 'ux_ui', name: 'UX/UI Design', weight: 0.7 },
          { id: 'mobile_dev', name: 'Mobile App Development', weight: 0.5 }
        ],
        environments: [
          { id: 'remote', name: 'Remote Work', weight: 0.8 },
          { id: 'collaborative', name: 'Collaborative Environment', weight: 0.7 },
          { id: 'flexible', name: 'Flexible Environment', weight: 0.6 }
        ]
      },
      {
        id: 'data_analyst',
        title: 'Data Analyst',
        description: 'Data analysts collect, process, and analyze data to help organizations make better decisions. They use statistical methods and visualization tools to identify patterns and trends in data.',
        salary: {
          min: 65000,
          max: 110000,
          currency: 'USD'
        },
        demandLevel: 'High',
        requiredSkills: ['SQL', 'Excel', 'Data Visualization', 'Statistical Analysis', 'Python or R', 'Problem Solving'],
        careerInterests: ['data analysis', 'statistics', 'business intelligence'],
        workEnvironments: ['office', 'hybrid', 'corporate'],
        learningPath: '/learning-path/data-analyst',
        skills: [
          { id: 'problem_solving', name: 'Problem Solving', weight: 0.9 },
          { id: 'analytical', name: 'Analytical Thinking', weight: 1.0 },
          { id: 'attention_detail', name: 'Attention to Detail', weight: 0.8 },
          { id: 'programming', name: 'Basic Programming', weight: 0.6 }
        ],
        interests: [
          { id: 'data_science', name: 'Data Science & Analytics', weight: 1.0 },
          { id: 'ai_ml', name: 'AI & Machine Learning', weight: 0.6 }
        ],
        environments: [
          { id: 'remote', name: 'Remote Work', weight: 0.7 },
          { id: 'structured', name: 'Structured Environment', weight: 0.6 },
          { id: 'corporate', name: 'Corporate Environment', weight: 0.5 }
        ]
      },
      {
        id: 'ux_designer',
        title: 'UX Designer',
        description: 'UX designers focus on creating intuitive and enjoyable user experiences for digital products. They conduct user research, create wireframes and prototypes, and collaborate with developers to implement designs.',
        salary: {
          min: 75000,
          max: 130000,
          currency: 'USD'
        },
        demandLevel: 'Medium',
        requiredSkills: ['User Research', 'Wireframing', 'Prototyping', 'Visual Design', 'Usability Testing', 'Communication'],
        careerInterests: ['design', 'user experience', 'psychology'],
        workEnvironments: ['remote', 'collaborative', 'creative'],
        learningPath: '/learning-path/ux-designer',
        skills: [
          { id: 'creativity', name: 'Creativity', weight: 0.9 },
          { id: 'communication', name: 'Communication', weight: 0.8 },
          { id: 'attention_detail', name: 'Attention to Detail', weight: 0.7 },
          { id: 'empathy', name: 'Empathy', weight: 0.9 }
        ],
        interests: [
          { id: 'ux_ui', name: 'UX/UI Design', weight: 1.0 },
          { id: 'web_dev', name: 'Web Development', weight: 0.5 }
        ],
        environments: [
          { id: 'remote', name: 'Remote Work', weight: 0.8 },
          { id: 'collaborative', name: 'Collaborative Environment', weight: 0.9 },
          { id: 'flexible', name: 'Flexible Environment', weight: 0.7 }
        ]
      },
      {
        id: 'cybersecurity_analyst',
        title: 'Cybersecurity Analyst',
        description: 'Cybersecurity analysts protect organizations from digital threats. They monitor systems for security breaches, implement security measures, and respond to incidents when they occur.',
        salary: {
          min: 80000,
          max: 140000,
          currency: 'USD'
        },
        demandLevel: 'High',
        requiredSkills: ['Network Security', 'Security Tools', 'Risk Assessment', 'Incident Response', 'Security Protocols', 'Analytical Thinking'],
        careerInterests: ['cybersecurity', 'network security', 'information security'],
        workEnvironments: ['office', 'corporate', 'structured'],
        learningPath: '/learning-path/cybersecurity-analyst',
        skills: [
          { id: 'problem_solving', name: 'Problem Solving', weight: 0.9 },
          { id: 'analytical', name: 'Analytical Thinking', weight: 0.9 },
          { id: 'attention_detail', name: 'Attention to Detail', weight: 1.0 },
          { id: 'programming', name: 'Basic Programming', weight: 0.7 }
        ],
        interests: [
          { id: 'cybersecurity', name: 'Cybersecurity', weight: 1.0 },
          { id: 'devops', name: 'DevOps & Infrastructure', weight: 0.6 }
        ],
        environments: [
          { id: 'structured', name: 'Structured Environment', weight: 0.7 },
          { id: 'corporate', name: 'Corporate Environment', weight: 0.6 }
        ]
      },
      {
        id: 'mobile_developer',
        title: 'Mobile Developer',
        description: 'Mobile developers create applications for mobile devices like smartphones and tablets. They work with programming languages and frameworks specific to iOS or Android platforms.',
        salary: {
          min: 75000,
          max: 130000,
          currency: 'USD'
        },
        demandLevel: 'High',
        requiredSkills: ['Swift/Objective-C (iOS) or Kotlin/Java (Android)', 'Mobile UI Design', 'API Integration', 'Performance Optimization', 'Version Control'],
        careerInterests: ['mobile development', 'app development', 'software engineering'],
        workEnvironments: ['remote', 'flexible', 'collaborative'],
        learningPath: '/learning-path/mobile-developer',
        skills: [
          { id: 'problem_solving', name: 'Problem Solving', weight: 0.8 },
          { id: 'creativity', name: 'Creativity', weight: 0.6 },
          { id: 'attention_detail', name: 'Attention to Detail', weight: 0.9 },
          { id: 'programming', name: 'Basic Programming', weight: 0.7 }
        ],
        interests: [
          { id: 'mobile_dev', name: 'Mobile App Development', weight: 1.0 },
          { id: 'web_dev', name: 'Web Development', weight: 0.6 },
          { id: 'ux_ui', name: 'UX/UI Design', weight: 0.5 }
        ],
        environments: [
          { id: 'remote', name: 'Remote Work', weight: 0.7 },
          { id: 'collaborative', name: 'Collaborative Environment', weight: 0.6 },
          { id: 'flexible', name: 'Flexible Environment', weight: 0.6 }
        ]
      },
      {
        id: 'data_scientist',
        title: 'Data Scientist',
        description: 'Data scientists analyze and interpret complex data to help organizations make informed decisions. They use advanced statistical methods, machine learning, and programming to extract insights from data.',
        salary: {
          min: 90000,
          max: 150000,
          currency: 'USD'
        },
        demandLevel: 'High',
        requiredSkills: ['Python/R', 'Machine Learning', 'Statistical Analysis', 'Data Visualization', 'SQL', 'Big Data Technologies'],
        careerInterests: ['data science', 'machine learning', 'artificial intelligence'],
        workEnvironments: ['remote', 'research', 'corporate'],
        learningPath: '/learning-path/data-scientist',
        skills: [
          { id: 'problem_solving', name: 'Problem Solving', weight: 0.9 },
          { id: 'analytical', name: 'Analytical Thinking', weight: 1.0 },
          { id: 'attention_detail', name: 'Attention to Detail', weight: 0.8 },
          { id: 'programming', name: 'Basic Programming', weight: 0.8 }
        ],
        interests: [
          { id: 'data_science', name: 'Data Science & Analytics', weight: 1.0 },
          { id: 'ai_ml', name: 'AI & Machine Learning', weight: 0.9 }
        ],
        environments: [
          { id: 'remote', name: 'Remote Work', weight: 0.7 },
          { id: 'structured', name: 'Structured Environment', weight: 0.5 },
          { id: 'corporate', name: 'Corporate Environment', weight: 0.6 }
        ]
      },
      {
        id: 'devops_engineer',
        title: 'DevOps Engineer',
        description: 'DevOps engineers bridge the gap between software development and IT operations. They automate and optimize deployment pipelines, manage infrastructure, and ensure system reliability.',
        salary: {
          min: 85000,
          max: 145000,
          currency: 'USD'
        },
        demandLevel: 'High',
        requiredSkills: ['CI/CD', 'Cloud Platforms', 'Infrastructure as Code', 'Containerization', 'Scripting', 'Monitoring Tools'],
        careerInterests: ['devops', 'cloud computing', 'infrastructure'],
        workEnvironments: ['remote', 'collaborative', 'fast-paced'],
        learningPath: '/learning-path/devops-engineer',
        skills: [
          { id: 'problem_solving', name: 'Problem Solving', weight: 0.9 },
          { id: 'analytical', name: 'Analytical Thinking', weight: 0.8 },
          { id: 'attention_detail', name: 'Attention to Detail', weight: 0.9 },
          { id: 'programming', name: 'Basic Programming', weight: 0.8 }
        ],
        interests: [
          { id: 'devops', name: 'DevOps & Infrastructure', weight: 1.0 },
          { id: 'cloud', name: 'Cloud Computing', weight: 0.9 }
        ],
        environments: [
          { id: 'remote', name: 'Remote Work', weight: 0.8 },
          { id: 'collaborative', name: 'Collaborative Environment', weight: 0.7 }
        ]
      },
      {
        id: 'ai_ml_engineer',
        title: 'AI/ML Engineer',
        description: 'AI/ML engineers design and implement machine learning models and artificial intelligence systems. They work with algorithms, neural networks, and data processing to create intelligent applications.',
        salary: {
          min: 95000,
          max: 160000,
          currency: 'USD'
        },
        demandLevel: 'High',
        requiredSkills: ['Python', 'Machine Learning Frameworks', 'Neural Networks', 'Data Processing', 'Algorithm Design', 'Mathematics'],
        careerInterests: ['artificial intelligence', 'machine learning', 'research'],
        workEnvironments: ['research', 'corporate', 'remote'],
        learningPath: '/learning-path/ai-ml-engineer',
        skills: [
          { id: 'problem_solvin<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>