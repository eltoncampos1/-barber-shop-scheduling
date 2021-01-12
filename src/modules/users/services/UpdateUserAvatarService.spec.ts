import AppError from '@shared/errors/AppError';

import FakeStorageprovider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakesUsersRepository from '../repositories/fakes/FakesUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakesUsersRepository;
let fakeStorageProvider: FakeStorageprovider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakesUsersRepository();
    fakeStorageProvider = new FakeStorageprovider();

    updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository,fakeStorageProvider);
  });

  it('should be able to update avatar',async() => {
    const user = await fakeUsersRepository.create({
      name: 'john doe',
      email: 'jon@example.com',
      password: '123456',
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg'
    });


    await expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to create a new avatar from a non-existing user',async() => {
    await expect(updateUserAvatar.execute({
      user_id: 'non-existing-user',
      avatarFileName: 'avatar.jpg'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should delete avatar when update new one',async() => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile')

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

    await expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    await expect(user.avatar).toBe('avatar2.jpg');
  });
});
