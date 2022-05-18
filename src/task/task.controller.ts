import { Body, Controller, Get, Post } from '@nestjs/common'
import { CreateTaskDto } from './dtos/create-task.dto'
import { TaskService } from './task.service'

@Controller('task')
export class TaskController {
	constructor(private readonly taskService: TaskService) {}

	@Get()
	getAllTask() {
		return this.taskService.getAllTask()
	}

	@Post()
	createTask(@Body() body: CreateTaskDto) {
		return this.taskService.createTask(body)
	}
}
