import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AbstractEntity } from 'src/database/abstract.entity';

@Entity()
@Unique(['username', 'email', 'mobileNumber'])
export class User extends AbstractEntity<User>{
   
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
  
    @Column()
    lastname: string;
  
    @Column({ default: true })
    isActivated: boolean;
  
    @Column({
      nullable: true,
    })
    activationCode: string;

    @Column()
    mobileNumber: string;
  

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
      }

}