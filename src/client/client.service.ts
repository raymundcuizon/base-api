import {
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { DataSource, Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { User, userType } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { stringify } from 'querystring';
import { generateRandomCode } from 'src/utils';

@Injectable()
export class ClientService {
  private logger = new Logger('ClientService');

  constructor(
    @Inject('DATA_SOURCE') private dataSource: DataSource,
    @Inject('CLIENT_REPOSITORY') private clientRepository: Repository<Client>,
    private readonly userService: UsersService,
  ) {}
  async create(createClientDto: CreateClientDto): Promise<Client> {
    let client = new Client({
      ...createClientDto,
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    client.name = client.name.toLocaleLowerCase();

    await queryRunner.startTransaction();

    try {
      const saltPassword = await this.userService.saltPassword('1234');

      const user = {
        email: createClientDto.email,
        username: createClientDto.email.split('@')[0],
        firstname: 'n/a',
        salt: saltPassword.salt,
        password: saltPassword.password,
        lastname: 'n/a',
        mobileNumber: createClientDto.contact_number,
        isActivated: false,
        type: userType.CLI_ADMIN,
        activationCode: generateRandomCode(12),
      };
      const saveUser = await queryRunner.manager.save(User, user);
      client.userId = saveUser.id;
      const saveClient = await queryRunner.manager.save(Client, client);

      await queryRunner.commitTransaction();

      return saveClient;
    } catch (err) {
      this.logger.log(err);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err.toString());
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Client[]> {
    return await this.clientRepository.find({
      relations: ['department'],
    });
  }

  // This is use for validation
  async findByCompanyIdName(
    name: string,
    companyId: number,
  ): Promise<Client | null> {
    const client = await this.clientRepository.findOne({
      where: {
        name: name.toLocaleLowerCase(),
        companyId,
      },
    });

    return client;
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.company', 'company')
      .leftJoinAndSelect('client.department', 'department')
      .limit(7)
      .orderBy({
        'department.name': 'ASC',
      })
      .where('client.id = :id', { id })
      .getOne();

    if (!client)
      throw new HttpException('Client Company not found', HttpStatus.NOT_FOUND);
    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<void> {
    try {
      const client = await this.clientRepository.update(
        { id },
        updateClientDto,
      );

      if (!client.affected)
        throw new HttpException(
          'client copany not found',
          HttpStatus.NOT_FOUND,
        );
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const client = await this.clientRepository.delete(id);
      if (client.affected) return true;
    } catch (error) {
      throw new InternalServerErrorException();
    }
    return false;
  }
}
