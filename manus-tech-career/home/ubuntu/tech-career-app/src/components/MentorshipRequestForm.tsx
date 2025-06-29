'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Input, Textarea, Select, Checkbox } from '@/components/ui/FormElements';
import { Container, Flex, Grid, Section } from '@/components/ui/Layout';
import { Badge, Alert } from '@/components/ui/Feedback';

export default function MentorshipRequestForm() {
  const [formData, setFormData] = React.useState({
    careerPath: '',
    experienceLevel: '',
    specificSkills: '',
    learningGoals: '',
    preferredMeetingFrequency: '',
    preferredCommunicationMethod: '',
    availability: '',
    additionalInfo: '',
    agreeToTerms: false
  });

  const [formSubmitted, setFormSubmitted] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Mentorship request submitted:', formData);
    // Here you would typically send the data to your backend
    setFormSubmitted(true);
  };

  const careerPathOptions = [
    { value: 'web-development', label: 'Web Development' },
    { value: 'data-science', label: 'Data Science & Analytics' },
    { value: 'ux-ui-design', label: 'UX/UI Design' },
    { value: 'cybersecurity', label: 'Cybersecurity' },
    { value: 'mobile-development', label: 'Mobile Development' },
    { value: 'cloud-computing', label: 'Cloud Computing' },
    { value: 'devops', label: 'DevOps & Infrastructure' },
    { value: 'ai-ml', label: 'AI & Machine Learning' },
    { value: 'game-development', label: 'Game Development' },
    { value: 'blockchain', label: 'Blockchain Development' }
  ];

  const experienceLevelOptions = [
    { value: 'beginner', label: 'Beginner (Just starting)' },
    { value: 'intermediate', label: 'Intermediate (Some experience)' },
    { value: 'advanced', label: 'Advanced (Experienced but seeking guidance)' }
  ];

  const meetingFrequencyOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'as-needed', label: 'As needed' }
  ];

  const communicationMethodOptions = [
    { value: 'video-call', label: 'Video Call' },
    { value: 'phone-call', label: 'Phone Call' },
    { value: 'chat', label: 'Chat/Messaging' },
    { value: 'email', label: 'Email' },
    { value: 'in-person', label: 'In-person (if available)' }
  ];

  if (formSubmitted) {
    return (
      <Container className="py-12">
        <div className="max-w-3xl mx-auto">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Mentorship Request Submitted</CardTitle>
              <CardDescription>
                Thank you for your interest in our mentorship program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert 
                variant="success" 
                title="Request Received"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                }
              >
                Your mentorship request has been successfully submitted. We'll review your request and match you with an appropriate mentor based on your career path and goals.
              </Alert>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">What happens next?</h3>
                <ol className="space-y-2 text-muted-foreground">
                  <li>1. Our team will review your request (typically within 2-3 business days)</li>
                  <li>2. We'll match you with a mentor who has expertise in your area of interest</li>
                  <li>3. You'll receive an email introduction to your mentor</li>
                  <li>4. You and your mentor will schedule your first meeting</li>
                </ol>
              </div>
            </CardContent>
            <CardFooter>
              <Flex justify="center" className="w-full">
                <Button
                  variant="primary"
                  onClick={() => window.location.href = '/community'}
                >
                  Return to Community
                </Button>
              </Flex>
            </CardFooter>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <div className="max-w-3xl mx-auto">
        <Section
          title="Request a Mentor"
          description="Connect with experienced professionals who can guide you on your tech career journey"
        >
          <Card variant="elevated">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Mentorship Request</CardTitle>
                <CardDescription>
                  Please provide information about your background and what you're looking for in a mentor
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Grid cols={1} mdCols={2} gap="md" className="mb-6">
                  <Select
                    label="Desired Career Path"
                    name="careerPath"
                    value={formData.careerPath}
                    onChange={handleChange}
                    options={careerPathOptions}
                    required
                    fullWidth
                  />
                  
                  <Select
                    label="Current Experience Level"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    options={experienceLevelOptions}
                    required
                    fullWidth
                  />
                </Grid>
                
                <div className="mb-6">
                  <Textarea
                    label="Specific Skills or Technologies"
                    name="specificSkills"
                    value={formData.specificSkills}
                    onChange={handleChange}
                    placeholder="List specific skills or technologies you want to learn (e.g., React, Python, UX Research)"
                    fullWidth
                  />
                </div>
                
                <div className="mb-6">
                  <Textarea
                    label="Learning Goals"
                    name="learningGoals"
                    value={formData.learningGoals}
                    onChange={handleChange}
                    placeholder="What do you hope to achieve through mentorship? Be as specific as possible."
                    required
                    fullWidth
                  />
                </div>
                
                <Grid cols={1} mdCols={2} gap="md" className="mb-6">
                  <Select
                    label="Preferred Meeting Frequency"
                    name="preferredMeetingFrequency"
                    value={formData.preferredMeetingFrequency}
                    onChange={handleChange}
                    options={meetingFrequencyOptions}
                    fullWidth
                  />
                  
                  <Select
                    label="Preferred Communication Method"
                    name="preferredCommunicationMethod"
                    value={formData.preferredCommunicationMethod}
                    onChange={handleChange}
                    options={communicationMethodOptions}
                    fullWidth
                  />
                </Grid>
                
                <div className="mb-6">
                  <Textarea
                    label="Your Availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    placeholder="Please share your general availability for mentorship sessions (days/times)"
                    fullWidth
                  />
                </div>
                
                <div className="mb-6">
                  <Textarea
                    label="Additional Information"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    placeholder="Anything else you'd like your potential mentor to know about you"
                    fullWidth
                  />
                </div>
                
                <div>
                  <Checkbox
                    label="I understand that mentors are volunteers and I commit to being respectful of their time and expertise"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleCheckboxChange}
                    required
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Flex justify="between" className="w-full">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => window.history.back()}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!formData.agreeToTerms}
                  >
                    Submit Request
                  </Button>
                </Flex>
              </CardFooter>
            </form>
          </Card>
        </Section>
      </div>
    </Container>
  );
}
