import { ProfileService } from './profile.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProfileService', () => {
  const profile = {
    name: 'Demo Developer',
    description: 'A recent graduate',
    links: [],
    skills: [{ name: 'TypeScript', category: null, level: null }],
    experiences: [],
    projects: [{ name: 'Demo project', description: 'Example', url: null }],
  };

  it('loads only GraphQL fields in one ordered Prisma query', async () => {
    const findFirst = jest.fn().mockResolvedValue(profile);
    const service = new ProfileService({ profile: { findFirst } } as unknown as PrismaService);

    await expect(service.getProfile()).resolves.toEqual({
      name: profile.name,
      description: profile.description,
      links: profile.links,
      skills: profile.skills,
      experience: profile.experiences,
      projects: profile.projects,
    });
    expect(findFirst).toHaveBeenCalledTimes(1);
    expect(findFirst).toHaveBeenCalledWith({
      orderBy: { id: 'asc' },
      select: {
        name: true,
        description: true,
        links: true,
        skills: {
          orderBy: { id: 'asc' },
          select: { name: true, category: true, level: true },
        },
        experiences: {
          orderBy: { id: 'asc' },
          select: { company: true, position: true, period: true, achievements: true },
        },
        projects: {
          orderBy: { id: 'asc' },
          select: { name: true, description: true, url: true },
        },
      },
    });
  });

  it('returns null when no profile exists', async () => {
    const findFirst = jest.fn().mockResolvedValue(null);
    const service = new ProfileService({ profile: { findFirst } } as unknown as PrismaService);

    await expect(service.getProfile()).resolves.toBeNull();
    expect(findFirst).toHaveBeenCalledTimes(1);
  });

  it('reuses the in-memory profile cache on repeated requests', async () => {
    const findFirst = jest.fn().mockResolvedValue(profile);
    const service = new ProfileService({ profile: { findFirst } } as unknown as PrismaService);

    await service.getProfile();
    await service.getProfile();

    expect(findFirst).toHaveBeenCalledTimes(1);
  });
});
