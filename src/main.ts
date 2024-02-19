import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/core/core.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(7377);
}
bootstrap();
