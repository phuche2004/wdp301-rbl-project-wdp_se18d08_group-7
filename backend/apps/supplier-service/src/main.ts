import { NestFactory } from '@nestjs/core';
import { SupplierServiceModule } from './supplier-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  process.env.KAFKAJS_NO_PARTITIONER_WARNING = '1';
  let retries = 10;
  while (retries > 0) {
    try {
      const app = await NestFactory.create(SupplierServiceModule, { logger: ['error', 'warn', 'log'] });
      
      app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
            connectionTimeout: 10000,
            retry: { initialRetryTime: 1000, retries: 10 },
            logLevel: 1,
          },
          consumer: {
            groupId: 'supplier-consumer-group',
          },
        },
      });

      await app.startAllMicroservices();
      console.log('Supplier Microservice đang lắng nghe Kafka trên localhost:9092');
      break;
    } catch (err) {
      console.error(`❌ Lỗi khởi động Supplier Service. Thử lại sau 5s... (${retries} lần thử còn lại)`);
      retries--;
      if (retries === 0) throw err;
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}
bootstrap();
