import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

const config: PostgresConnectionOptions = {
	type: 'postgres',
	host: process.env.DB_HOST,
	port: +process.env.PORT,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	entities: ['**/*.entity.js'],
	synchronize: true,
	migrationsRun: false,
	migrations: ['dist/src/migrations/*.js'],
	cli: {
		migrationsDir: 'src/migrations',
	},
}

export default config
