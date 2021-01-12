import AppError from '@shared/errors/AppError';
import FakesUsersRepository from '../repositories/fakes/FakesUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';


let fakeUsersRepository: FakesUsersRepository;
let fakeHashprovider: FakeHashProvider;
let createUSer: CreateUserService;
let authenticateUser: AuthenticateUserService;
describe('AutheticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakesUsersRepository();
    fakeHashprovider = new FakeHashProvider();

    createUSer = new CreateUserService(fakeUsersRepository, fakeHashprovider);
    authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashprovider);
  });
  it('should be able to authenticate',async() => {
    const user = await createUSer.execute({
      name: 'john doe',
      email: 'jon@example.com',
      password: '123456',
    })

    const response = await authenticateUser.execute({
      email: 'jon@example.com',
      password: '123456',
    });

    await expect(response).toHaveProperty('token');
    await expect(response.user).toEqual(user);
  });

  it('should be not able to authenticate with non existing user',async() => {
    await expect(authenticateUser.execute({
      email: 'jon@example.com',
      password: '123456',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password',async() => {
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
