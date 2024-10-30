import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity"


@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  hour: string;

  @Column()
  date: string;

  @ManyToOne(() => User, (user) => user.events)
  user: User;

  @Column()
  userId: string;
}
