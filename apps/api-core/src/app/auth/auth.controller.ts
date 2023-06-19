import * as Nest from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto'

@Nest.Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Nest.Post('login')
  async login(@Nest.Body() authRegisterLogin: AuthRegisterLoginDto) {
    return this.authService.login(authRegisterLogin)
  }
  @Nest.Post('register')
  async register(@Nest.Body() authRegisterLogin: AuthRegisterLoginDto) {
    await this.authService.register(authRegisterLogin)
    return { status: true }
  }
}
