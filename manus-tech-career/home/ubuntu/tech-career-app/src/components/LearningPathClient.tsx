'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Container, Flex, Grid, Section, Divider } from '@/components/ui/Layout';
import { Badge, ProgressBar, Alert } from '@/components/ui/Feedback';
import { Tabs } from '@/components/ui/Navigation';
import { learningPlanGenerator } from '@/lib/learningPlanGenerator';

export default function LearningPathClient({ path }: { path: string }) {
  const careerPathId = path;
  
  // This would normally come from user profile or preferences
  const userPreferences = {
    timeCommitment: 'part-time-20' as const,
    currentSkills: ['problem_solving', 'communication', 'basic_html'],
    learningStyle: 'visual' as const,
    budget: 'low-cost' as const
  };

  // Generate learning plan based on career path and user preferences
  const learningPlan = React.useMemo(() => {
    try {
      return learningPlanGenerator.generateLearningPlan(careerPathId, userPreferences);
    } catch (error) {
      console.error('Error generating learning plan:', error);
      return null;
    }
  }, [careerPathId]);

  if (!learningPlan) {
    return (
      <Container className="py-12">
        <Alert 
          variant="error" 
          title="Learning Path Not Found"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          }
        >
          We could not find a learning path for the specified career. Please try another career path or contact support.
        </Alert>
        <div className="mt-6 text-center">
          <Button
            variant="primary"
            onClick={() => window.location.href = '/results'}
          >
            Back to Recommendations
          </Button>
        </div>
      </Container>
    );
  }

  const { learningPath, adjustedTimeframe, personalizedMilestones, recommendedStartingPoint } = learningPlan;

  return (
    <Container className="py-12">
      <Section
        title={`${learningPath.careerTitle} Learning Path`}
        description={learningPath.description}
      >
        <Card variant="elevated" className="mb-8">
          <CardHeader>
            <CardTitle>Your Personalized Learning Journey</CardTitle>
            <CardDescription>
              Based on your preferences and current skills, we have created a customized learning plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Grid cols={1} mdCols={3} gap="md" className="mb-6">
              <div className="p-4 bg-secondary/20 rounded-lg">
                <h3 className="font-medium mb-1">Estimated Duration</h3>
                <p className="text-lg">{adjustedTimeframe}</p>
                <p className="text-sm text-muted-foreground mt-1">Based on your part-time availability</p>
              </div>
              
              <div className="p-4 bg-secondary/20 rounded-lg">
                <h3 className="font-medium mb-1">Learning Style</h3>
                <p className="text-lg capitalize">{userPreferences.learningStyle}</p>
                <p className="text-sm text-muted-foreground mt-1">Resources prioritized for your style</p>
              </div>
              
              <div className="p-4 bg-secondary/20 rounded-lg">
                <h3 className="font-medium mb-1">Budget Consideration</h3>
                <p className="text-lg capitalize">{userPreferences.budget.replace('-', ' ')}</p>
                <p className="text-sm text-muted-foreground mt-1">Resources filtered to match your budget</p>
              </div>
            </Grid>
            
            <Alert 
              variant="info" 
              title="Recommended Starting Point"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
              }
            >
              {recommendedStartingPoint}
            </Alert>
          </CardContent>
        </Card>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Learning Milestones</h2>
          
          {personalizedMilestones.map((milestone, index) => (
            <Card key={milestone.id} variant="bordered" className="mb-4">
              <CardHeader>
                <Flex justify="between" align="start">
                  <div>
                    <Badge variant="success" size="sm" className="mb-2">{milestone.timeframe}</Badge>
                    <CardTitle>{milestone.title}</CardTitle>
                    <CardDescription>{milestone.description}</CardDescription>
                  </div>
                  <div className="bg-primary/10 text-primary font-bold rounded-full w-8 h-8 flex items-center justify-center">
                    {index + 1}
                  </div>
                </Flex>
              </CardHeader>
              
              <CardContent>
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Skills You&apos;ll Learn</h4>
                  <div className="flex flex-wrap gap-2">
                    {milestone.skills.map((skill, i) => (
                      <Badge key={i} variant="outline" size="sm">{skill}</Badge>
                    ))}
                  </div>
                </div>
                
                <Divider />
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Learning Resources</h4>
                  <div className="space-y-3">
                    {milestone.resources.slice(0, 3).map((resource) => (
                      <div key={resource.id} className="p-3 border border-gray-700 rounded-lg">
                        <Flex justify="between" align="start">
                          <div>
                            <h5 className="font-medium">{resource.title}</h5>
                            <p className="text-sm text-muted-foreground">{resource.provider} • {resource.duration}</p>
                          </div>
                          <Badge 
                            variant={
                              resource.cost === 'free' ? 'success' : 
                              resource.cost === 'freemium' ? 'warning' : 
                              'default'
                            }
                            size="sm"
                          >
                            {resource.cost === 'free' ? 'Free' : 
                             resource.cost === 'freemium' ? 'Freemium' : 
                             'Paid'}
                          </Badge>
                        </Flex>
                        <p className="text-sm mt-2">{resource.description}</p>
                        <div className="mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(resource.url, '_blank')}
                          >
                            Access Resource
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {milestone.projects && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">Suggested Projects</h4>
                    <div className="space-y-3">
                      {milestone.projects.map((project, i) => (
                        <div key={i} className="p-3 bg-secondary/10 rounded-lg">
                          <h5 className="font-medium">{project.title}</h5>
                          <p className="text-sm mt-1">{project.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.skills.map((skill, j) => (
                              <Badge key={j} variant="secondary" size="sm">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // This would normally open a detailed view or track progress
                    alert(`Starting milestone: ${milestone.title}`);
                  }}
                  fullWidth
                >
                  Start This Milestone
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Additional Resources</h2>
          
          <Tabs
            tabs={[
              {
                id: 'certifications',
                label: 'Recommended Certifications',
                content: (
                  <div className="p-4">
                    {learningPath.certifications ? (
                      <div className="space-y-4">
                        {learningPath.certifications.map((cert, i) => (
                          <Card key={i} variant="bordered">
                            <CardHeader>
                              <CardTitle>{cert.name}</CardTitle>
                              <CardDescription>{cert.provider}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p>{cert.description}</p>
                            </CardContent>
                            <CardFooter>
                              <Button
                                variant="outline"
                                onClick={() => window.open(cert.url, '_blank')}
                              >
                                Learn More
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No certifications available for this career path.</p>
                    )}
                  </div>
                )
              },
              {
                id: 'community',
                label: 'Community Resources',
                content: (
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {learningPath.communityResources.map((resource, i) => (
                        <Card key={i} variant="bordered">
                          <CardHeader>
                            <CardTitle>{resource.name}</CardTitle>
                            <CardDescription>{resource.type}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p>{resource.description}</p>
                          </CardContent>
                          <CardFooter>
                            <Button
                              variant="outline"
                              onClick={() => window.open(resource.url, '_blank')}
                            >
                              Visit
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                )
              }
            ]}
            variant="enclosed"
          />
        </div>
        
        <div className="text-center">
          <Button
            variant="primary"
            onClick={() => window.location.href = '/results'}
          >
            Back to Recommendations
          </Button>
        </div>
      </Section>
    </Container>
  );
}
