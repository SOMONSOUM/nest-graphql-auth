import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const { email, password, firstName, lastName } = createUserInput;
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (user) {
      throw new BadRequestException('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    return this.userRepository.save(newUser);
  }

  async findAll() {
    const users = await this.userRepository.find({
      where: { isDeleted: false },
    });
    return users;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!user) {
      throw new NotFoundException('User with this id doesnt exists');
    }

    return user;
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    user.isDeleted = true;
    return this.userRepository.save(user);
  }
}
