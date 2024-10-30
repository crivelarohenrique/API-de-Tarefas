import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import * as dotenv from 'dotenv'

dotenv.config()

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  exports: [JwtModule]
})
export class AuthModule {}