import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Annotation } from 'src/cats/entities/annotation.entity';
import { Cat } from 'src/cats/entities/cat.entity';
import { CeaseCause } from 'src/cats/entities/cease-cause.entity';
import { Coat } from 'src/cats/entities/coat.entity';
import { Eyes } from 'src/cats/entities/eyes.entity';
import { Colony } from 'src/colonies/entities/colony.entity';
import { Environment } from 'src/colonies/entities/environment.entity';
import { Town } from 'src/towns/entities/town.entity';
import { User } from 'src/users/entities/user.entity';
import { SeederService } from './seeder.service';

@Module({
  providers: [SeederService],
})
export class SeederModule {}
