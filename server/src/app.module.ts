require('dotenv').config()
import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import config from '../ormconfig'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MessagesModule } from './messages/messages.module'
import { RedisModule } from './redis/redis.module'

@Module({
	imports: [
		TypeOrmModule.forRoot(config),
		ScheduleModule.forRoot(),
		MessagesModule,
		RedisModule.register({
			url: 'redis://localhost:6379',
		}),
		// TaskModule,
		// BullModule.forRoot({
		// 	redis: {
		// 		host: 'redis',
		// 		port: 6379,
		// 	},
		// }),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
