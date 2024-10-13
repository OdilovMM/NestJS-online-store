/* eslint-disable prettier/prettier */
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api/v1/');
    const config = new DocumentBuilder().setTitle('NestJS E-commerce API endpoints').setVersion('1.0').build();

    const document = SwaggerModule.createDocument(app, config);
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    SwaggerModule.setup('/', app, document);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true
        })
    );
    await app.listen(3000);
}
bootstrap();
