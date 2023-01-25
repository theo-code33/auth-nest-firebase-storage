import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

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
}
