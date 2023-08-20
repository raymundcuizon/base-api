import { Company } from 'src/company/entities/company.entity';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Employee extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @ManyToOne(() => Company, (company) => company.employees)
    company: Company;
}
