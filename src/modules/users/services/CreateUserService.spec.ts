import AppError from '@shared/errors/AppError';
import FakesUsersRepository from '../repositories/fakes/FakesUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user',async() => {
    const fakeUsersRepository = new FakesUsersRepository();
    const fakeHasProvider = new FakeHashProvider();

    const createUsers = new CreateUserService(fakeUsersRepository,fakeHasProvider);

    const user = await createUsers.execute({
      name: 'john doe',
      email: 'jon@example.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another',async() => {
    const fakeUsersRepository = new FakesUsersRepository();
    const fakeHasProvider = new FakeHashProvider();


    const createUser= new CreateUserService(fakeUsersRepository,fakeHasProvider);

    await createUser.execute({
      name: 'john doe',
      email: 'jon@example.com',
      password: '123456',
    });

    await expect(createUser.execute({
      name: 'john doe',
      email: 'jon@example.com',
      password: '123456',
    })).rejects.toBeInstanceOf(AppError);
  });
});
