import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Employee } from './employee.entity';
import { Allowance } from 'src/allowance/entities/allowance.entity';
import { AbstractEntity } from 'src/database/abstract.entity';

@Entity()
export class EmployeeAllowance extends AbstractEntity<EmployeeAllowance> {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, (employee) => employee.allowances)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => Allowance, (allowance) => allowance.employees)
  @JoinColumn({ name: 'allowance_id' })
  allowance: Allowance;

  @Column('decimal', { precision: 6, scale: 2 })
  amount: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  effective_date: Date;
}
