import {
	Box,
	Button,
	Center,
	ChakraProvider,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	List,
	ListItem,
	Text,
	theme,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { FormEvent, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3001')

interface Message {
	message: string
	email: string
}

export const App = () => {
	const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
	const [email, setEmail] = useState<string>('')
	const [rooms, setRooms] = useState<string[]>([])
	const [messages, setMessages] = useState<Message[]>([])
	const [currentRoom, setCurrentRoom] = useState('')
	const [message, setMessage] = useState('')
	const [roomInput, setRoomInput] = useState('')

	useEffect(() => {
		socket.on('newMessage', (jsonMsg: string) => {
			const msg = JSON.parse(jsonMsg) as Message
			setMessages((messages) => [...messages, msg])
		})
	}, [])

	const handleLogin = (e: FormEvent) => {
		e.preventDefault()
		socket.emit('login', email, (data: string[]) => {
			setRooms(data)
		})
	}

	const handleChangeRoom = (room: string) => {
		socket.emit(
			'joinRoom',
			{ newRoom: room, oldRoom: currentRoom },
			(data: string[]) => {
				const mapData = data.map((item) => JSON.parse(item))
				setMessages(mapData)
			}
		)
		setCurrentRoom(room)
	}

	const handleSendMsg = (e: FormEvent) => {
		e.preventDefault()
		socket.emit('messageToRoom', { text: message, email, room: currentRoom })
		setMessages([...messages, { message, email }])
		setMessage('')
	}

	const handleJoinNewRoom = async (e: FormEvent) => {
		e.preventDefault()
		await fetch(`http://localhost:3001/messages/${email}/${roomInput}`)
		alert(`join room ${roomInput} success`)
		setRoomInput('')
		setRooms((oldState) => [...oldState, roomInput])
	}

	return (
		<ChakraProvider theme={theme}>
			{rooms.length > 0 ? (
				<Flex maxW='100%' minH='100vh'>
					{/* Left panel */}
					<Box bgColor='blue.300' w='30%' py='10' px='4'>
						<Heading mb='8' size='lg'>
							Email: {email}
						</Heading>
						<form onSubmit={handleJoinNewRoom}>
							<FormControl>
								<FormLabel>Enter Room Name: </FormLabel>
								<Input
									type='text'
									value={roomInput}
									onChange={(e) => setRoomInput(e.target.value)}
								/>
							</FormControl>
							<Button type='submit' colorScheme='blue'>
								Join room
							</Button>
						</form>
						<Heading my='6'>List room: </Heading>
						<List spacing={4}>
							{rooms.map((room) => (
								<ListItem key={room}>
									<Button
										colorScheme={room === currentRoom ? 'teal' : ''}
										onClick={() => handleChangeRoom(room)}
									>
										{room}
									</Button>
								</ListItem>
							))}
						</List>
					</Box>
					{/* ENd Left panel */}
					<VStack
						w='70%'
						justifyContent='space-between'
						p='6'
						alignItems='flex-start'
					>
						<Box display={isOpen ? 'none' : 'block'}>
							<Button colorScheme='teal' onClick={onOpen}>
								Open
							</Button>
						</Box>
						{/* Messages */}
						<List spacing={2} w='100%'>
							{messages.map((message, index) => (
								<ListItem key={index} display='flex' justifyContent='left'>
									<Text mr='10'>{message.email}:</Text>
									<Text>{message.message}</Text>
								</ListItem>
							))}
						</List>
						{/* Form create message */}
						<form onSubmit={handleSendMsg}>
							<FormControl>
								<FormLabel>Send message</FormLabel>
								<Input
									type='text'
									value={message}
									onChange={(e) => setMessage(e.target.value)}
								/>
							</FormControl>
							<Button
								type='submit'
								disabled={!Boolean(currentRoom)}
								colorScheme='blue'
							>
								Send
							</Button>
						</form>
						{/* Form create message end */}
					</VStack>
				</Flex>
			) : (
				<Center>
					<form onSubmit={handleLogin}>
						<FormControl>
							<FormLabel>Enter Email: </FormLabel>
							<Input
								type='text'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</FormControl>
						<Button type='submit' colorScheme='blue'>
							Submit
						</Button>
					</form>
				</Center>
			)}
		</ChakraProvider>
	)
}
