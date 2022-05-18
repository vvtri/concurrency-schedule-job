import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'

@Processor('task')
export class TaskProcessor {
	@Process()
	async doSth(job: Job) {
		console.log(
			`processing job :>> in ${process.env.NAME}, job: `,
			job.data.content
		)
	}
}
