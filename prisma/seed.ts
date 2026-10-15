import { PrismaClient } from '@prisma/client';

const profileSkills = [
  { name: 'TypeScript', category: 'Language' },
  { name: 'JavaScript', category: 'Language' },
  { name: 'C#', category: 'Language' },
  { name: 'React', category: 'Frontend' },
  { name: 'Vite', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'NestJS', category: 'Backend' },
  { name: 'Express', category: 'Backend' },
  { name: 'ASP.NET Core MVC', category: 'Backend' },
  { name: 'GraphQL', category: 'API' },
  { name: 'REST API', category: 'API' },
  { name: 'Prisma ORM', category: 'Database' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'SQLite', category: 'Database' },
  { name: 'MySQL', category: 'Database' },
  { name: 'Docker', category: 'Tools' },
];

const profileProjects = [
  {
    name: 'Look Restaurant',
    description:
      'Fullstack-веб-приложение для ресторана с меню, заказами, бронированием и административной панелью.',
    url: 'https://github.com/snowyyy66/deplom',
  },
  {
    name: 'WIWANG Marketplace',
    description:
      'Веб-прототип маркетплейса подержанных вещей с категориями объявлений и подробными карточками товаров.',
    url: 'https://github.com/snowyyy66/praktikaz',
  },
  {
    name: 'DB Manager',
    description:
      'Веб-интерфейс для управления MySQL: просмотр баз, таблиц и данных, CRUD-операции и SQL-редактор.',
    url: 'https://github.com/snowyyy66/praktika2',
  },
];

export async function seedProfile(prisma: PrismaClient): Promise<void> {
  await prisma.profile.upsert({
    where: { slug: 'demo-profile' },
    create: {
      slug: 'demo-profile',
      name: 'Вадим',
      description:
        'Выпускник колледжа и начинающий fullstack-разработчик. Развиваюсь, создавая веб-приложения и осваивая новые технологии.',
      links: ['https://github.com/snowyyy66'],
      skills: { create: profileSkills },
      experiences: { create: [] },
      projects: { create: profileProjects },
    },
    update: {
      name: 'Вадим',
      description:
        'Выпускник колледжа и начинающий fullstack-разработчик. Развиваюсь, создавая веб-приложения и осваивая новые технологии.',
      links: ['https://github.com/snowyyy66'],
      skills: { deleteMany: {}, create: profileSkills },
      experiences: { deleteMany: {}, create: [] },
      projects: { deleteMany: {}, create: profileProjects },
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
