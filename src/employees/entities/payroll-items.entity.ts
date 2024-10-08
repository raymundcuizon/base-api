// payroll-items.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Payroll } from './payroll.entity';
import { Employee } from './employee.entity'; // Import the Employee entity
import { AbstractEntity } from 'src/database/abstract.entity';

@Entity('payroll_items')
export class PayrollItem extends AbstractEntity<PayrollItem> {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Payroll, { nullable: false })
  @JoinColumn({ name: 'payroll_id' })
  payroll: Payroll;

  @ManyToOne(() => Employee, { nullable: false })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'int', nullable: false })
  present: number;

  @Column({ type: 'int', nullable: false })
  absent: number;

  @Column({ type: 'text', nullable: false })
  late: string;

  @Column({ type: 'double precision', nullable: false })
  salary: number;

  @Column({ type: 'double precision', nullable: false })
  allowance_amount: number;

  @Column({ type: 'text', nullable: false })
  allowances: string;

  @Column({ type: 'double precision', nullable: false })
  deduction_amount: number;

  @Column({ type: 'text', nullable: false })
  deductions: string;

  @Column({ type: 'int', nullable: false })
  net: number;
}
