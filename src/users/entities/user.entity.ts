import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinTable,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AbstractEntity } from 'src/database/abstract.entity';
import { Client } from 'src/client/entities/client.entity';
import { Company } from 'src/company/entities/company.entity';
import { Employee } from 'src/employees/entities/employee.entity';

export enum userType {
  SYS_ADMIN = 'SYS_ADMIN',
  COM_ADMIN = 'COM_ADMIN',
  COM_STAFF = 'COM_STAFF',
  CLI_ADMIN = 'CLI_ADMIN',
  CLI_STAFF = 'CLI_STAFF',
  EMP = 'EMP',
}

@Entity()
@Unique(['username', 'email', 'mobileNumber'])
export class User extends AbstractEntity<User> {
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  firstname: string;

  @Column({ nullable: true })
  companyId: number;

  @Column({ nullable: true })
  clientId: number;

  @Column()
  lastname: string;

  @Column({ default: true })
  isActivated: boolean;

  @Column({
    nullable: true,
  })
  activationCode: string;

  @Column({
    type: 'enum',
    enum: userType,
    default: userType.EMP,
  })
  type: userType;

  @Column()
  mobileNumber: string;

  @ManyToOne(() => Client, (client) => client.users)
  client: Client;

  @ManyToOne(() => Company, (company) => company.users, { cascade: true })
  @JoinTable()
  company: Company;

  @OneToOne(() => Employee, (employee) => employee.user)
  employee: Employee;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
