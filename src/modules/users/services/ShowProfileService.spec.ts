import AppError from '@shared/errors/AppError';

import FakesUsersRepository from '../repositories/fakes/FakesUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakesUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakesUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show the profile',async() => {
    const user = await fakeUsersRepository.create({
      name: 'john doe',
      email: 'jon@example.com',
      password: '123456',
    })

    const profile = await showProfile.execute({
      user_id: user.id,
    });


    await expect(profile.name).toBe('john doe');
    await expect(profile.email).toBe('jon@example.com');
  });

  it('should not be able to show the profile from non-existing user', async() => {
   await expect(showProfile.execute({
    user_id: 'non-existing-user-id',
  })).rejects.toBeInstanceOf(AppError);
  });
});
