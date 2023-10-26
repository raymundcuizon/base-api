import { Company } from 'src/company/entities/company.entity';
import { AbstractEntity } from 'src/database/abstract.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Client extends AbstractEntity<Client> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  companyId: number;

  @Column({ nullable: true })
  userId: number;

  @OneToMany(() => Employee, (employee) => employee.client)
  employees: Employee[];

  @ManyToOne(() => Company, (company) => company.clients, { cascade: true })
  @JoinTable()
  company: Company;

  @ManyToOne(() => User, (user) => user.clients)
  user: User;
}
