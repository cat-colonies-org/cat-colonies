interface Configuration {
  port: number;
  database: {
    name: string;
    host: string;
    port: number;
    user: string;
    password: string;
  };
  redis: {
    host: string;
    port: number;
  };
}

export default (): Configuration => ({
  port: 8080,
  database: {
    host: 'database',
    port: 5432,
    user: 'appuser',
    password: 'appuser-pass!',
    name: 'cats',
  },
  redis: {
    host: 'redis',
    port: 6379,
  },
});
