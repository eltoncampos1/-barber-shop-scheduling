import AppError from '@shared/errors/AppError';
import FakesUsersRepository from '../repositories/fakes/FakesUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AutheticateUser', () => {
  it('should be able to authenticate',async() => {
    const fakeUsersRepository = new FakesUsersRepository();
    const fakeHashprovider = new FakeHashProvider();

    const createUSer = new CreateUserService(fakeUsersRepository, fakeHashprovider);
    const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashprovider);

    const user = await createUSer.execute({
      name: 'john doe',
      email: 'jon@example.com',
      password: '123456',
    })

    const response = await authenticateUser.execute({
      email: 'jon@example.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should be not able to authenticate with non existing user',async() => {
    const fakeUsersRepository = new FakesUsersRepository();
    const fakeHashprovider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashprovider);

    await expect(authenticateUser.execute({
      email: 'jon@example.com',
      password: '123456',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password',async() => {
    const fakeUsersRepository = new FakesUsersRepository();
    const fakeHashprovider = new FakeHashProvider();

    const createUSer = new CreateUserService(fakeUsersRepository, fakeHashprovider);
    const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashprovider);

    await createUSer.execute({
      name: 'john doe',
      email: 'jon@example.com',
      password: '123456',
    })


    await expect(authenticateUser.execute({
      email: 'jon@example.com',
      password: 'wrong-password',
    })).rejects.toBeInstanceOf(AppError);
  });
});
