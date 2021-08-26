import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'database',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASS || 'appuser-pass!',
  database: process.env.DB_NAME || 'cats',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
};

export default config;
