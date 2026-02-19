import LearningPathClient from '@/components/LearningPathClient';

export default function LearningPathPage({ params }: { params: { path: string } }) {
  return (
    <main>
      <LearningPathClient path={params.path} />
    </main>
  );
}
