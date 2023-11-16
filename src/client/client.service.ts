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
import { generateRandomCode } from 'src/utils';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

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

  async findAll(options: IPaginationOptions): Promise<Pagination<Client>> {
    const queryBuilder = this.clientRepository
      .createQueryBuilder('client')
      .orderBy('client.id', 'ASC');

    const paginatedResult = await paginate<Client>(queryBuilder, options);

    return paginatedResult;
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
    const queryBuilder = this.clientRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.company', 'company')
      .where('client.id = :id', { id });

    const client = await queryBuilder.getOne();

    const employees = await queryBuilder
      .leftJoinAndSelect('client.employees', 'employees')
      .limit(2)
      .getOne();

    const deductions = await queryBuilder
      .leftJoinAndSelect('client.deductions', 'deductions')
      .limit(2)
      .getOne();

    const department = await queryBuilder
      .leftJoinAndSelect('client.department', 'department')
      .limit(2)
      .getOne();

    const allowances = await queryBuilder
      .leftJoinAndSelect('client.allowances', 'allowances')
      .limit(2)
      .getOne();

    client.employees = employees.employees;
    client.deductions = deductions.deductions;
    client.department = department.department;
    client.allowances = allowances.allowances;

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
