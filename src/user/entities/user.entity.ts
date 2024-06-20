import { ObjectType, Field } from '@nestjs/graphql';
import { CommonBaseEntity } from 'src/common/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User extends CommonBaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  @Field()
  firstName: string;

  @Column()
  @Field()
  lastName: string;

  @Column()
  @Field()
  email: string;

  @Column({ nullable: true })
  @Field()
  password: string;
}
