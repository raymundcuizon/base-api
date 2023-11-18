import { Allowance } from 'src/allowance/entities/allowance.entity';
import { Client } from 'src/client/entities/client.entity';
import { Company } from 'src/company/entities/company.entity';
import { AbstractEntity } from 'src/database/abstract.entity';
import { Deduction } from 'src/deduction/entities/deduction.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Employee extends AbstractEntity<Employee> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  clientId: number;

  @ManyToOne(() => Client, (client) => client.employees)
  @JoinTable()
  client: Client;

  @Column({
    nullable: true,
  })
  userId: number;

  @Column({
    nullable: false,
  })
  employee_no: string;

  @Column('decimal', { precision: 6, scale: 2 })
  salary: number;

  @OneToOne(() => User, (user) => user.employee)
  @JoinTable()
  user: User;

  @ManyToMany(() => Allowance, (allowance) => allowance.employees)
  allowances: Allowance[];

  @ManyToMany(() => Deduction, (deduction) => deduction.employees)
  deductions: Deduction[];
}
