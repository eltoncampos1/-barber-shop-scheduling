import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakesUsersRepository from '../repositories/fakes/FakesUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakesUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakesUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(fakeUsersRepository,fakeHashProvider);
  });

  it('should be able to update the profile',async() => {
    const user = await fakeUsersRepository.create({
      name: 'john doe',
      email: 'jon@example.com',
      password: '123456',
    })

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'jhon II',
      email: 'jhon2@example.com',
    });


    await expect(updatedUser.name).toBe('jhon II');
    await expect(updatedUser.email).toBe('jhon2@example.com');
  });

  it('should not be able to update the profile from non-existing user', async() => {
    await expect(updateProfile.execute({
     user_id: 'non-existing-user-id',
     name: 'test',
     email: 'test@test.com'
   })).rejects.toBeInstanceOf(AppError);
   });

  it('should not be able to change to another user email', async() => {
    await fakeUsersRepository.create({
      name: 'john doe',
      email: 'jon@example.com',
      password: '123456',
    })

    const user = await fakeUsersRepository.create({
      name: 'test',
      email: 'test@example.com',
      password: '123456',
    })

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'john doe',
      email: 'jon@example.com',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password',async() => {
    const user = await fakeUsersRepository.create({
      name: 'john doe',
      email: 'jon@example.com',
      password: '123456',
    })

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'jhon II',
      email: 'jhon2@example.com',
      old_password: '123456',
      password: '123123',
    });


    await expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password wihtout old password',async() => {
    const user = await fakeUsersRepository.create({
      name: 'john doe',
      email: 'jon@example.com',
      password: '123456',
    })

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'jhon II',
      email: 'jhon2@example.com',
      password: '123123',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password',async() => {
    const user = await fakeUsersRepository.create({
      name: 'john doe',
      email: 'jon@example.com',
      password: '123456',
    })

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'jhon II',
      email: 'jhon2@example.com',
      old_password: 'wrong-old-password',
      password: '123123',
    })).rejects.toBeInstanceOf(AppError);
  });

});
