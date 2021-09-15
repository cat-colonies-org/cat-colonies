import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/users/entities/user.entity';
import { UsersService } from 'src/domain/users/users.service';
import { SeederService } from './seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [SeederService, UsersService],
})
export class SeederModule {}
