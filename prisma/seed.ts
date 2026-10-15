import { PrismaClient } from '@prisma/client';

const demoSkills = [
  { name: 'Example: TypeScript', category: 'TODO: replace with actual skills' },
  { name: 'Example: React', category: 'TODO: replace with actual skills' },
  { name: 'Example: Node.js', category: 'TODO: replace with actual skills' },
];

const demoProjects = [
  {
    name: 'Example project (TODO: replace with your own)',
    description: 'Example only. TODO: describe a real project you have completed.',
    url: null,
  },
];

export async function seedProfile(prisma: PrismaClient): Promise<void> {
  await prisma.profile.upsert({
    where: { slug: 'demo-profile' },
    create: {
      slug: 'demo-profile',
      name: 'Demo profile (TODO: replace with your name)',
      description:
        'Recent college graduate and entry-level fullstack developer. No commercial experience yet.',
      links: [],
      skills: { create: demoSkills },
      experiences: { create: [] },
      projects: { create: demoProjects },
    },
    update: {
      name: 'Demo profile (TODO: replace with your name)',
      description:
        'Recent college graduate and entry-level fullstack developer. No commercial experience yet.',
      links: [],
      skills: { deleteMany: {}, create: demoSkills },
      experiences: { deleteMany: {}, create: [] },
      projects: { deleteMany: {}, create: demoProjects },
    },
  });
}

if (require.main === module) {
  const prisma = new PrismaClient();
  seedProfile(prisma)
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}
