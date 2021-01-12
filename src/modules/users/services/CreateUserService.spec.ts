import AppError from '@shared/errors/AppError';
import FakesUsersRepository from '../repositories/fakes/FakesUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakesUsersRepository;
let fakeHasProvider: FakeHashProvider;
let createUser: CreateUserService;
describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakesUsersRepository();
    fakeHasProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository,fakeHasProvider);
  });
  it('should be able to create a new user',async() => {
    const user = await createUser.execute({
      name: 'john doe',
      email: 'jon@example.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another',async() => {

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
