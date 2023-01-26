import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { SignUpUserDto } from '../user/dto/signup-user.dto'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ){}

  public async validateUser(emailParameter: string, passwordParameter: string) {
    const user = await this.userService.findOneByEmail(emailParameter)
    
    if (!user) throw new HttpException('User is not found', HttpStatus.NOT_FOUND);

    const isGoodToken = await bcrypt.compare(user.password, passwordParameter)
    if(!isGoodToken) throw new HttpException('User is not found', HttpStatus.UNAUTHORIZED);
    
    const { password, ...result } = user
    return result

  }

  public async signup(signupUserDTO: SignUpUserDto){
    const user = await this.userService.findOneByEmail(signupUserDTO.email)

    if(user) throw new HttpException('User is already exist', HttpStatus.NOT_ACCEPTABLE);

    const password = await bcrypt.hash(signupUserDTO.password, 10)

    this.userService.create({
      ...signupUserDTO,
      password
    })

    const payload = {
      username: signupUserDTO.username,
      email: signupUserDTO.email
    }

    return {
      accessToken: this.jwtService.sign(payload, {expiresIn: 86400})
    }
  }
}
