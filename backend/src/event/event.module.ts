import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { AuthMiddleware } from 'middleware/user.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(AuthMiddleware)
    .forRoutes({ path: 'event*', method: RequestMethod.ALL})
  }
}
