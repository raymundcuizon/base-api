import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [
            __dirname + '/../**/*.entity{.ts,.js}',
        ],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];

// STAGE
// PORT
// DB_HOST
// DB_PORT
// DB_USERNAME
// DB_PASSWORD
// DB_DATABASE
// JWT_SECRET


// type: 'mysql',
// host: process.env.MYSQL_HOST,
// port: Number(process.env.MYSQL_PORT),
// username: process.env.MYSQL_USERNAME,
// password: process.env.MYSQL_PASSWORD,
// database: process.env.MYSQL_DATABASE,
// entities: [
//     __dirname + '/../**/*.entity{.ts,.js}',
// ],
// synchronize: true,