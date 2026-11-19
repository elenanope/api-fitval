import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthRequest } from './jwt-payload';

@Injectable()
export class StaffGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    const user = await this.usersService.findById(request.userId);
    if (!user) {
      throw new UnauthorizedException('El usuario ya no existe');
    }
    if (user.role !== 'staff') {
      throw new ForbiddenException('Solo para el personal del gimnasio');
    }
    return true;
  }
}
