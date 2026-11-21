import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/all-exceptions.filter';

// La configuración de la app, en un solo sitio.
// La usan main.ts y los tests, para que todos funcionen igual.
export function configureApp(app: INestApplication) {
  // CORS: solo esta web puede usar la API desde el navegador.
  // En Render, la dirección sale de la variable CORS_ORIGIN. En tu ordenador, la de Vite.
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  });

  // Todas las rutas empiezan por /api
  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  // Todos los errores con la misma forma
  app.useGlobalFilters(new AllExceptionsFilter());

  // Comprueba los DTO en todas las rutas
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // quita los campos que no estén en el DTO...
      forbidNonWhitelisted: true, // ...o mejor: responde 400 si llegan
      transform: true, // aplica las transformaciones del DTO (como el trim)
    }),
  );
}
