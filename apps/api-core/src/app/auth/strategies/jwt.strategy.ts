import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UsersService } from '../../users/users.service'
import { ConfigService } from '@nestjs/config'
import { IConfig } from '../../common/types'
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    config: ConfigService<IConfig, true>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('app.jwt', {
        infer: true,
      }),
    })
  }
  async validate(payload: any) {
    const user = await this.usersService.findOne({ where: { id: payload.sub } })
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
