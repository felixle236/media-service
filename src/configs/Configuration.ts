import * as dotenv from 'dotenv';
import { LogProvider, StorageProvider } from './ServiceProvider';
import { convertStringToBoolean } from '../libs/common';
dotenv.config();

// SYSTEM ENVIRONMENT

export const IS_DEVELOPMENT: boolean = process.env.NODE_ENV === 'development';

export const PROJECT_ID: string = process.env.PROJECT_ID ?? '';
export const PROJECT_NAME: string = process.env.PROJECT_NAME ?? '';

export const PROTOTYPE: string = process.env.PROTOTYPE ?? 'http';
export const DOMAIN: string = process.env.DOMAIN ?? 'localhost';

export const API_CACHING_EXPIRE_IN: number = process.env.API_CACHING_EXPIRE_IN ? Number(process.env.API_CACHING_EXPIRE_IN) : 0;

// API SERVICE

export const ENABLE_API_SERVICE: boolean = convertStringToBoolean(process.env.ENABLE_API_SERVICE);
export const API_PORT: number = Number(process.env.API_PORT);

// CONFIGURATION OF DATABASE

export const DB_TYPE: string = process.env.DB_TYPE ?? 'postgres';
export const DB_HOST: string = process.env.DB_HOST ?? 'localhost';
export const DB_PORT: number = process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432;
export const DB_NAME: string = process.env.DB_NAME ?? 'media';
export const DB_USER: string = process.env.DB_USER ?? 'postgres';
export const DB_PASS: string = process.env.DB_PASS ?? '123456';

// CONFIGURATION OF REDIS

export const REDIS_CONFIG_HOST: string = process.env.REDIS_CONFIG_HOST ?? 'localhost';
export const REDIS_CONFIG_PORT: number = process.env.REDIS_CONFIG_PORT ? Number(process.env.REDIS_CONFIG_PORT) : 6379;

// AUTHENTICATION

export const ADMIN_SECRET_KEY: string = process.env.ADMIN_SECRET_KEY ?? '';

// LOG SERVICE

export const LOG_PROVIDER: number = process.env.LOG_PROVIDER ? Number(process.env.LOG_PROVIDER) : LogProvider.CONSOLE;

// STORAGE SERVICE

export const STORAGE_PROVIDER: number = process.env.STORAGE_PROVIDER ? Number(process.env.STORAGE_PROVIDER) : StorageProvider.CONSOLE;

export const STORAGE_CONFIG_HOST: string = process.env.STORAGE_CONFIG_HOST ?? 'localhost';
export const STORAGE_CONFIG_PORT: number = process.env.STORAGE_CONFIG_PORT ? Number(process.env.STORAGE_CONFIG_PORT) : 9000;

export const ALLOW_DOCUMENT_FORMATS: string[] = process.env.ALLOW_DOCUMENT_FORMATS ? process.env.ALLOW_DOCUMENT_FORMATS.split('|') : [];
export const ALLOW_DOCUMENT_SIZE: number = process.env.ALLOW_DOCUMENT_SIZE ? Number(process.env.ALLOW_DOCUMENT_SIZE) : 0;

export const ALLOW_IMAGE_FORMATS: string[] = process.env.ALLOW_IMAGE_FORMATS ? process.env.ALLOW_IMAGE_FORMATS.split('|') : [];
export const ALLOW_IMAGE_SIZE: number = process.env.ALLOW_IMAGE_SIZE ? Number(process.env.ALLOW_IMAGE_SIZE) : 0;
export const ALLOW_IMAGE_WIDTH: number = process.env.ALLOW_IMAGE_WIDTH ? Number(process.env.ALLOW_IMAGE_WIDTH) : 0;
export const ALLOW_IMAGE_HEIGHT: number = process.env.ALLOW_IMAGE_HEIGHT ? Number(process.env.ALLOW_IMAGE_HEIGHT) : 0;

export const ALLOW_VIDEO_FORMATS: string[] = process.env.ALLOW_VIDEO_FORMATS ? process.env.ALLOW_VIDEO_FORMATS.split('|') : [];
export const ALLOW_VIDEO_SIZE: number = process.env.ALLOW_VIDEO_SIZE ? Number(process.env.ALLOW_VIDEO_SIZE) : 0;

export const MINIO_ACCESS_KEY: string = process.env.MINIO_ACCESS_KEY ?? '';
export const MINIO_SECRET_KEY: string = process.env.MINIO_SECRET_KEY ?? '';
export const IS_USE_SSL_MINIO: boolean = convertStringToBoolean(process.env.IS_USE_SSL_MINIO);

export const S3_REGION: string = process.env.S3_REGION ?? 'ap-southeast-1';
export const S3_ACCESS_KEY: string = process.env.S3_ACCESS_KEY ?? '';
export const S3_SECRET_KEY: string = process.env.S3_SECRET_KEY ?? '';

export const STORAGE_URL: string = STORAGE_PROVIDER === StorageProvider.MINIO
    ? `http://${STORAGE_CONFIG_HOST}` + (STORAGE_CONFIG_PORT === 80 ? '' : `:${STORAGE_CONFIG_PORT}`)
    : STORAGE_PROVIDER === StorageProvider.AWS_S3 ? `https://s3.${S3_REGION}.amazonaws.com` : 'http://localhost';
