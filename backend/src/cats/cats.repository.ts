import { Repository } from 'typeorm';
import { Cat } from './entities/cat.entity';

export class CatsRepository extends Repository<Cat> {}
