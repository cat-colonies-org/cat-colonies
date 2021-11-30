import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCeaseCause } from './entities/user-cease-cause.entity';
import { UserCeaseCausesResolver } from './user-cease-causes.resolver';
import { UserCeaseCausesService } from './user-cease-causes.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserCeaseCause])],
  providers: [UserCeaseCausesResolver, UserCeaseCausesService],
})
export class UserCeaseCausesModule {}
