import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import User from '../models/User';
import { sign } from 'jsonwebtoken';


interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepositoty = getRepository(User);

    const user = await usersRepositoty.findOne({
      where: {email},
    });

    if (!user) {
      throw Error ('Incorrect email/password combination.')
    }

    const passwordMatched = await compare(password, user.password);

    if(!passwordMatched) {
      throw Error ('Incorrect email/password combination.')
    }

    const token = sign({}, 'e6709a33820d8f737ad64c71618ac4d1', {
      subject: user.id,
      expiresIn: '1d',
    });

    return {
      user,
      token,
    };
  }
};

export default AuthenticateUserService;
