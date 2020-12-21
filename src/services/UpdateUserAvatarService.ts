import path from 'path';
import fs from 'fs';
import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import User from '../models/User';
import uploadConfig from '../config/upload';

interface Request {
  user_id: string;
  avatarFileName : string;
}

class UpdateUSerAvatarService {
  public async execute({ user_id, avatarFileName }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

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

    await usersRepository.save(user);

    return user;
  }
};

export default UpdateUSerAvatarService;
