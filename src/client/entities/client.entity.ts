import { Company } from 'src/company/entities/company.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Client extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @OneToMany(() => Employee, (employee) => employee.client)
    employees: Employee[];
    
    @ManyToOne(() => Company, (company) => company.clients)
    company: Company;

    @ManyToOne(() => User, (user) => user.clients)
    user: User;
}
