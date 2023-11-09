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

  @ManyToOne(() => User, (user) => user.employees)
  @JoinTable()
  user: User;

  @ManyToMany(() => Allowance, (allowance) => allowance.employees)
  allowances: Allowance[];

  @ManyToMany(() => Deduction, (deduction) => deduction.employees)
  deductions: Deduction[];
}
