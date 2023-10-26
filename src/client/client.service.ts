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
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientService {
  private logger = new Logger('ClientService');

  constructor(
    @Inject('CLIENT_REPOSITORY') private clientRepository: Repository<Client>,
  ) {}
  async create(createClientDto: CreateClientDto): Promise<Client> {
    let client = new Client({
      ...createClientDto,
    });

    client.name = client.name.toLocaleLowerCase();
    try {
      const save = await this.clientRepository.save(client);
      return save;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<Client[]> {
    return await this.clientRepository.find();
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
      .where('client.id = :id', { id })
      .getOne();

    console.log(client);
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
