import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const jobs = [
    {
      title: 'Junior Frontend Developer',
      description: 'Join our team to build amazing web experiences using React and Next.js.',
      company: 'TechCorp Inc.',
      location: 'Remote',
      url: 'https://example.com/jobs/frontend',
    },
    {
      title: 'Data Analyst Intern',
      description: 'Analyze large datasets and help us make data-driven decisions.',
      company: 'DataFlow Systems',
      location: 'New York, NY',
      url: 'https://example.com/jobs/data-analyst',
    },
    {
      title: 'Associate UX Designer',
      description: 'Help design intuitive user interfaces for our mobile applications.',
      company: 'Creative Studios',
      location: 'San Francisco, CA',
      url: 'https://example.com/jobs/ux-designer',
    },
    {
      title: 'Cloud Support Engineer',
      description: 'Assist customers with their cloud infrastructure needs.',
      company: 'CloudNine',
      location: 'Remote',
      url: 'https://example.com/jobs/cloud-support',
    },
    {
      title: 'Software Engineer Apprentice',
      description: 'Learn and grow with our engineering team. Mentorship provided.',
      company: 'StartUp Rocket',
      location: 'Austin, TX',
      url: 'https://example.com/jobs/apprentice',
    },
  ]

  for (const job of jobs) {
    await prisma.jobPosting.create({
      data: job,
    })
  }

  console.log('Seeded database with jobs')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
