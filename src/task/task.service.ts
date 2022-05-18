import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Cron, Interval } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { Queue } from 'bull'
import { getManager, Repository } from 'typeorm'
import { CreateTaskDto } from './dtos/create-task.dto'
import { Task } from './entities/task.entity'

@Injectable()
export class TaskService {
	constructor(
		@InjectRepository(Task) private taskRepo: Repository<Task>,
		@InjectQueue('task') private taskQueue: Queue
	) {}
	getAllTask() {
		return this.taskRepo.find()
	}

	createTask(createTaskDto: CreateTaskDto) {
		const task = this.taskRepo.create({
			content: createTaskDto.content,
			executesAt: new Date(Date.now() + createTaskDto.time),
		})
		return this.taskRepo.save(task)
	}

	@Interval(10000)
	async handleCron() {
		console.log('cron run')
		try {
			await getManager().transaction(async (manager) => {
				await manager.query('LOCK TABLE task IN ACCESS EXCLUSIVE MODE')
				const tasks = await manager
					.createQueryBuilder(Task, 'task')
					// .setLock('pessimistic_read')
					.where('task.executesAt <= now()')
					.getMany()
				// Add task to bull
				console.log(
					'process.env.NAME run in transaction :>> ',
					process.env.NAME
				)
				console.log('tasks :>> ', tasks)

				if (tasks.length < 1) {
					return
				}
				console.log('pass condition')
				this.taskQueue.addBulk([{ data: tasks }])
				// Delete task
				await manager.remove(tasks)
			})
		} catch (error) {
			console.log(error)
		}
	}
}
