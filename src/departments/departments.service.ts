import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DepartmentsService {
  private logger = new Logger('DepartmentsService');

  constructor(
    @Inject('DEPARTMENT_REPOSITORY')
    private departmentRepository: Repository<Department>,
  ) {}
  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    let department = new Department({
      ...createDepartmentDto,
    });

    department.name = department.name.toLocaleLowerCase();
    try {
      const createDepartment = await this.departmentRepository.save(department);
      return createDepartment;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<Department[]> {
    const department = await this.departmentRepository.find();
    return department;
  }

  // This is use for validation
  async findByClientIdName(
    name: string,
    clientId: number,
  ): Promise<Department | null> {
    const client = await this.departmentRepository.findOne({
      where: {
        name: name.toLocaleLowerCase(),
        clientId,
      },
    });

    return client;
  }

  async findOne(id: number): Promise<Department> {
    const department = await this.departmentRepository
      .createQueryBuilder('department')
      .leftJoinAndSelect('department.client', 'client')
      .where('department.id = :id', { id })
      .getOne();

    console.log(department);
    if (!department)
      throw new HttpException('department not found', HttpStatus.NOT_FOUND);
    return department;
  }

  update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    return `This action updates a #${id} department`;
  }

  async remove(id: number): Promise<boolean> {
    try {
      const client = await this.departmentRepository.delete(id);
      if (client.affected) return true;
    } catch (error) {
      throw new InternalServerErrorException();
    }
    return false;
  }
}
