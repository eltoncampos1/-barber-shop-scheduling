import AuthenticateUserService from "@modules/users/services/AuthenticateUserService";
import { Request, Response } from "express";
import { container } from "tsyringe";

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password }  = request.body;

    const authenticateUSer = container.resolve(AuthenticateUserService);

    const  { user, token } = await authenticateUSer.execute({
      email,
      password
    });

    delete user.password;

    return response.json({ user, token })
  }
}
