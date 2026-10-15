import { seedProfile } from '../../prisma/seed';

describe('seedProfile', () => {
  it('can run repeatedly without duplicating the demo profile or its relations', async () => {
    const profiles = new Map<string, any>();
    const applyRelation = (existing: any[] = [], operation: any) => {
      let rows = [...existing];
      if (operation.deleteMany !== undefined) {
        rows = operation.deleteMany && Object.keys(operation.deleteMany).length > 0
          ? rows.filter((row) => !Object.entries(operation.deleteMany).every(([key, value]) => row[key] === value))
          : [];
      }
      return rows.concat(operation.create ?? []);
    };

    const prisma = {
      profile: {
        upsert: jest.fn(async ({ where, create, update }: any) => {
          const current = profiles.get(where.slug);
          const data = current ? update : create;
          const next = {
            ...current,
            ...data,
            skills: applyRelation(current?.skills, data.skills),
            experiences: applyRelation(current?.experiences, data.experiences),
            projects: applyRelation(current?.projects, data.projects),
          };
          profiles.set(where.slug, next);
          return next;
        }),
      },
    };

    await seedProfile(prisma as any);
    await seedProfile(prisma as any);

    expect(profiles.size).toBe(1);
    const [profile] = [...profiles.values()];
    expect(profile.skills.map((skill: any) => skill.name).sort()).toEqual([
      'ASP.NET Core MVC',
      'C#',
      'Docker',
      'Express',
      'GraphQL',
      'JavaScript',
      'MySQL',
      'NestJS',
      'Node.js',
      'PostgreSQL',
      'Prisma ORM',
      'REST API',
      'React',
      'SQLite',
      'Tailwind CSS',
      'TypeScript',
      'Vite',
    ]);
    expect(
      profile.projects
        .map((project: any) => [project.name, project.url])
        .sort(([left]: string[], [right]: string[]) => left.localeCompare(right)),
    ).toEqual([
      ['DB Manager', 'https://github.com/snowyyy66/praktika2'],
      ['Look Restaurant', 'https://github.com/snowyyy66/deplom'],
      ['WIWANG Marketplace', 'https://github.com/snowyyy66/praktikaz'],
    ]);
    expect(profile.experiences).toHaveLength(0);
    expect(profile.name).toBe('Вадим');
    expect(profile.description).toMatch(/выпускник колледжа/i);
    expect(profile.description).not.toMatch(/практик|стажир/i);
    expect(profile.links).toEqual(['https://github.com/snowyyy66']);
    expect(profile.skills.every((skill: any) => !/example|todo|практик|стажир/i.test(skill.name))).toBe(true);
    expect(profile.projects.every((project: any) => !/example|todo|практик|стажир/i.test(project.name + project.description))).toBe(true);
  });
});
