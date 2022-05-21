import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { RedisClientType } from 'redis'
import { CreateMessageDto } from './dto/create-message.dto'
import { UpdateMessageDto } from './dto/update-message.dto'
import { Message } from './entities/message.entity'

@Injectable()
export class MessagesService {
	constructor(@Inject('redis') private redis: RedisClientType) {}

	async login(email: string) {
		const rooms = await this.redis.lRange(email, 0, -1)
		if (!rooms) await this.redis.lPush(email, 'general')
		rooms.push('general')
		return rooms
	}

	async joinRooms(roomName: string) {
		const messages = await this.redis.lRange(roomName, 0, -1)
		return messages.reverse()
	}

	async createMessage(message: string, roomName: string, email: string) {
		const jsonMsg = JSON.stringify({ message, email })
		await this.redis.lPush(roomName, jsonMsg)
		return jsonMsg
	}

	findOne(id: number) {
		return `This action returns a #${id} message`
	}

	update(id: number, updateMessageDto: UpdateMessageDto) {
		return `This action updates a #${id} message`
	}

	remove(id: number) {
		return `This action removes a #${id} message`
	}
}
