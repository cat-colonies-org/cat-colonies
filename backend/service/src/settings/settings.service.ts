import { Injectable } from '@nestjs/common';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class Settings {
  port: number;

  orm: PostgresConnectionOptions;

  redis: {
    host: string;
    port: number;
  };

  auth: {
    jwtSecret: string;
    jwtExpiresIn: number; // seconds
    saltRounds: number;
  };

  pictures: {
    bucket: string;
    thumbnail: {
      width: number;
      height: number;
    };
  };

  storage: {
    endPoint: string;
    port: number;
    ssl: boolean;
    region: string;
    accessKey: string;
    secretKey: string;
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

@Injectable()
export class SettingsService extends Settings {
  constructor() {
    super();

    this.port = getNumber('BACKEND_PORT', 8080);

    this.orm = {
      type: 'postgres',
      host: getString('DB_HOST', 'database'),
      port: getNumber('DB_PORT', 5432),
      database: getString('DB_NAME', 'cats'),
      username: getString('DB_USER', 'appuser'),
      password: getString('DB_PASS', 'appuser-pass!'),
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: getBool('DB_SYNCHRONIZE', true),
    };

    this.redis = {
      host: getString('REDIS_HOST', 'redis'),
      port: getNumber('REDIS_PORT', 6379),
    };

    this.auth = {
      jwtSecret: getString('JWT_SECRET', 'jwt-secret!'),
      jwtExpiresIn: getNumber('JWT_EXPIRES_IN', 3600), //seconds
      saltRounds: getNumber('SALT_ROUNDS', 10),
    };

    this.pictures = {
      bucket: getString('PICTURES_BUCKET', 'pictures'),
      thumbnail: {
        width: getNumber('THUMBNAIL_WIDTH', 160),
        height: getNumber('THUMBNAIL_HEIGHT', 108),
      },
    };

    this.storage = {
      endPoint: getString('STORAGE_ENDPOINT', 'storage'),
      port: getNumber('STORAGE_PORT', 9000),
      ssl: getBool('STORAGE_SSL', false),
      region: '',
      accessKey: getString('STORAGE_ACCESS_KEY', 'AKIAIOSFODNN7EXAMPLE'),
      secretKey: getString('STORAGE_SECRET_KEY', 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'),
    };
  }
}

export default SettingsService;
