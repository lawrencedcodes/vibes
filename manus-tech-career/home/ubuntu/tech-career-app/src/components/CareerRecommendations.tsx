'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Container, Flex, Grid, Section } from '@/components/ui/Layout';
import { Badge, ProgressBar } from '@/components/ui/Feedback';
import { recommendationEngine } from '@/lib/recommendationEngine';

export default function CareerRecommendationsPage() {
  // This would normally come from the assessment form submission
  const sampleAssessment = {
    interests: ['web_dev', 'ux_ui', 'mobile_dev'],
    skills: ['problem_solving', 'creativity', 'attention_detail'],
    challenges: ['technical_concepts', 'practical_experience'],
    workStyles: ['remote', 'collaborative', 'flexible'],
    techAccess: ['laptop', 'high_speed_internet']
  };

  // Generate recommendations based on the sample assessment
  const recommendations = recommendationEngine.generateRecommendations(sampleAssessment);

  return (
    <Container className="py-12">
      <Section
        title="Your Career Recommendations"
        description="Based on your assessment, here are the tech careers that best match your interests, skills, and preferences"
      >
        <div className="mb-8">
          <Card variant="elevated" className="p-6 bg-primary/5 border-primary/20">
            <Flex align="center" gap="md">
              <div className="rounded-full bg-primary/20 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium">Your Top Match: {recommendations[0].career.title}</h3>
                <p className="text-muted-foreground">{recommendations[0].matchPercentage}% match with your profile</p>
              </div>
            </Flex>
          </Card>
        </div>

        <Grid cols={1} gap="lg" className="mb-12">
          {recommendations.slice(0, 5).map((recommendation, index) => (
            <Card key={recommendation.career.id} variant={index === 0 ? 'elevated' : 'bordered'} className={index === 0 ? 'border-primary/20' : ''}>
              <CardHeader>
                <Flex justify="between" align="start">
                  <div>
                    <CardTitle>{recommendation.career.title}</CardTitle>
                    <CardDescription>{recommendation.career.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{recommendation.matchPercentage}%</div>
                    <div className="text-sm text-muted-foreground">Match</div>
                  </div>
                </Flex>
              </CardHeader>
              
              <CardContent>
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">Why This Matches You</h4>
                  <ul className="space-y-2">
                    {recommendation.matchReasons.map((reason, i) => (
                      <li key={i} className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Grid cols={2} gap="md" className="mb-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Salary Range</h4>
                    <p className="text-lg font-semibold">
                      {recommendation.career.salary.currency}{recommendation.career.salary.min.toLocaleString()} - {recommendation.career.salary.currency}{recommendation.career.salary.max.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Market Demand</h4>
                    <Badge 
                      variant={
                        recommendation.career.demandLevel === 'High' ? 'success' : 
                        recommendation.career.demandLevel === 'Medium' ? 'warning' : 
                        'default'
                      }
                      size="md"
                    >
                      {recommendation.career.demandLevel} Demand
                    </Badge>
                  </div>
                </Grid>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.career.requiredSkills.map((skill, i) => (
                      <Badge key={i} variant="outline" size="sm">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Flex justify="between" className="w-full">
                  <Button
                    variant="secondary"
                    onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(recommendation.career.title + ' career information')}`, '_blank')}
                  >
                    Learn More
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => window.location.href = `/learning-path/${recommendation.career.id}`}
                  >
                    View Learning Path
                  </Button>
                </Flex>
              </CardFooter>
            </Card>
          ))}
        </Grid>
        
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            These recommendations are based on your assessment responses and are designed to help guide your tech career journey.
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/assessment'}
          >
            Retake Assessment
          </Button>
        </div>
      </Section>
    </Container>
  );
}
