import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { DataSource, Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { generateRandomCode } from 'src/utils';
import { Role } from 'src/decorators/role.enum';

@Injectable()
export class CompanyService {
  private logger = new Logger('CompanyService');

  constructor(
    @Inject('DATA_SOURCE') private dataSource: DataSource,
    @Inject('COMPANY_REPOSITORY')
    private companyRepository: Repository<Company>,
    private readonly userService: UsersService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    let company = new Company({
      ...createCompanyDto,
    });

    company.name = company.name.toLocaleLowerCase();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const saveCompany = await queryRunner.manager.save(Company, company);

      const saltPassword = await this.userService.saltPassword('1234');
      const user = {
        email: createCompanyDto.email,
        username: createCompanyDto.email.split('@')[0],
        firstname: 'n/a',
        salt: saltPassword.salt,
        password: saltPassword.password,
        lastname: 'n/a',
        mobileNumber: createCompanyDto.contact_number,
        isActivated: false,
        role: Role.COM_ADMIN,
        companyId: saveCompany.id,
        activationCode: generateRandomCode(12),
      };
      await queryRunner.manager.save(User, user);

      await queryRunner.commitTransaction();

      return saveCompany;
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error.toString());
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Company>> {
    const queryBuilder = this.companyRepository
      .createQueryBuilder('company')
      // .leftJoinAndSelect('company.clients', 'clients')
      // .limit(1)
      // .orderBy({
      //   'clients.name': 'ASC',
      // })
      .orderBy('company.id', 'ASC');

    const paginatedResult = await paginate<Company>(queryBuilder, options);

    return paginatedResult;
  }

  async findByName(name: string): Promise<Company | null> {
    const company = await this.companyRepository.findOne({
      where: {
        name: name.toLocaleLowerCase(),
      },
    });

    return company;
  }

  async findOne(id: number): Promise<Company> {
    const company = await this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.clients', 'clients')
      .leftJoinAndSelect('company.users', 'users')
      .select([
        'company',
        'clients.id',
        'clients.name',
        'users.id',
        'users.role',
        'users.email',
        'users.firstname',
        'users.lastname',
        'users.isActivated',
        'users.activationCode',
        'users.mobileNumber',
      ])
      .where('company.id = :id', { id })
      .getOne();
    if (!company)
      throw new HttpException('Conpany not found', HttpStatus.NOT_FOUND);
    return company;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<void> {
    try {
      const updateCompany = await this.companyRepository.update(
        { id },
        updateCompanyDto,
      );

      if (!updateCompany.affected)
        throw new HttpException('Conpany not found', HttpStatus.NOT_FOUND);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const deleteCompany = await this.companyRepository.delete(id);
      if (deleteCompany.affected) return true;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }

    return false;
  }
}
