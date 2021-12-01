import { Module } from '@nestjs/common';
import { ColoniesService } from './colonies.service';
import { ColoniesResolver } from './colonies.resolver';
import { Colony } from './entities/colony.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Colony]), UsersModule],
  providers: [ColoniesResolver, ColoniesService],
})
export class ColoniesModule {}
