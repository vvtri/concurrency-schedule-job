import {
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
	WebSocketServer,
	ConnectedSocket,
} from '@nestjs/websockets'
import { MessagesService } from './messages.service'
import { UpdateMessageDto } from './dto/update-message.dto'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
	cors: {
		origin: '*',
		credentials: true,
	},
})
export class MessagesGateway {
	@WebSocketServer()
	server: Server

	constructor(private readonly messagesService: MessagesService) {}

	@SubscribeMessage('login')
	login(@MessageBody() email: string) {
		return this.messagesService.login(email)
	}

	@SubscribeMessage('joinRoom')
	async joinRoom(
		@MessageBody('newRoom') roomName: string,
		@ConnectedSocket() client: Socket,
		@MessageBody('oldRoom') oldRoom?: string,
	) {
		const messages = await this.messagesService.joinRooms(roomName)
		if (oldRoom) client.leave(oldRoom)
		client.join(roomName)
		return messages
	}

	@SubscribeMessage('messageToRoom')
	async createMessage(
		@MessageBody('text') text: string,
		@MessageBody('email') email: string,
		@MessageBody('room') room: string,
		@ConnectedSocket() client: Socket
	) {
		const jsonMsg = await this.messagesService.createMessage(text, room, email)
		console.log('room', room)
		client.to(room).emit('newMessage', jsonMsg)
		return jsonMsg
	}

	// Soft delete
	@SubscribeMessage('findOneMessage')
	findOne(@MessageBody() id: number) {
		return this.messagesService.findOne(id)
	}

	@SubscribeMessage('updateMessage')
	update(@MessageBody() updateMessageDto: UpdateMessageDto) {
		return this.messagesService.update(updateMessageDto.id, updateMessageDto)
	}

	@SubscribeMessage('removeMessage')
	remove(@MessageBody() id: number) {
		return this.messagesService.remove(id)
	}
}
