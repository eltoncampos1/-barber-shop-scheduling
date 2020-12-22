import path from 'path';
import fs from 'fs';
import { inject, injectable } from 'tsyringe';


import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import uploadConfig from '@config/upload';
import IUserRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  avatarFileName : string;
}

@injectable()
class UpdateUSerAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository
    ) {}
  public async execute({ user_id, avatarFileName }: IRequest): Promise<User> {

    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }

    if(user.avatar) {
      const userAvatrFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatrFilePath);

      if(userAvatarFileExists) {
        await fs.promises.unlink(userAvatrFilePath);
      }
    }

    user.avatar = avatarFileName;

    await this.usersRepository.save(user);

    return user;
  }
};

export default UpdateUSerAvatarService;
