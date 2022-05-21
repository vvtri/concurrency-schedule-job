import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'task' })
export class Task {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'timestamptz' })
	executesAt: Date

	@Column()
	content: string
}
