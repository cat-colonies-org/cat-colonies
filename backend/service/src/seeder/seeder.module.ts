import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Module({
  providers: [SeederService],
})
export class SeederModule {}
