// User Management Controller
import { Response } from 'express';
import { UserService } from './users.service';
import { AuthRequest } from '../../middleware/auth';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'User updated', data: user });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  deactivateUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await this.userService.deactivateUser(req.params.id);
      res.status(200).json({ success: true, message: 'User deactivated' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}



