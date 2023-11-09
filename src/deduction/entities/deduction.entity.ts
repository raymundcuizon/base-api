import { Client } from 'src/client/entities/client.entity';
import { AbstractEntity } from 'src/database/abstract.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';

@Entity()
export class Deduction extends AbstractEntity<Deduction> {
  @Column()
  name: string;

  @Column()
  clientId: number;

  @Column()
  description: string;

  @ManyToOne(() => Client, (client) => client.deductions)
  client: Client;

  @ManyToMany(() => Employee, (employee) => employee.deductions)
  employees: Employee[];
}
