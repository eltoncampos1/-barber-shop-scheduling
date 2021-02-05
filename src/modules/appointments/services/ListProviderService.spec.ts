import AppError from '@shared/errors/AppError';

import FakesUsersRepository from '@modules/users/repositories/fakes/FakesUsersRepository';
import ListProviderService from './ListProvidersService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeCacheProvider: FakeCacheProvider;
let fakeUsersRepository: FakesUsersRepository;
let listProvider: ListProviderService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakesUsersRepository();
    fakeCacheProvider = new FakeCacheProvider()
    listProvider = new ListProviderService(fakeUsersRepository, fakeCacheProvider);
  });

  it('should be able to list the providers',async() => {
    const user1 = await fakeUsersRepository.create({
      name: 'john doe',
      email: 'jon@example.com',
      password: '123456',
    })

    const user2 = await fakeUsersRepository.create({
      name: 'john tre',
      email: 'jontre@example.com',
      password: '123456',
    })

    const loggedUser = await fakeUsersRepository.create({
      name: 'john qua',
      email: 'jonqua@example.com',
      password: '123456',
    })

    const providers = await listProvider.execute({
      user_id: loggedUser.id,
    });


    await expect(providers).toEqual([
      user1,
      user2
    ]);
  });
});
