import { seedProfile } from '../../prisma/seed';

describe('seedProfile', () => {
  it('can run repeatedly without duplicating the demo profile or its relations', async () => {
    const profiles = new Map<string, any>();
    const prisma = {
      profile: {
        upsert: jest.fn(async ({ where, create, update }: any) => {
          const current = profiles.get(where.slug);
          const data = current ? update : create;
          const next = {
            ...data,
            skills: data.skills.create,
            experiences: data.experiences.create,
            projects: data.projects.create,
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
    expect(profile.skills).toHaveLength(3);
    expect(profile.projects).toHaveLength(1);
    expect(profile.experiences).toHaveLength(0);
    expect(profile.name).toMatch(/TODO|Demo|Example/i);
    expect(profile.description).toMatch(/recent college graduate/i);
    expect(profile.description).toMatch(/no commercial experience/i);
    expect(profile.skills.every((skill: any) => /example|todo/i.test(skill.name))).toBe(true);
    expect(profile.projects.every((project: any) => /example|todo/i.test(project.name))).toBe(true);
  });
});
