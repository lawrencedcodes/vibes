'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Input, Textarea, Select, Checkbox, Radio } from '@/components/ui/FormElements';
import { ProgressBar, Badge } from '@/components/ui/Feedback';
import { Container, Flex, Grid, Section } from '@/components/ui/Layout';

// Define the question types
type QuestionType = 'interest' | 'skill' | 'challenge' | 'workstyle' | 'jobrole' | 'access';

// Define the question interface
interface Question {
  id: string;
  type: QuestionType;
  question: string;
  description?: string;
  options?: {
    id: string;
    text: string;
    icon?: string;
  }[];
  allowMultiple?: boolean;
  allowCustom?: boolean;
}

export default function AssessmentForm() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string[]>>({});
  const [customAnswer, setCustomAnswer] = React.useState('');

  // Sample questions for the assessment
  const questions: Question[] = [
    {
      id: 'interest_area',
      type: 'interest',
      question: 'Which areas of technology interest you the most?',
      description: 'Select all that apply to help us understand your interests better.',
      options: [
        { id: 'web_dev', text: 'Web Development', icon: 'code' },
        { id: 'mobile_dev', text: 'Mobile App Development', icon: 'smartphone' },
        { id: 'data_science', text: 'Data Science & Analytics', icon: 'chart-bar' },
        { id: 'ai_ml', text: 'Artificial Intelligence & Machine Learning', icon: 'brain' },
        { id: 'cybersecurity', text: 'Cybersecurity', icon: 'shield-check' },
        { id: 'cloud', text: 'Cloud Computing', icon: 'cloud' },
        { id: 'devops', text: 'DevOps & Infrastructure', icon: 'server' },
        { id: 'ux_ui', text: 'UX/UI Design', icon: 'palette' },
        { id: 'game_dev', text: 'Game Development', icon: 'gamepad' },
        { id: 'blockchain', text: 'Blockchain & Cryptocurrency', icon: 'link' },
      ],
      allowMultiple: true,
      allowCustom: true,
    },
    {
      id: 'existing_skills',
      type: 'skill',
      question: 'What skills do you already have?',
      description: 'Select all that apply to help us understand your current strengths.',
      options: [
        { id: 'problem_solving', text: 'Problem Solving', icon: 'puzzle-piece' },
        { id: 'communication', text: 'Communication', icon: 'chat' },
        { id: 'creativity', text: 'Creativity', icon: 'lightbulb' },
        { id: 'teamwork', text: 'Teamwork', icon: 'users' },
        { id: 'leadership', text: 'Leadership', icon: 'user-tie' },
        { id: 'time_management', text: 'Time Management', icon: 'clock' },
        { id: 'adaptability', text: 'Adaptability', icon: 'sync' },
        { id: 'analytical', text: 'Analytical Thinking', icon: 'chart-line' },
        { id: 'attention_detail', text: 'Attention to Detail', icon: 'search' },
        { id: 'programming', text: 'Basic Programming', icon: 'code' },
      ],
      allowMultiple: true,
      allowCustom: true,
    },
    {
      id: 'challenges',
      type: 'challenge',
      question: 'What challenges do you anticipate in your tech journey?',
      description: 'Being honest about challenges helps us provide better guidance.',
      options: [
        { id: 'technical_concepts', text: 'Understanding Technical Concepts', icon: 'book' },
        { id: 'time_commitment', text: 'Finding Time to Learn', icon: 'clock' },
        { id: 'self_motivation', text: 'Staying Motivated', icon: 'fire' },
        { id: 'imposter_syndrome', text: 'Imposter Syndrome', icon: 'user-secret' },
        { id: 'information_overload', text: 'Information Overload', icon: 'brain' },
        { id: 'practical_experience', text: 'Getting Practical Experience', icon: 'laptop-code' },
        { id: 'networking', text: 'Networking with Professionals', icon: 'network-wired' },
        { id: 'job_search', text: 'Job Search Process', icon: 'briefcase' },
        { id: 'financial_constraints', text: 'Financial Constraints', icon: 'dollar-sign' },
        { id: 'work_life_balance', text: 'Work-Life Balance', icon: 'balance-scale' },
      ],
      allowMultiple: true,
      allowCustom: true,
    },
    {
      id: 'work_style',
      type: 'workstyle',
      question: 'What type of work environment do you prefer?',
      description: 'This helps us recommend career paths that match your preferences.',
      options: [
        { id: 'remote', text: 'Remote Work', icon: 'home' },
        { id: 'hybrid', text: 'Hybrid (Mix of Remote and Office)', icon: 'building' },
        { id: 'office', text: 'Office-Based', icon: 'city' },
        { id: 'collaborative', text: 'Highly Collaborative', icon: 'users' },
        { id: 'independent', text: 'Independent Work', icon: 'user' },
        { id: 'structured', text: 'Structured Environment', icon: 'tasks' },
        { id: 'flexible', text: 'Flexible Environment', icon: 'wind' },
        { id: 'startup', text: 'Startup Culture', icon: 'rocket' },
        { id: 'corporate', text: 'Corporate Environment', icon: 'building' },
        { id: 'freelance', text: 'Freelance/Contract Work', icon: 'briefcase' },
      ],
      allowMultiple: true,
      allowCustom: false,
    },
    {
      id: 'tech_access',
      type: 'access',
      question: 'What technology do you currently have access to?',
      description: 'This helps us recommend learning paths based on your resources.',
      options: [
        { id: 'laptop', text: 'Laptop/Desktop Computer', icon: 'laptop' },
        { id: 'smartphone', text: 'Smartphone', icon: 'mobile-alt' },
        { id: 'tablet', text: 'Tablet', icon: 'tablet-alt' },
        { id: 'high_speed_internet', text: 'High-Speed Internet', icon: 'wifi' },
        { id: 'limited_internet', text: 'Limited Internet Access', icon: 'signal' },
        { id: 'public_computer', text: 'Public Computer (Library, etc.)', icon: 'desktop' },
        { id: 'shared_device', text: 'Shared Device', icon: 'users' },
      ],
      allowMultiple: true,
      allowCustom: true,
    },
  ];

  const currentQuestion = questions[currentStep];

  const handleOptionSelect = (optionId: string) => {
    const questionId = currentQuestion.id;
    
    if (currentQuestion.allowMultiple) {
      // For multiple selection questions
      const currentAnswers = answers[questionId] || [];
      if (currentAnswers.includes(optionId)) {
        // Remove if already selected
        setAnswers({
          ...answers,
          [questionId]: currentAnswers.filter(id => id !== optionId)
        });
      } else {
        // Add if not selected
        setAnswers({
          ...answers,
          [questionId]: [...currentAnswers, optionId]
        });
      }
    } else {
      // For single selection questions
      setAnswers({
        ...answers,
        [questionId]: [optionId]
      });
      // Automatically move to next question for single selection
      if (currentStep < questions.length - 1) {
        setTimeout(() => setCurrentStep(currentStep + 1), 300);
      }
    }
  };

  const handleAddCustom = () => {
    if (!customAnswer.trim()) return;
    
    const questionId = currentQuestion.id;
    const currentAnswers = answers[questionId] || [];
    const customId = `custom_${Date.now()}`;
    
    setAnswers({
      ...answers,
      [questionId]: [...currentAnswers, customId],
      [`${questionId}_custom_${customId}`]: [customAnswer]
    });
    
    setCustomAnswer('');
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit the assessment
      console.log('Assessment completed:', answers);
      // Here you would typically send the data to your backend or process it
      window.location.href = '/results';
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isOptionSelected = (optionId: string) => {
    const questionId = currentQuestion.id;
    return answers[questionId]?.includes(optionId) || false;
  };

  const canProceed = () => {
    const questionId = currentQuestion.id;
    return answers[questionId] && answers[questionId].length > 0;
  };

  const progressPercentage = ((currentStep + 1) / questions.length) * 100;

  return (
    <Container className="py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Flex justify="between" align="center" className="mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progressPercentage)}% Complete
            </span>
          </Flex>
          <ProgressBar value={progressPercentage} />
        </div>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>{currentQuestion.question}</CardTitle>
            {currentQuestion.description && (
              <CardDescription>{currentQuestion.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <Grid cols={1} mdCols={2} gap="md" className="mb-6">
              {currentQuestion.options?.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className={`flex items-center p-4 rounded-lg border ${
                    isOptionSelected(option.id)
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'border-border hover:bg-secondary/50'
                  } transition-colors`}
                >
                  <div className="mr-3">
                    {isOptionSelected(option.id) ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    )}
                  </div>
                  <span>{option.text}</span>
                </button>
              ))}
            </Grid>

            {currentQuestion.allowCustom && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Add a custom answer:</label>
                <Flex gap="sm">
                  <Input
                    value={customAnswer}
                    onChange={(e) => setCustomAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    fullWidth
                  />
                  <Button
                    onClick={handleAddCustom}
                    disabled={!customAnswer.trim()}
                    variant="secondary"
                  >
                    Add
                  </Button>
                </Flex>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Flex justify="between" className="w-full">
              <Button
                onClick={handleBack}
                disabled={currentStep === 0}
                variant="secondary"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                variant="primary"
              >
                {currentStep < questions.length - 1 ? 'Next' : 'Submit'}
              </Button>
            </Flex>
          </CardFooter>
        </Card>

        <div className="text-center text-sm text-muted-foreground mt-6">
          <p>Your answers help us create a personalized tech career path for you.</p>
          <p>All information is kept private and used only for generating recommendations.</p>
        </div>
      </div>
    </Container>
  );
}
