import { Injectable } from '@nestjs/common';
import { SignUpUserDto } from './dto/signup-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ){}

  create(signUpUserDto: SignUpUserDto) {
    return this.userRepository.save(signUpUserDto)
  }

  findAll() {
    return this.userRepository.find()
  }

  findOne(id: string) {
    return this.userRepository.findOneBy({ id })
  }

  update(id: string, loginUserDto: LoginUserDto) {
    return this.userRepository.update(id, loginUserDto)
  }

  remove(id: string) {
    return this.userRepository.softDelete(id)
  }
}
