'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Container, Flex, Grid, Section } from '@/components/ui/Layout';
import { Badge, Alert } from '@/components/ui/Feedback';
import { Tabs, Accordion } from '@/components/ui/Navigation';
import { Avatar } from '@/components/ui/Feedback';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = React.useState('discussions');

  return (
    <Container className="py-12">
      <Section
        title="Tech Career Community"
        description="Connect with peers, mentors, and industry professionals to support your tech career journey"
      >
        <Tabs
          tabs={[
            {
              id: 'discussions',
              label: 'Discussions',
              content: (
                <div className="mt-6">
                  <Card variant="elevated" className="mb-8">
                    <CardHeader>
                      <CardTitle>Join the Conversation</CardTitle>
                      <CardDescription>
                        Participate in discussions with other aspiring tech professionals and industry experts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <input
                          type="text"
                          placeholder="Search discussions..."
                          className="w-full p-2 rounded-md border border-gray-700 bg-background"
                        />
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        <Badge variant="outline" size="sm">All Topics</Badge>
                        <Badge variant="success" size="sm">Web Development</Badge>
                        <Badge variant="outline" size="sm">Data Science</Badge>
                        <Badge variant="outline" size="sm">UX/UI Design</Badge>
                        <Badge variant="outline" size="sm">Cybersecurity</Badge>
                        <Badge variant="outline" size="sm">Career Advice</Badge>
                      </div>
                      
                      <div className="space-y-4">
                        {[
                          {
                            id: 1,
                            title: 'Tips for landing your first frontend developer job',
                            author: 'Sarah Johnson',
                            avatar: null,
                            date: '2 hours ago',
                            replies: 12,
                            views: 89,
                            tags: ['Career Advice', 'Web Development']
                          },
                          {
                            id: 2,
                            title: 'What resources did you use to learn React?',
                            author: 'Michael Chen',
                            avatar: null,
                            date: '1 day ago',
                            replies: 24,
                            views: 156,
                            tags: ['Web Development', 'Learning Resources']
                          },
                          {
                            id: 3,
                            title: 'How to prepare for data science interviews?',
                            author: 'Priya Patel',
                            avatar: null,
                            date: '3 days ago',
                            replies: 18,
                            views: 203,
                            tags: ['Data Science', 'Interviews']
                          }
                        ].map(discussion => (
                          <Card key={discussion.id} variant="bordered" className="hover:border-primary/30 transition-colors">
                            <CardContent className="p-4">
                              <Flex justify="between" align="start">
                                <div>
                                  <h3 className="font-medium text-lg mb-1">{discussion.title}</h3>
                                  <Flex align="center" gap="sm" className="text-sm text-muted-foreground">
                                    <Flex align="center" gap="sm">
                                      <Avatar 
                                        src={discussion.avatar} 
                                        alt={discussion.author}
                                        fallback={discussion.author.substring(0, 2)}
                                        size="xs"
                                      />
                                      <span>{discussion.author}</span>
                                    </Flex>
                                    <span>•</span>
                                    <span>{discussion.date}</span>
                                  </Flex>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  <span>{discussion.replies} replies</span>
                                  <span className="mx-2">•</span>
                                  <span>{discussion.views} views</span>
                                </div>
                              </Flex>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {discussion.tags.map(tag => (
                                  <Badge key={tag} variant="secondary" size="sm">{tag}</Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="primary" fullWidth>Start a New Discussion</Button>
                    </CardFooter>
                  </Card>
                </div>
              )
            },
            {
              id: 'mentorship',
              label: 'Mentorship',
              content: (
                <div className="mt-6">
                  <Card variant="elevated" className="mb-8">
                    <CardHeader>
                      <CardTitle>Find a Mentor</CardTitle>
                      <CardDescription>
                        Connect with experienced professionals who can guide you on your tech career journey
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Alert 
                        variant="info" 
                        title="How Mentorship Works"
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                          </svg>
                        }
                        className="mb-6"
                      >
                        Our mentorship program connects you with industry professionals who volunteer their time to help aspiring tech professionals. Mentors provide guidance, feedback, and industry insights based on their experience.
                      </Alert>
                      
                      <div className="mb-6">
                        <h3 className="font-medium mb-4">Featured Mentors</h3>
                        <Grid cols={1} mdCols={2} gap="md">
                          {[
                            {
                              id: 1,
                              name: 'David Wilson',
                              role: 'Senior Frontend Developer at TechCorp',
                              expertise: ['React', 'TypeScript', 'UI/UX'],
                              availability: 'Weekly sessions',
                              bio: 'With 8 years of experience in frontend development, I help newcomers navigate the world of modern web development.'
                            },
                            {
                              id: 2,
                              name: 'Jennifer Lee',
                              role: 'Data Scientist at DataInsights',
                              expertise: ['Python', 'Machine Learning', 'Data Visualization'],
                              availability: 'Bi-weekly sessions',
                              bio: 'Passionate about helping others break into data science. I focus on practical skills and portfolio building.'
                            }
                          ].map(mentor => (
                            <Card key={mentor.id} variant="bordered">
                              <CardContent className="p-4">
                                <Flex gap="md">
                                  <Avatar 
                                    src={null} 
                                    alt={mentor.name}
                                    fallback={mentor.name.substring(0, 2)}
                                    size="lg"
                                  />
                                  <div>
                                    <h4 className="font-medium">{mentor.name}</h4>
                                    <p className="text-sm text-muted-foreground">{mentor.role}</p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {mentor.expertise.map(skill => (
                                        <Badge key={skill} variant="outline" size="sm">{skill}</Badge>
                                      ))}
                                    </div>
                                    <p className="text-sm mt-2">{mentor.bio}</p>
                                    <p className="text-sm text-muted-foreground mt-2">Availability: {mentor.availability}</p>
                                  </div>
                                </Flex>
                              </CardContent>
                              <CardFooter>
                                <Button variant="outline" fullWidth>Request Mentorship</Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </Grid>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Flex justify="between" className="w-full">
                        <Button variant="secondary" onClick={() => window.location.href = '/mentors'}>
                          Browse All Mentors
                        </Button>
                        <Button variant="primary" onClick={() => window.location.href = '/mentorship-request'}>
                          Request a Mentor
                        </Button>
                      </Flex>
                    </CardFooter>
                  </Card>
                </div>
              )
            },
            {
              id: 'events',
              label: 'Events',
              content: (
                <div className="mt-6">
                  <Card variant="elevated" className="mb-8">
                    <CardHeader>
                      <CardTitle>Upcoming Events</CardTitle>
                      <CardDescription>
                        Join virtual and in-person events to learn new skills and network with other professionals
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            id: 1,
                            title: 'Web Development Career Panel',
                            date: 'April 15, 2025',
                            time: '6:00 PM - 7:30 PM EST',
                            format: 'Virtual',
                            description: 'Join a panel of experienced web developers as they discuss career paths, industry trends, and advice for newcomers.'
                          },
                          {
                            id: 2,
                            title: 'Introduction to Data Science Workshop',
                            date: 'April 22, 2025',
                            time: '1:00 PM - 4:00 PM EST',
                            format: 'Virtual',
                            description: 'A hands-on workshop covering the basics of data analysis with Python. Perfect for beginners interested in data science.'
                          },
                          {
                            id: 3,
                            title: 'Tech Career Networking Mixer',
                            date: 'May 5, 2025',
                            time: '7:00 PM - 9:00 PM EST',
                            format: 'In-person (New York City)',
                            description: 'Connect with other tech professionals and hiring managers in a casual networking event.'
                          }
                        ].map(event => (
                          <Card key={event.id} variant="bordered">
                            <CardContent className="p-4">
                              <Flex justify="between" align="start">
                                <div>
                                  <h3 className="font-medium text-lg">{event.title}</h3>
                                  <p className="text-muted-foreground">{event.date} • {event.time}</p>
                                  <Badge variant="secondary" size="sm" className="mt-2">{event.format}</Badge>
                                  <p className="mt-2">{event.description}</p>
                                </div>
                                <Button variant="outline" size="sm">
                                  Register
                                </Button>
                              </Flex>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="primary" fullWidth>View All Events</Button>
                    </CardFooter>
                  </Card>
                </div>
              )
            },
            {
              id: 'success-stories',
              label: 'Success Stories',
              content: (
                <div className="mt-6">
                  <Card variant="elevated" className="mb-8">
                    <CardHeader>
                      <CardTitle>Success Stories</CardTitle>
                      <CardDescription>
                        Read inspiring stories from individuals who successfully transitioned into tech careers
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {[
                          {
                            id: 1,
                            name: 'Alex Rivera',
                            previousRole: 'Retail Manager',
                            currentRole: 'Frontend Developer',
                            timeframe: '11 months',
                            quote: 'I never thought I could make the switch to tech without going back to college, but with structured learning and consistent practice, I landed my first developer role in less than a year.',
                            story: 'After 8 years in retail management, I was looking for a career with more growth potential and better work-life balance. I started learning HTM<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>