import { DataSource } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { PayrollItem } from './entities/payroll-items.entity';
import { Payroll } from './entities/payroll.entity';

export const employeeProviders = [
  {
    provide: 'EMPLOYEE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Employee),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'PAYROLL_ITEM_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PayrollItem),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'PAYROLL_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Payroll),
    inject: ['DATA_SOURCE'],
  },
];
