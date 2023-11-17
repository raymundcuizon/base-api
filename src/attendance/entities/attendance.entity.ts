import { AbstractEntity } from 'src/database/abstract.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Attendance extends AbstractEntity<Attendance> {
  @ManyToOne(() => Employee, (employee) => employee.allowances)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({
    type: 'smallint',
    width: 1,
    comment: '1 = AM IN, 2= AM OUT, 3 = PM IN, 4 = PM OUT',
  })
  log_type: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  datetime_log: Date;
}
