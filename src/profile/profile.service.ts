import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const PROFILE_CACHE_TTL_MS = 5 * 60 * 1000;

type ProfileData = {
  name: string;
  description: string;
  links: string[];
  skills: { name: string; category: string | null; level: string | null }[];
  experience: {
    company: string;
    position: string;
    period: string;
    achievements: string[];
  }[];
  projects: { name: string; description: string; url: string | null }[];
};

@Injectable()
export class ProfileService {
  private cachedProfile: ProfileData | null | undefined;
  private cacheExpiresAt = 0;
  private profileLoad?: Promise<ProfileData | null>;

  constructor(private readonly prisma: PrismaService) {}

  async getProfile(): Promise<ProfileData | null> {
    if (this.cacheExpiresAt > Date.now() && this.cachedProfile !== undefined) {
      return this.cachedProfile;
    }

    if (!this.profileLoad) {
      this.profileLoad = this.loadProfile();
    }

    try {
      const profile = await this.profileLoad;
      this.cachedProfile = profile;
      this.cacheExpiresAt = Date.now() + PROFILE_CACHE_TTL_MS;
      return profile;
    } finally {
      this.profileLoad = undefined;
    }
  }

  private async loadProfile(): Promise<ProfileData | null> {
    const profile = await this.prisma.profile.findFirst({
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

    if (!profile) return null;

    return {
      name: profile.name,
      description: profile.description,
      links: profile.links,
      skills: profile.skills,
      experience: profile.experiences,
      projects: profile.projects,
    };
  }
}
