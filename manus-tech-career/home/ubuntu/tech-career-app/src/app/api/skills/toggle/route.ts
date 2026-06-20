import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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
  }
  return user;
}

export async function POST(request: Request) {
  try {
    const { skillName, acquired } = await request.json();
    if (!skillName) {
      return NextResponse.json({ message: 'Skill name is required' }, { status: 400 });
    }

    const user = await getOrCreateMockUser();

    if (acquired) {
      // Upsert user skill as acquired
      await prisma.userSkill.upsert({
        where: {
          userId_skillId: {
            userId: user.id,
            skillId: skillName,
          },
        },
        update: {
          status: 'acquired',
        },
        create: {
          userId: user.id,
          skillId: skillName,
          skillName: skillName,
          status: 'acquired',
        },
      });
    } else {
      // Delete or set to inactive
      try {
        await prisma.userSkill.delete({
          where: {
            userId_skillId: {
              userId: user.id,
              skillId: skillName,
            },
          },
        });
      } catch (e) {
        // Record might not exist, which is fine
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error toggling skill status:', error);
    return NextResponse.json({ message: 'Error toggling skill status' }, { status: 500 });
  }
}
