import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { Repository } from 'typeorm';
import { Position } from './entities/position.entity';

@Injectable()
export class PositionsService {
  private logger = new Logger('PositionsService');

  constructor(
    @Inject('POSITION_REPOSITORY')
    private positionRepository: Repository<Position>,
  ) {}

  async create(createPositionDto: CreatePositionDto): Promise<Position> {
    let position = new Position({
      ...createPositionDto,
    });

    position.name = position.name.toLocaleLowerCase();
    try {
      const createPosition = await this.positionRepository.save(position);
      return createPosition;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<Position[]> {
    const position = await this.positionRepository.find();
    return position;
  }

  // This is use for validation
  async findByPositionIdName(
    name: string,
    departmentId: number,
  ): Promise<Position | null> {
    const position = await this.positionRepository.findOne({
      where: {
        name: name.toLocaleLowerCase(),
        departmentId,
      },
    });

    return position;
  }

  async findOne(id: number): Promise<Position> {
    const position = await this.positionRepository
      .createQueryBuilder('position')
      .leftJoinAndSelect('position.department', 'department')
      .where('position.id = :id', { id })
      .getOne();

    console.log(position);
    if (!position)
      throw new HttpException('position not found', HttpStatus.NOT_FOUND);
    return position;
  }

  async update(
    id: number,
    updatePositionDto: UpdatePositionDto,
  ): Promise<void> {
    try {
      const position = await this.positionRepository.update(
        { id },
        updatePositionDto,
      );

      if (!position.affected)
        throw new HttpException('Department not found', HttpStatus.NOT_FOUND);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const position = await this.positionRepository.delete(id);
      if (position.affected) return true;
    } catch (error) {
      throw new InternalServerErrorException();
    }
    return false;
  }
}
