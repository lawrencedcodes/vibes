'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Input, Textarea, Select, Checkbox } from '@/components/ui/FormElements';
import { Container, Flex, Grid, Section } from '@/components/ui/Layout';
import { Badge, Alert } from '@/components/ui/Feedback';

export default function FeedbackForm() {
  const [formData, setFormData] = React.useState({
    feedbackType: '',
    rating: '',
    title: '',
    details: '',
    improvements: '',
    email: '',
    allowContact: false
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
    console.log('Feedback submitted:', formData);
    // Here you would typically send the data to your backend
    setFormSubmitted(true);
  };

  const feedbackTypeOptions = [
    { value: 'general', label: 'General Feedback' },
    { value: 'assessment', label: 'Assessment Tool' },
    { value: 'career-recommendations', label: 'Career Recommendations' },
    { value: 'learning-path', label: 'Learning Path' },
    { value: 'community', label: 'Community Features' },
    { value: 'mentorship', label: 'Mentorship Program' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' }
  ];

  const ratingOptions = [
    { value: '5', label: 'Excellent (5/5)' },
    { value: '4', label: 'Good (4/5)' },
    { value: '3', label: 'Average (3/5)' },
    { value: '2', label: 'Below Average (2/5)' },
    { value: '1', label: 'Poor (1/5)' }
  ];

  if (formSubmitted) {
    return (
      <Container className="py-12">
        <div className="max-w-3xl mx-auto">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Feedback Submitted</CardTitle>
              <CardDescription>
                Thank you for helping us improve
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert 
                variant="success" 
                title="Feedback Received"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                }
              >
                Your feedback has been successfully submitted. We appreciate your input and will use it to improve our platform.
              </Alert>
              
              {formData.allowContact && (
                <div className="mt-4 text-muted-foreground">
                  We'll contact you at {formData.email} if we need additional information.
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Flex justify="center" className="w-full">
                <Button
                  variant="primary"
                  onClick={() => window.location.href = '/'}
                >
                  Return to Home
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
          title="Share Your Feedback"
          description="Help us improve our platform by sharing your thoughts and suggestions"
        >
          <Card variant="elevated">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Feedback Form</CardTitle>
                <CardDescription>
                  Your feedback is valuable to us and helps us enhance the user experience
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Grid cols={1} mdCols={2} gap="md" className="mb-6">
                  <Select
                    label="Feedback Type"
                    name="feedbackType"
                    value={formData.feedbackType}
                    onChange={handleChange}
                    options={feedbackTypeOptions}
                    required
                    fullWidth
                  />
                  
                  <Select
                    label="Overall Rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    options={ratingOptions}
                    required
                    fullWidth
                  />
                </Grid>
                
                <div className="mb-6">
                  <Input
                    label="Feedback Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Brief summary of your feedback"
                    required
                    fullWidth
                  />
                </div>
                
                <div className="mb-6">
                  <Textarea
                    label="Feedback Details"
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    placeholder="Please provide detailed information about your experience or suggestion"
                    required
                    fullWidth
                  />
                </div>
                
                <div className="mb-6">
                  <Textarea
                    label="Suggested Improvements"
                    name="improvements"
                    value={formData.improvements}
                    onChange={handleChange}
                    placeholder="How do you think we could improve this aspect of our platform?"
                    fullWidth
                  />
                </div>
                
                <Grid cols={1} mdCols={2} gap="md" className="mb-6">
                  <Input
                    label="Email (Optional)"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email address"
                    helperText="We'll only use this to follow up on your feedback if needed"
                    fullWidth
                  />
                  
                  <div className="flex items-end h-full pb-6">
                    <Checkbox
                      label="You may contact me about this feedback"
                      name="allowContact"
                      checked={formData.allowContact}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                </Grid>
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
                  >
                    Submit Feedback
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
