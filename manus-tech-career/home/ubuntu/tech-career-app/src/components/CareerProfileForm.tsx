'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Input, Textarea, Select, Checkbox } from '@/components/ui/FormElements';
import { Container, Flex, Grid, Section } from '@/components/ui/Layout';
import { Badge } from '@/components/ui/Feedback';

export default function CareerProfileForm() {
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    currentRole: '',
    yearsExperience: '',
    education: '',
    desiredSalary: '',
    location: '',
    relocate: false,
    remoteWork: false,
    goals: '',
    timeCommitment: '',
    additionalInfo: ''
  });

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
    console.log('Profile data submitted:', formData);
    // Here you would typically send the data to your backend
    alert('Profile updated successfully!');
  };

  const experienceOptions = [
    { value: 'none', label: 'No experience' },
    { value: 'less-than-1', label: 'Less than 1 year' },
    { value: '1-3', label: '1-3 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5-plus', label: '5+ years' }
  ];

  const educationOptions = [
    { value: 'high-school', label: 'High School' },
    { value: 'some-college', label: 'Some College' },
    { value: 'associate', label: 'Associate Degree' },
    { value: 'bachelor', label: 'Bachelor\'s Degree' },
    { value: 'master', label: 'Master\'s Degree' },
    { value: 'phd', label: 'PhD or Doctorate' },
    { value: 'bootcamp', label: 'Coding Bootcamp' },
    { value: 'self-taught', label: 'Self-taught' }
  ];

  const timeCommitmentOptions = [
    { value: 'full-time', label: 'Full-time (40+ hours/week)' },
    { value: 'part-time-20', label: 'Part-time (20-30 hours/week)' },
    { value: 'part-time-10', label: 'Part-time (10-20 hours/week)' },
    { value: 'few-hours', label: 'A few hours per week' },
    { value: 'weekends', label: 'Weekends only' }
  ];

  return (
    <Container className="py-12">
      <div className="max-w-3xl mx-auto">
        <Section
          title="Career Profile"
          description="Complete your profile to help us personalize your tech career guidance"
        >
          <Card variant="elevated">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Tell us about yourself so we can tailor our recommendations to your situation
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Grid cols={1} mdCols={2} gap="md" className="mb-6">
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    fullWidth
                  />
                  
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    fullWidth
                  />
                </Grid>
                
                <Grid cols={1} mdCols={2} gap="md" className="mb-6">
                  <Input
                    label="Current Role/Occupation"
                    name="currentRole"
                    value={formData.currentRole}
                    onChange={handleChange}
                    placeholder="E.g., Teacher, Marketing Manager, Student"
                    fullWidth
                  />
                  
                  <Select
                    label="Years of Experience in Current Role"
                    name="yearsExperience"
                    value={formData.yearsExperience}
                    onChange={handleChange}
                    options={experienceOptions}
                    fullWidth
                  />
                </Grid>
                
                <Grid cols={1} mdCols={2} gap="md" className="mb-6">
                  <Select
                    label="Highest Level of Education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    options={educationOptions}
                    fullWidth
                  />
                  
                  <Input
                    label="Desired Salary Range"
                    name="desiredSalary"
                    value={formData.desiredSalary}
                    onChange={handleChange}
                    placeholder="E.g., $60,000 - $80,000"
                    fullWidth
                  />
                </Grid>
                
                <Grid cols={1} mdCols={2} gap="md" className="mb-6">
                  <Input
                    label="Current Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State/Province, Country"
                    fullWidth
                  />
                  
                  <div className="flex flex-col justify-end h-full">
                    <Checkbox
                      label="I'm willing to relocate for the right opportunity"
                      name="relocate"
                      checked={formData.relocate}
                      onChange={handleCheckboxChange}
                    />
                    
                    <div className="mt-2">
                      <Checkbox
                        label="I'm interested in remote work opportunities"
                        name="remoteWork"
                        checked={formData.remoteWork}
                        onChange={handleCheckboxChange}
                      />
                    </div>
                  </div>
                </Grid>
                
                <div className="mb-6">
                  <Textarea
                    label="Career Goals"
                    name="goals"
                    value={formData.goals}
                    onChange={handleChange}
                    placeholder="Describe your short and long-term career goals in tech"
                    fullWidth
                  />
                </div>
                
                <div className="mb-6">
                  <Select
                    label="Time Commitment for Learning"
                    name="timeCommitment"
                    value={formData.timeCommitment}
                    onChange={handleChange}
                    options={timeCommitmentOptions}
                    helperText="How much time can you dedicate to learning each week?"
                    fullWidth
                  />
                </div>
                
                <div>
                  <Textarea
                    label="Additional Information"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    placeholder="Any other information you'd like us to know about your background, interests, or constraints"
                    fullWidth
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
                  >
                    Save Profile
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
