import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserServiceModule } from './user-service.module';

async function bootstrap() {
  process.env.KAFKAJS_NO_PARTITIONER_WARNING = '1';
  let retries = 10;
  while (retries > 0) {
    try {
      const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        UserServiceModule,
        {
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'user-service',
              brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
              connectionTimeout: 10000,
              retry: { initialRetryTime: 1000, retries: 10 },
              logLevel: 1,
            },
            consumer: {
              groupId: (process.env.KAFKA_GROUP_ID || 'wdp301-consumers') + '-user',
            },
          },
          logger: ['error', 'warn', 'log'],
        },
      );

      await app.listen();
      console.log('🚀 User Microservice đang lắng nghe Kafka trên localhost:9092');
      break;
    } catch (error) {
      console.error(`❌ Lỗi khởi động User Service. Thử lại sau 5s... (${retries} lần thử còn lại)`);
      retries--;
      if (retries === 0) throw error;
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

bootstrap();
