import ProgressTracking from '@/components/ProgressTracking';
import SkillGapAnalyzer from '@/components/SkillGapAnalyzer';
import { Container } from '@/components/ui/Layout';

export default function ProgressPage() {
  return (
    <main className="space-y-4">
      <Container className="pt-8">
        <SkillGapAnalyzer />
      </Container>
      <ProgressTracking />
    </main>
  );
}
