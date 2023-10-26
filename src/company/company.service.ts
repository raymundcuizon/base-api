import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {
  private logger = new Logger('CompanyService');

  constructor(
    @Inject('COMPANY_REPOSITORY')
    private companyRepository: Repository<Company>,
  ) {}
  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    let company = new Company({
      ...createCompanyDto,
    });

    company.name = company.name.toLocaleLowerCase();
    try {
      const createCompany = await this.companyRepository.save(company);
      return createCompany;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<Company[]> {
    return await this.companyRepository.find();
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
    const company = await this.companyRepository.findOne({
      where: {
        id,
      },
    });

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
