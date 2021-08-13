import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'database',
  port: 5432,
  username: 'appuser',
  password: 'appuser-pass!',
  database: 'cats',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};

export default config;
