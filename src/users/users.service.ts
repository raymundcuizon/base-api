import {
  Injectable,
  Inject,
  ConflictException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  private logger = new Logger('UserRepository');
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User({
      ...createUserDto,
    });

    const saltPassword = await this.saltPassword(createUserDto.password);
    user.salt = saltPassword.salt;
    user.password = await saltPassword.password;

    try {
      const userCreate = await this.userRepository.save(user);
      delete userCreate.password;
      delete userCreate.salt;
      return userCreate;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async saltPassword(stringPass): Promise<{ salt: string; password: string }> {
    const salt = await bcrypt.genSalt();
    const password = await this.hashPassword(stringPass, salt);
    return {
      salt,
      password,
    };
  }

  async activateNewAccount(
    activationCode: string,
    password: string,
  ): Promise<void> {
    try {
      const saltPassword = await this.saltPassword(password);

      const client = await this.userRepository.update(
        { activationCode },
        {
          salt: saltPassword.salt,
          password: saltPassword.password,
          isActivated: true,
        },
      );

      if (!client.affected)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneUsername(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  public async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
