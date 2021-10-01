import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

interface Configuration {
  port: number;

  orm: PostgresConnectionOptions;

  redis: {
    host: string;
    port: number;
  };

  jwt: {
    secret: string;
    expiresIn: number; // seconds
  };
}

const getString = (key: string, defaultValue: string): string => {
  return key in process.env ? process.env[key] : defaultValue;
};

const getNumber = (key: string, defaultValue: number): number => {
  return key in process.env ? +process.env[key] : defaultValue;
};

const getBool = (key: string, defaultValue: boolean): boolean => {
  return key in process.env ? process.env[key] === 'true' : defaultValue;
};

export default (): Configuration => ({
  port: getNumber('BACKEND_PORT', 8080),

  orm: {
    type: 'postgres',
    host: getString('DB_HOST', 'database'),
    port: getNumber('DB_PORT', 5432),
    database: getString('DB_NAME', 'cats'),
    username: getString('DB_USER', 'appuser'),
    password: getString('DB_PASS', 'appuser-pass!'),
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: getBool('DB_SYNCHRONIZE', true),
  },

  redis: {
    host: getString('REDIS_HOST', 'redis'),
    port: getNumber('REDIS_PORT', 6379),
  },

  jwt: {
    secret: getString('JWT_SECRET', 'jwt-secret!'),
    expiresIn: getNumber('JWT_EXPIRES_IN', 3600), //seconds
  },
});
