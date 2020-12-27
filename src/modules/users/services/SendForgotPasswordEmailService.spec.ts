import AppError from '@shared/errors/AppError';
import FakesUsersRepository from '../repositories/fakes/FakesUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';


let fakeUsersRepository : FakesUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPassordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakesUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();


    sendForgotPassordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  })

  it('should be able to recover the password using the email',async() => {

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
    await fakeUsersRepository.create({
      name: 'jon',
      email: 'jon@example.com',
      password: '123456',
    })

    await sendForgotPassordEmail.execute({
      email: 'jon@example.com',
    });

    expect(sendMail).toHaveBeenCalled()
  });

  it('should not be able to recover a non-existing user password', async() => {

    await expect(sendForgotPassordEmail.execute({
      email: 'jon@example.com',
    })).rejects.toBeInstanceOf(AppError);
  })

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'jon',
      email: 'jon@example.com',
      password: '123456',
    })

    await sendForgotPassordEmail.execute({
      email: 'jon@example.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  })
});