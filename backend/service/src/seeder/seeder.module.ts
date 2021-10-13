import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/users/entities/user.entity';
import { UsersModule } from 'src/domain/users/users.module';
import { SeederService } from './seeder.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([User])],
  providers: [SeederService],
})
export class SeederModule {}
