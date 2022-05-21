import { Module } from '@nestjs/common'
import { TaskService } from './task.service'
import { TaskController } from './task.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Task } from './entities/task.entity'
import { BullModule } from '@nestjs/bull'
import { TaskProcessor } from './task.processor'

@Module({
	imports: [
		TypeOrmModule.forFeature([Task]),
		BullModule.registerQueue({
			name: 'task',
		}),
	],
	controllers: [TaskController],
	providers: [TaskService, TaskProcessor],
})
export class TaskModule {}
