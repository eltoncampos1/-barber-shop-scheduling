import AppError from '@shared/errors/AppError';

import FakeStorageprovider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakesUsersRepository from '../repositories/fakes/FakesUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  it('should be able to update avatar',async() => {
    const fakeUsersRepository = new FakesUsersRepository();
    const fakeStorageProvider = new FakeStorageprovider();

    const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository,fakeStorageProvider);

    const user = await fakeUsersRepository.create({
      name: 'john doe',
      email: 'jon@example.com',
      password: '123456',
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg'
    });


    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to create a new avatar from a non-existing user',async() => {
    const fakeUsersRepository = new FakesUsersRepository();
    const fakeStorageProvider = new FakeStorageprovider();

    const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository,fakeStorageProvider);


    await expect(updateUserAvatar.execute({
      user_id: 'non-existing-user',
      avatarFileName: 'avatar.jpg'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should delete avatar when update new one',async() => {
    const fakeUsersRepository = new FakesUsersRepository();
    const fakeStorageProvider = new FakeStorageprovider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile')

    const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository,fakeStorageProvider);

    const user = await fakeUsersRepository.create({
      name: 'john doe',
      email: 'jon@example.com',
      password: '123456',
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg'
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar2.jpg'
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
