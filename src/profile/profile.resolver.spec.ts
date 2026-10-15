import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';

describe('ProfileResolver', () => {
  it('delegates the profile query to the service and returns its result', async () => {
    const profile = { id: 'profile-1', name: 'Demo Developer' };
    const getProfile = jest.fn().mockResolvedValue(profile);
    const resolver = new ProfileResolver({ getProfile } as unknown as ProfileService);

    await expect(resolver.profile()).resolves.toBe(profile);
    expect(getProfile).toHaveBeenCalledTimes(1);
  });
});
