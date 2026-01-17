// Authentication Controller
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthRequest } from '../../middleware/auth';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register new user
   * POST /api/v1/auth/register
   */
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name, phone, role } = req.body;

      // Validation
      if (!email || !password || !name) {
        res.status(400).json({
          success: false,
          message: 'Email, password, and name are required',
        });
        return;
      }

      const result = await this.authService.register({
        email,
        password,
        name,
        phone,
        role,
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Registration failed',
      });
    }
  };

  /**
   * Login user
   * POST /api/v1/auth/login
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
        return;
      }

      const result = await this.authService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || 'Login failed',
      });
    }
  };

  /**
   * Get current user profile
   * GET /api/v1/auth/me
   */
  getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Not authenticated',
        });
        return;
      }

      const user = await this.authService.getUserById(req.user.id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * Update user profile
   * PUT /api/v1/auth/me
   */
  updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Not authenticated',
        });
        return;
      }

      const { name, phone } = req.body;
      const user = await this.authService.updateUser(req.user.id, { name, phone });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  /**
   * Change password
   * POST /api/v1/auth/change-password
   */
  changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Not authenticated',
        });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        res.status(400).json({
          success: false,
          message: 'Current password and new password are required',
        });
        return;
      }

      await this.authService.changePassword(req.user.id, currentPassword, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}



