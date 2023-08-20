import { Employee } from 'src/employees/entities/employee.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Company extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @OneToMany(() => Employee, (employee) => employee.company, { cascade: true })
    employees: Employee[];
  
}
