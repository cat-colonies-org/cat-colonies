interface Configuration {
  port: number;

  database: {
    name: string;
    host: string;
    port: number;
    user: string;
    password: string;
    synchronize: boolean;
  };

  redis: {
    host: string;
    port: number;
  };
}

const getBool = (key: string, defaultValue: boolean): boolean => {
  return typeof process.env[key] === 'string' ? process.env[key] === 'true' : defaultValue;
};

const getNumber = (key: string, defaultValue: number): number => {
  return typeof process.env[key] === 'string' ? +process.env[key] : defaultValue;
};

export default (): Configuration => ({
  port: getNumber(process.env.PORT, 8080),
  database: {
    host: process.env.DB_HOST || 'database',
    port: getNumber(process.env.DB_PORT, 5432),
    user: process.env.DB_USER || 'appuser',
    password: process.env.DB_PASS || 'appuser-pass!',
    name: process.env.DB_NAME || 'cats',
    synchronize: getBool('DB_SYNCHRONIZE', true),
  },
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: getNumber(process.env.REDIS_PORT, 6379),
  },
});
