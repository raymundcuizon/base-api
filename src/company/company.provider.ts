import { DataSource } from 'typeorm';
import { Company } from './entities/company.entity';

export const compnayProviders = [
  {
    provide: 'COMPNAY_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Company),
    inject: ['DATA_SOURCE'],
  },
];