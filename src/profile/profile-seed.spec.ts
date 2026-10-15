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
      'Example: Node.js',
      'Example: React',
      'Example: TypeScript',
    ]);
    expect(profile.projects.map((project: any) => project.name)).toEqual([
      'Example project (TODO: replace with your own)',
    ]);
    expect(profile.experiences).toHaveLength(0);
    expect(profile.name).toMatch(/TODO|Demo|Example/i);
    expect(profile.description).toMatch(/recent college graduate/i);
    expect(profile.description).toMatch(/no commercial experience/i);
    expect(profile.skills.every((skill: any) => /example|todo/i.test(skill.name))).toBe(true);
    expect(profile.projects.every((project: any) => /example|todo/i.test(project.name))).toBe(true);
  });
});
