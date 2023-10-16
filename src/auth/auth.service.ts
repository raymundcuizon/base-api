import { CreateAuthDto } from './dto/create-auth.dto';
import { SigninUserDTO } from './dto/signinUser.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Injectable, Inject, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { SigninResponseDTO } from './dto/signinResponse.dto';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async authRefresh(refToken: string): Promise<SigninResponseDTO> {

    const decodeToken: any = this.jwtService.decode(refToken);

    if (!decodeToken.username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.userRepository.findOne({
      where: { username : decodeToken.username }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.genToken(user);
  }

  async signIn(signinUserDTO: SigninUserDTO): Promise<SigninResponseDTO> {
    const user = await this.validateUserPassword(signinUserDTO);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return await this.genToken(user);
  }

  async genToken(user: User) {

    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      mobileNumber: user.mobileNumber,
      type: user.type
    };

    const accessToken = await this.jwtService.signAsync(payload,  { expiresIn: '1d' })
    const refreshToken = await this.jwtService.signAsync(payload,  { expiresIn: '2d' })
    this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`);
    return { accessToken, refreshToken };
  }

  async validateUserPassword(signinUserDTO: SigninUserDTO): Promise<User> {
    const { username, password } = signinUserDTO;

    const user = await this.userRepository.findOne({
      where: {
        username
      }
    });

    if (user && await user.validatePassword(password)) {
      return user;
    } else {
      return null;
    }
  }
  
}
