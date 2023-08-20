import { Injectable, Inject, ConflictException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
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
    private userRepository: Repository<User>
    ){

  }

  async create(createUserDto: CreateUserDto): Promise<User> {

    const user = new User({
      ...createUserDto,});
    
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(createUserDto.password, user.salt);

    try {
      const userCreate = await this.userRepository.save(user);
      delete userCreate.password
      return userCreate
    } catch (error) {
      this.logger.log(error);
      if (error.code === 'ER_DUP_ENTRY') { // duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }



  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

}
