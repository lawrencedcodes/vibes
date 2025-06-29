'use client';

import React from 'react';
import { Container, Section } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';

export default function LearningPathPage() {
  return (
    <Container className="py-12">
      <Section
        title="Learning Path"
        description="Your personalized learning journey to become a tech professional"
      >
        <div className="text-center py-8">
          <p className="mb-4">This is a placeholder for the dynamic learning path page.</p>
          <p className="mb-8">In the full application, this page would display a personalized learning plan based on your career choice.</p>
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
