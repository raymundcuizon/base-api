import { Client } from 'src/client/entities/client.entity';
import { AbstractEntity } from 'src/database/abstract.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Department extends AbstractEntity<Department> {
  @Column()
  name: string;

  @Column()
  clientId: string;

  @ManyToOne(() => Client, (client) => client.department)
  @JoinTable()
  client: Client;
}
