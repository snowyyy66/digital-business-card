import { ProfileService } from './profile.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProfileService', () => {
  const profile = {
    id: 'profile-1',
    slug: 'demo',
    name: 'Demo Developer',
    description: 'A recent graduate',
    links: [],
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    skills: [{ id: 'skill-1', name: 'TypeScript', category: null, level: null, profileId: 'profile-1' }],
    experiences: [],
    projects: [{ id: 'project-1', name: 'Demo project', description: 'Example', url: null, profileId: 'profile-1' }],
  };

  it('loads the complete profile graph in one ordered Prisma query', async () => {
    const findFirst = jest.fn().mockResolvedValue(profile);
    const service = new ProfileService({ profile: { findFirst } } as unknown as PrismaService);

    await expect(service.getProfile()).resolves.toEqual({
      ...profile,
      experience: profile.experiences,
    });
    expect(findFirst).toHaveBeenCalledTimes(1);
    expect(findFirst).toHaveBeenCalledWith({
      orderBy: { id: 'asc' },
      include: {
        skills: { orderBy: { id: 'asc' } },
        experiences: { orderBy: { id: 'asc' } },
        projects: { orderBy: { id: 'asc' } },
      },
    });
  });

  it('returns null when no profile exists', async () => {
    const findFirst = jest.fn().mockResolvedValue(null);
    const service = new ProfileService({ profile: { findFirst } } as unknown as PrismaService);

    await expect(service.getProfile()).resolves.toBeNull();
    expect(findFirst).toHaveBeenCalledTimes(1);
  });
});
