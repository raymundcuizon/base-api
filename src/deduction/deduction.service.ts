import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateDeductionDto } from './dto/create-deduction.dto';
import { UpdateDeductionDto } from './dto/update-deduction.dto';
import { Repository } from 'typeorm';
import { Deduction } from './entities/deduction.entity';

@Injectable()
export class DeductionService {
  private logger = new Logger('DeductionService');

  constructor(
    @Inject('DEDUCTION_REPOSITORY')
    private deductionRepository: Repository<Deduction>,
  ) {}
  async create(createDeductionDto: CreateDeductionDto): Promise<Deduction> {
    let deduction = new Deduction({
      ...createDeductionDto,
    });

    deduction.name = deduction.name.toLocaleLowerCase();
    try {
      const createDeduction = await this.deductionRepository.save(deduction);
      return createDeduction;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<Deduction[]> {
    return await this.deductionRepository.find();
  }

  // This is use for validation
  async findByDeductionIdName(
    name: string,
    clientId: number,
  ): Promise<Deduction | null> {
    return await this.deductionRepository.findOne({
      where: {
        name: name.toLocaleLowerCase(),
        clientId,
      },
    });
  }

  async findOne(id: number): Promise<Deduction> {
    const deduction = await this.deductionRepository
      .createQueryBuilder('deduction')
      .leftJoinAndSelect('deduction.client', 'client')
      .where('deduction.id = :id', { id })
      .getOne();

    if (!deduction)
      throw new HttpException('deduction not found', HttpStatus.NOT_FOUND);
    return deduction;
  }

  async update(
    id: number,
    updateDeductionDto: UpdateDeductionDto,
  ): Promise<void> {
    try {
      const position = await this.deductionRepository.update(
        { id },
        updateDeductionDto,
      );

      if (!position.affected)
        throw new HttpException('Deduction not found', HttpStatus.NOT_FOUND);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const deduction = await this.deductionRepository.delete(id);
      if (deduction.affected) return true;
    } catch (error) {
      throw new InternalServerErrorException();
    }
    return false;
  }
}
