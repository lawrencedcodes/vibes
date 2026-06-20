import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { SkillGapAnalyzer } from '@/lib/skillGapAnalyzer';
import { CareerRecommendationEngine } from '@/lib/recommendationEngine';

const prisma = new PrismaClient();

async function getOrCreateMockUser() {
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: 'mock-user-id',
        name: 'Alex Developer',
        email: 'alex@example.com',
      },
    });
    
    // Seed some initial skills
    await prisma.userSkill.createMany({
      data: [
        { userId: user.id, skillId: 'HTML', skillName: 'HTML', status: 'acquired' },
        { userId: user.id, skillId: 'CSS', skillName: 'CSS', status: 'acquired' },
      ],
    });
  }
  return user;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const careerId = searchParams.get('careerId') || 'frontend_developer';

    const user = await getOrCreateMockUser();

    // Get user skills from DB
    const userSkillsDb = await prisma.userSkill.findMany({
      where: {
        userId: user.id,
        status: 'acquired',
      },
    });
    const acquiredSkillNames = userSkillsDb.map(us => us.skillName);

    // Get the career path
    const engine = new CareerRecommendationEngine();
    const careers = engine.getCareerPaths();
    const career = careers.find(c => c.id === careerId);

    if (!career) {
      return NextResponse.json({ message: 'Career path not found' }, { status: 404 });
    }

    const analysis = SkillGapAnalyzer.analyze(career.requiredSkills, acquiredSkillNames);

    return NextResponse.json({
      careerId: career.id,
      careerTitle: career.title,
      acquired: analysis.acquired,
      missing: analysis.missing,
      microResources: analysis.resources,
    });
  } catch (error) {
    console.error('Error generating gap analysis:', error);
    return NextResponse.json({ message: 'Error generating gap analysis' }, { status: 500 });
  }
}
