import { Controller, Get, Inject, Param } from '@nestjs/common'
import { RedisClientType } from 'redis'
import { MessagesService } from './messages.service'

@Controller('messages')
export class MessagesController {
	constructor(@Inject('redis') private redis: RedisClientType, private messageService: MessagesService) {}

	@Get('/:email/:room')
	addRoom(@Param() params: any) {
		const { email, room } = params
    return this.messageService.addRoom(email, room)
	}
}
