import { AbstractEntity } from 'src/database/abstract.entity';
import { Department } from 'src/departments/entities/department.entity';
import { Column, Entity, JoinTable, ManyToOne } from 'typeorm';

@Entity()
export class Position extends AbstractEntity<Position> {
  @Column()
  name: string;

  @Column()
  departmentId: string;

  @ManyToOne(() => Department, (department) => department.positions)
  @JoinTable()
  department: Department;
}
