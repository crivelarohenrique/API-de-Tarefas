import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('API de tarefas.')
  .setDescription('Essa é uma API com rotas para criar usuário e eventos com data para este respectivo usuário, permitindo criar, editar, ler e deletar o evento.')
  .setVersion('1.0')
  .addBearerAuth()
  .addTag('tasks')
  .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.enableCors({
    origin: 'http://localhost:8080',
    methods: 'GET,HEAD,PUT,PATCH,DELETE,POST',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.listen(process.env.PORT);
  console.log(`Aplicação rodando em : http://localhost:${process.env.PORT}`)
}
bootstrap();
