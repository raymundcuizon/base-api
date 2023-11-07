import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateAllowanceDto } from './dto/create-allowance.dto';
import { UpdateAllowanceDto } from './dto/update-allowance.dto';
import { Repository } from 'typeorm';
import { Allowance } from './entities/allowance.entity';

@Injectable()
export class AllowanceService {
  private logger = new Logger('DeductionService');

  constructor(
    @Inject('ALLOWANCE_REPOSITORY')
    private allowanceRepository: Repository<Allowance>,
  ) {}
  async create(createAllowanceDto: CreateAllowanceDto): Promise<Allowance> {
    let allowance = new Allowance({
      ...createAllowanceDto,
    });

    allowance.name = allowance.name.toLocaleLowerCase();
    try {
      const createAllowance = await this.allowanceRepository.save(allowance);
      return createAllowance;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<Allowance[]> {
    return await this.allowanceRepository.find();
  }

  // This is use for validation
  async findByAllowanceIdName(
    name: string,
    clientId: number,
  ): Promise<Allowance | null> {
    return await this.allowanceRepository.findOne({
      where: {
        name: name.toLocaleLowerCase(),
        clientId,
      },
    });
  }

  async findOne(id: number): Promise<Allowance> {
    const allowance = await this.allowanceRepository
      .createQueryBuilder('allowance')
      .leftJoinAndSelect('allowance.client', 'client')
      .where('allowance.id = :id', { id })
      .getOne();

    if (!allowance)
      throw new HttpException('allowance not found', HttpStatus.NOT_FOUND);
    return allowance;
  }

  async update(
    id: number,
    updateAllowanceDto: UpdateAllowanceDto,
  ): Promise<void> {
    try {
      const position = await this.allowanceRepository.update(
        { id },
        updateAllowanceDto,
      );

      if (!position.affected)
        throw new HttpException('Allowance not found', HttpStatus.NOT_FOUND);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const allowance = await this.allowanceRepository.delete(id);
      if (allowance.affected) return true;
    } catch (error) {
      throw new InternalServerErrorException();
    }
    return false;
  }
}
