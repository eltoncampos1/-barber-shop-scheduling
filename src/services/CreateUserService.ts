import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password}: Request): Promise<User> {
    const usersRepositoty = getRepository(User);

    const checkUserExists = await usersRepositoty.findOne({
      where: { email },
    })

    if( checkUserExists ) {
      throw Error ('Email address already used.')
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepositoty.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepositoty.save(user);

    return user;
  }
};

export default CreateUserService;
