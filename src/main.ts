import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder } from '@nestjs/swagger';
import { extractErrorMessages } from '@shared/constants';
import { toTitleCase } from './shared/utils/naming-case.function';
import { SwaggerService } from '@shared/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);

  /* CORS Configuration */
  app.enableCors({
    origin: '*',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        /* Un-expected error handling */
        let errors: null | string[] = null;
        validationErrors.forEach((error) => {
          const errMessages = extractErrorMessages(error);
          if (errMessages.length) {
            errors = !errors?.length
              ? [...errMessages]
              : [...errors, ...errMessages];
          }
        });
        return new BadRequestException(errors);
      },
    }),
  );

  const documentConfig = new DocumentBuilder()
    .setTitle(
      `Musaro App - API Gateway (${toTitleCase(
        config.get('APP_ENV') || 'development',
      )})`,
    )
    .setDescription(
      'API Gateway is open for development and testing purposes for FE developers.',
    )
    .addBearerAuth()
    .setVersion('1.0.0')
    .setExternalDoc('Postman Collection', '/api-json')
    .build();

  new SwaggerService(
    app,
    documentConfig,
  ).init();
  // writeFileSync(
  //   join(__dirname, 'spec.json'),
  //   JSON.stringify({ ...SwaggerService._document, servers: [{ url: '' }] }),
  // );

  // app.use(
  //   ['/api/*'],
  //   expressBasicAuth({
  //     challenge: true,
  //     users: {
  //       pl: 'pl123!@#',
  //     },
  //   }),
  // );
  // const document = SwaggerModule.createDocument(app, documentConfig);
  // SwaggerModule.setup('api', app, document);
  const port = config.get('PORT') || 8000;
  await app.listen(port);
}
bootstrap();
