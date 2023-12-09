import { Allowance } from 'src/allowance/entities/allowance.entity';
import { Company } from 'src/company/entities/company.entity';
import { AbstractEntity } from 'src/database/abstract.entity';
import { Deduction } from 'src/deduction/entities/deduction.entity';
import { Department } from 'src/departments/entities/department.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Client extends AbstractEntity<Client> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  companyId: number;

  @Column({ nullable: true })
  contact_number: string;

  @Column({ nullable: true })
  address: string;

  @OneToMany(() => Employee, (employee) => employee.client)
  employees: Employee[];

  @ManyToOne(() => Company, (company) => company.clients, { cascade: true })
  @JoinTable()
  company: Company;

  @OneToMany(() => User, (user) => user.client)
  users: User[];

  @OneToMany(() => Department, (department) => department.client)
  @JoinTable()
  department: Department[];

  @OneToMany(() => Allowance, (allowance) => allowance.client)
  @JoinTable()
  allowances: Allowance[];

  @OneToMany(() => Deduction, (deduction) => deduction.client)
  @JoinTable()
  deductions: Deduction[];
}
