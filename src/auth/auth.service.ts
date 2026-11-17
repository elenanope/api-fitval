import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './jwt-payload';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) {
            throw new ConflictException('Ese correo ya está registrado');
        }

        const passwordHash = await argon2.hash(dto.password);

        const user = await this.usersService.create(dto.email, passwordHash);

        return { id: user.id, email: user.email, role: user.role };
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);

        if (!user || !(await argon2.verify(user.password_hash, dto.password))) {
            throw new UnauthorizedException('Correo o contraseña incorrectos');
        }

        const payload: JwtPayload = { sub: user.id };

        const accessToken = await this.jwtService.signAsync(payload);
        return { accessToken };
    }

    async me(userId: number) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new UnauthorizedException('El usuario ya no existe');
        }
        return { id: user.id, email: user.email, role: user.role };
    }
}