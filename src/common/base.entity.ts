import { Field } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

@Entity()
export class CommonBaseEntity {
  @Column({ default: false })
  @Field()
  isDeleted: Boolean;
}
