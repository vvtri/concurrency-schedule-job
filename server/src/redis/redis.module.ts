import { DynamicModule, Module } from '@nestjs/common'
import { createClient, RedisClientOptions } from 'redis'

@Module({})
export class RedisModule {
	static async register(options?: RedisClientOptions): Promise<DynamicModule> {
		const client = createClient(options)
		await client.connect()
		return {
			module: RedisModule,
			providers: [
				{
					provide: 'redis',
					useValue: client,
				},
			],
			exports: ['redis'],
			global: true,
		}
	}
}
