import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne({ where: { username } })
    if (user && bcrypt.compareSync(pass, user.password)) {
      return user
    }
    return null
  }

  async register({ username, password }) {
    const user = await this.userService.findOneOrNull({
      where: { username },
    })

    if (user) {
      throw new ConflictException('User already exist')
    }

    const hashedPassword = bcrypt.hashSync(password, 10)
    await this.userService.save({
      username,
      password: hashedPassword,
    })
  }

  async login({ username, password }) {
    const validUser = await this.validateUser(username, password)
    if (!validUser) {
      throw new NotFoundException()
    }
    const payload = { username, sub: validUser.id }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
