// import * as dotenv from 'dotenv'
// dotenv.config({
// 	path: '.env',
// })

import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import config from '../ormconfig'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TaskModule } from './task/task.module'

@Module({
	imports: [
		TypeOrmModule.forRoot(config),
		TaskModule,
		ScheduleModule.forRoot(),
		BullModule.forRoot({
			redis: {
				host: 'redis',
				port: 6379,
			},
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
