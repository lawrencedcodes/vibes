'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Container, Flex, Grid, Section } from '@/components/ui/Layout';
import { ProgressBar, Badge } from '@/components/ui/Feedback';
import { Tabs } from '@/components/ui/Navigation';

export default function ProgressTrackingPage() {
  const [activeTab, setActiveTab] = React.useState('overview');

  // Sample user progress data - in a real app, this would come from a database
  const userProgress = {
    careerPath: 'Frontend Developer',
    overallProgress: 35,
    startDate: 'January 15, 2025',
    estimatedCompletion: 'December 20, 2025',
    milestones: [
      {
        id: 'fd_milestone_1',
        title: 'Web Development Fundamentals',
        progress: 85,
        status: 'in-progress',
        tasks: [
          { id: 'task_1', title: 'Learn HTML Basics', completed: true },
          { id: 'task_2', title: 'Learn CSS Fundamentals', completed: true },
          { id: 'task_3', title: 'JavaScript Introduction', completed: false },
          { id: 'task_4', title: 'Build Personal Portfolio', completed: false },
        ]
      },
      {
        id: 'fd_milestone_2',
        title: 'Interactive Web Development',
        progress: 10,
        status: 'in-progress',
        tasks: [
          { id: 'task_5', title: 'DOM Manipulation', completed: true },
          { id: 'task_6', title: 'ES6 Features', completed: false },
          { id: 'task_7', title: 'Working with Web APIs', completed: false },
          { id: 'task_8', title: 'Build Interactive Web App', completed: false },
        ]
      },
      {
        id: 'fd_milestone_3',
        title: 'Frontend Frameworks',
        progress: 0,
        status: 'not-started',
        tasks: [
          { id: 'task_9', title: 'React Fundamentals', completed: false },
          { id: 'task_10', title: 'State Management', completed: false },
          { id: 'task_11', title: 'Component Architecture', completed: false },
          { id: 'task_12', title: 'Build React Application', completed: false },
        ]
      }
    ],
    skills: [
      { name: 'HTML', level: 'Intermediate', progress: 70 },
      { name: 'CSS', level: 'Intermediate', progress: 65 },
      { name: 'JavaScript', level: 'Beginner', progress: 40 },
      { name: 'React', level: 'Not Started', progress: 0 },
      { name: 'Git', level: 'Beginner', progress: 30 },
    ],
    recentActivity: [
      { date: 'March 24, 2025', action: 'Completed CSS Fundamentals course', type: 'course' },
      { date: 'March 22, 2025', action: 'Started JavaScript Introduction', type: 'course' },
      { date: 'March 20, 2025', action: 'Updated portfolio with HTML project', type: 'project' },
      { date: 'March 18, 2025', action: 'Joined Web Development community discussion', type: 'community' },
    ]
  };

  return (
    <Container className="py-12">
      <Section
        title="Your Learning Progress"
        description="Track your journey to becoming a Frontend Developer"
      >
        <Card variant="elevated" className="mb-8">
          <CardContent className="p-6">
            <Grid cols={1} mdCols={3} gap="md" className="mb-6">
              <div className="p-4 bg-secondary/20 rounded-lg">
                <h3 className="font-medium mb-1">Overall Progress</h3>
                <div className="mb-2">
                  <ProgressBar value={userProgress.overallProgress} showLabel />
                </div>
                <p className="text-sm text-muted-foreground">You're making steady progress!</p>
              </div>
              
              <div className="p-4 bg-secondary/20 rounded-lg">
                <h3 className="font-medium mb-1">Started On</h3>
                <p className="text-lg">{userProgress.startDate}</p>
                <p className="text-sm text-muted-foreground">2 months ago</p>
              </div>
              
              <div className="p-4 bg-secondary/20 rounded-lg">
                <h3 className="font-medium mb-1">Estimated Completion</h3>
                <p className="text-lg">{userProgress.estimatedCompletion}</p>
                <p className="text-sm text-muted-foreground">Based on your current pace</p>
              </div>
            </Grid>
            
            <div>
              <h3 className="font-medium mb-3">Current Focus</h3>
              <Card variant="bordered" className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <Flex justify="between" align="start">
                    <div>
                      <h4 className="font-medium">{userProgress.milestones[0].title}</h4>
                      <p className="text-sm text-muted-foreground">Milestone 1 of 6</p>
                    </div>
                    <Badge variant="success" size="sm">In Progress</Badge>
                  </Flex>
                  <div className="mt-3">
                    <ProgressBar value={userProgress.milestones[0].progress} showLabel color="primary" />
                  </div>
                  <div className="mt-4">
                    <Button variant="primary" size="sm">Continue Learning</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        
        <Tabs
          tabs={[
            {
              id: 'overview',
              label: 'Overview',
              content: (
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-4">Learning Path Progress</h3>
                  <div className="space-y-6">
                    {userProgress.milestones.map((milestone, index) => (
                      <Card key={milestone.id} variant="bordered">
                        <CardContent className="p-4">
                          <Flex justify="between" align="start" className="mb-2">
                            <div>
                              <Badge 
                                variant={
                                  milestone.status === 'completed' ? 'success' : 
                                  milestone.status === 'in-progress' ? 'warning' : 
                                  'outline'
                                } 
                                size="sm"
                                className="mb-2"
                              >
                                {milestone.status === 'completed' ? 'Completed' : 
                                 milestone.status === 'in-progress' ? 'In Progress' : 
                                 'Not Started'}
                              </Badge>
                              <h4 className="font-medium">Milestone {index + 1}: {milestone.title}</h4>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold">{milestone.progress}%</div>
                              <div className="text-sm text-muted-foreground">Complete</div>
                            </div>
                          </Flex>
                          <div className="mb-4">
                            <ProgressBar 
                              value={milestone.progress} 
                              color={
                                milestone.status === 'completed' ? 'success' : 
                                milestone.status === 'in-progress' ? 'primary' : 
                                'secondary'
                              } 
                            />
                          </div>
                          <div className="space-y-2">
                            {milestone.tasks.map(task => (
                              <div key={task.id} className="flex items-center">
                                <div className={`w-5 h-5 rounded-full border ${task.completed ? 'bg-primary border-primary' : 'border-muted-foreground'} flex items-center justify-center mr-3`}>
                                  {task.completed && (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 text-primary-foreground">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                  )}
                                </div>
                                <span className={task.completed ? 'line-through text-muted-foreground' : ''}>{task.title}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            },
            {
              id: 'skills',
              label: 'Skills',
              content: (
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-4">Skills Development</h3>
                  <div className="space-y-6">
                    {userProgress.skills.map(skill => (
                      <div key={skill.name} className="mb-6">
                        <Flex justify="between" align="center" className="mb-2">
                          <div>
                            <h4 className="font-medium">{skill.name}</h4>
                            <p className="text-sm text-muted-foreground">{skill.level}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{skill.progress}%</div>
                          </div>
                        </Flex>
                        <ProgressBar 
                          value={skill.progress} 
                          color={
                            skill.progress >= 80 ? 'success' : 
                            skill.progress >= 40 ? 'primary' : 
                            'secondary'
                          } 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            },
            {
              id: 'activity',
              label: 'Recent Activity',
              content: (
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-4">Your Learning Activity</h3>
                  <div className="space-y-4">
                    {userProgress.recentActivity.map((activity, index) => (
                      <Card key={index} variant="bordered">
                        <CardContent className="p-4">
                          <Flex justify="between" align="center">
                            <div>
                              <p className="font-medium">{activity.action}</p>
                              <p className="text-sm text-muted-foreground">{activity.date}</p>
                            </div>
                            <Badge 
                              variant={
                                activity.type === 'course' ? 'warning' : 
                                activity.type === 'project' ? 'success' : 
                                'default'
                              } 
                              size="sm"
                            >
                              {activity.type === 'course' ? 'Course' : 
                               activity.type === 'project' ? 'Project' : 
                               'Community'}
                            </Badge>
                          </Flex>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            }
          ]}
          defaultTab="overview"
          variant="enclosed"
          onChange={setActiveTab}
        />
      </Section>
    </Container>
  );
}
