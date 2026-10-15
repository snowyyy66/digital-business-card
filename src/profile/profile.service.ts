import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile() {
    const profile = await this.prisma.profile.findFirst({
      orderBy: { id: 'asc' },
      include: {
        skills: { orderBy: { id: 'asc' } },
        experiences: { orderBy: { id: 'asc' } },
        projects: { orderBy: { id: 'asc' } },
      },
    });

    return profile ? { ...profile, experience: profile.experiences } : null;
  }
}
