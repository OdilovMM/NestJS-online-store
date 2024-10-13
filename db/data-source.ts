/* eslint-disable prettier/prettier */
import {DataSource, DataSourceOptions} from 'typeorm';
import {config} from 'dotenv';
config()

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE,
    // entities: ['dist/**/*.entity{ts,.js}'],
    entities: ['dist/**/*.entity.js'],
    synchronize: false,
    migrations: ['dist/db/migrations/*{.ts,js}'],
    logging: false
  }

  const dataSource = new DataSource(dataSourceOptions)
  dataSource.initialize();
  export default dataSource;