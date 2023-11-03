import { Client } from 'src/client/entities/client.entity';
import { AbstractEntity } from 'src/database/abstract.entity';
import { Position } from 'src/positions/entities/position.entity';
import { Column, Entity, JoinTable, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Department extends AbstractEntity<Department> {
  @Column()
  name: string;

  @Column()
  clientId: number;

  @ManyToOne(() => Client, (client) => client.department)
  @JoinTable()
  client: Client;

  @OneToMany(() => Position, (position) => position.department)
  positions: Position[];
}
