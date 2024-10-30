import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { AuthModule } from "auth/auth.module";
import { AppController } from "app.controller";
import { AppService } from "app.service";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    EventModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule {}