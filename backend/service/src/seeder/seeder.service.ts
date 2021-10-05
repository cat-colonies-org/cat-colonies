import { Annotation } from 'src/domain/annotations/entities/annotation.entity';
import { Environment } from 'src/domain/environments/entities/environment.entity';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Town } from 'src/domain/towns/entities/town.entity';
import { Color } from 'src/domain/colors/entities/color.entity';
import { Pattern } from 'src/domain/patterns/entities/pattern.entity';
import { EyeColor } from 'src/domain/eye-colors/entities/eye-color.entity';
import { CeaseCause } from 'src/domain/cease-causes/entities/cease-cause.entity';
import { LocationType } from 'src/domain/location-types/entities/location-type.entity';
import { Colony } from 'src/domain/colonies/entities/colony.entity';
import { Cat, Gender } from 'src/domain/cats/entities/cat.entity';
import { UsersService } from 'src/domain/users/users.service';
import { Role, Roles } from 'src/domain/roles/entities/role.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}
  async onModuleInit() {
    // Do nothing if database isn't empty
    if ((await this.usersService.count()) > 0) return;

    return;

    await this.seedTowns();
    await this.seedRoles();
    await this.seedLocationTypes();
    await this.seedEnvironments();
    await this.seedColonies();

    await this.seedColors();
    await this.seedPatterns();
    await this.seedEyeColors();
    await this.seedCeaseCauses();
    await this.seedCats();

    await this.seedAnnotations();

    await this.seedUsers();
  }

  private async seedTowns(): Promise<any> {
    return Promise.all([
      Town.create({ id: 1, name: 'Alicante' }).save(),
      Town.create({ id: 2, name: 'Albatera' }).save(),
      Town.create({ id: 3, name: 'Alhama de Granada' }).save(),
      Town.create({ id: 4, name: 'Almoradí' }).save(),
    ]);
  }

  private async seedRoles(): Promise<any> {
    return Promise.all([
      Role.create({ id: Roles.Administrator, description: 'Administrador' }).save(),
      Role.create({ id: Roles.Manager, description: 'Gestor' }).save(),
    ]);
  }

  private async seedColors(): Promise<any> {
    return Promise.all([
      Color.create({ id: 1, description: 'Negro' }).save(),
      Color.create({ id: 2, description: 'Rojo' }).save(),
      Color.create({ id: 3, description: 'Azul' }).save(),
      Color.create({ id: 4, description: 'Chocolate' }).save(),
      Color.create({ id: 5, description: 'Blanco' }).save(),
      Color.create({ id: 6, description: 'Crema' }).save(),
      Color.create({ id: 7, description: 'Gris' }).save(),
      Color.create({ id: 8, description: 'Tricolor' }).save(),
      Color.create({ id: 9, description: 'Tricolor diluído' }).save(),
    ]);
  }

  private async seedPatterns(): Promise<any> {
    return Promise.all([
      Pattern.create({ id: 1, description: 'Sólido' }).save(),
      Pattern.create({ id: 2, description: 'Tabby' }).save(),
      Pattern.create({ id: 3, description: 'Punteado' }).save(),
      Pattern.create({ id: 4, description: 'Particolor' }).save(),
      Pattern.create({ id: 5, description: 'Point' }).save(),
      Pattern.create({ id: 6, description: 'Carey' }).save(),
      Pattern.create({ id: 7, description: 'Cálico' }).save(),
    ]);
  }

  private async seedEyeColors(): Promise<any> {
    return Promise.all([
      EyeColor.create({ id: 1, description: 'Ojos 1' }).save(),
      EyeColor.create({ id: 2, description: 'Ojos 2' }).save(),
      EyeColor.create({ id: 3, description: 'Ojos 3' }).save(),
      EyeColor.create({ id: 4, description: 'Ojos 4' }).save(),
    ]);
  }

  private async seedCeaseCauses(): Promise<any> {
    return Promise.all([
      CeaseCause.create({ id: 1, description: 'Adoptado' }).save(),
      CeaseCause.create({ id: 2, description: 'Desaparecido' }).save(),
      CeaseCause.create({ id: 3, description: 'Atropellado' }).save(),
      CeaseCause.create({ id: 4, description: 'Abducido' }).save(),
    ]);
  }

  private async seedLocationTypes(): Promise<any> {
    return Promise.all([
      LocationType.create({ id: 1, description: 'Solar privado' }).save(),
      LocationType.create({ id: 2, description: 'Campo' }).save(),
    ]);
  }

  private async seedEnvironments(): Promise<any> {
    return Promise.all([
      Environment.create({ id: 1, description: 'Urbano' }).save(),
      Environment.create({ id: 2, description: 'Periferia' }).save(),
    ]);
  }

  private async seedColonies(): Promise<any> {
    return Promise.all([
      Colony.create({
        id: 1,
        createdAt: new Date(),
        address: 'calle 1',
        locationTypeId: 1,
        environmentId: 1,
        townId: 1,
      }).save(),
      Colony.create({
        id: 2,
        createdAt: new Date(),
        address: 'calle 2',
        locationTypeId: 2,
        environmentId: 2,
        townId: 2,
      }).save(),
      Colony.create({
        id: 3,
        createdAt: new Date(),
        address: 'calle 3',
        locationTypeId: 1,
        environmentId: 1,
        townId: 3,
      }).save(),
      Colony.create({
        id: 4,
        createdAt: new Date(),
        address: 'calle 4',
        locationTypeId: 2,
        environmentId: 2,
        townId: 4,
      }).save(),
    ]);
  }

  private async seedCats(): Promise<any> {
    return Promise.all([
      Cat.create({
        id: 1,
        createdAt: new Date(),
        sterilized: true,
        sterilizedAt: new Date(),
        bornAt: new Date('2015-03-03'),
        colonyId: 1,
        patternId: 1,
        gender: Gender.Male,
      }).save(),
      Cat.create({
        id: 2,
        createdAt: new Date(),
        sterilized: false,
        bornAt: new Date('2020-03-02'),
        colonyId: 1,
        patternId: 1,
        gender: Gender.Female,
      }).save(),
      Cat.create({
        id: 3,
        createdAt: new Date(),
        sterilized: false,
        bornAt: new Date('2016-01-03'),
        colonyId: 2,
        patternId: 2,
        gender: Gender.Male,
        eyeColorId: 2,
      }).save(),
      Cat.create({
        id: 4,
        createdAt: new Date(),
        sterilized: true,
        bornAt: new Date('2021-07-09'),
        colonyId: 3,
        patternId: 1,
        gender: Gender.Female,
      }).save(),
      Cat.create({
        id: 5,
        createdAt: new Date(),
        sterilized: true,
        bornAt: new Date('2017-06-22'),
        colonyId: 4,
        patternId: 1,
        ceasedAt: new Date(),
        ceaseCauseId: 1,
        gender: Gender.Male,
        eyeColorId: 1,
      }).save(),
      Cat.create({
        id: 6,
        createdAt: new Date(),
        sterilized: false,
        bornAt: new Date('2021-09-03'),
        colonyId: 2,
        patternId: 2,
        ceasedAt: null,
        ceaseCauseId: null,
        gender: Gender.Female,
        eyeColorId: 2,
      }).save(),
      Cat.create({
        id: 7,
        createdAt: new Date(),
        sterilized: false,
        bornAt: new Date('2018-05-15'),
        colonyId: 2,
        patternId: 3,
        ceasedAt: null,
        ceaseCauseId: null,
        gender: Gender.Female,
        eyeColorId: 1,
      }).save(),
      Cat.create({
        id: 8,
        createdAt: new Date(),
        sterilized: false,
        bornAt: new Date('2019-05-01'),
        colonyId: 2,
        patternId: 1,
        ceasedAt: null,
        ceaseCauseId: null,
        gender: Gender.Male,
        eyeColorId: 1,
      }).save(),
      Cat.create({
        id: 9,
        createdAt: new Date(),
        sterilized: true,
        bornAt: new Date('2021-08-01'),
        colonyId: 4,
        patternId: 2,
        ceasedAt: new Date(),
        ceaseCauseId: 2,
        gender: Gender.Male,
        eyeColorId: 3,
      }).save(),
      Cat.create({
        id: 10,
        createdAt: new Date(),
        sterilized: false,
        bornAt: new Date('2020-05-15'),
        colonyId: 2,
        patternId: 1,
        ceasedAt: new Date(),
        ceaseCauseId: 3,
        gender: Gender.Male,
        eyeColorId: 3,
      }).save(),
      Cat.create({
        id: 11,
        createdAt: new Date(),
        sterilized: true,
        bornAt: new Date('2021-05-15'),
        colonyId: 4,
        patternId: 4,
        ceasedAt: undefined,
        ceaseCauseId: undefined,
        gender: Gender.Female,
        eyeColorId: 4,
      }).save(),
    ]);
  }

  private async seedAnnotations(): Promise<any> {
    return Promise.all([
      Annotation.create({ id: 1, catId: 1, annotation: 'Este gato es feo', date: new Date() }).save(),
      Annotation.create({ id: 2, catId: 1, annotation: 'Pero es majo', date: new Date() }).save(),
      Annotation.create({ id: 3, catId: 2, annotation: 'este gato es bonito', date: new Date() }).save(),
      Annotation.create({ id: 4, catId: 2, annotation: 'Pero es más malo que un demoio', date: new Date() }).save(),
      Annotation.create({ id: 5, catId: 3, annotation: 'Este es el gato 3', date: new Date() }).save(),
      Annotation.create({ id: 6, catId: 3, annotation: 'Otra anotación para el gato 3', date: new Date() }).save(),
    ]);
  }

  private async seedUsers(): Promise<any> {
    const colonies = await Colony.find();

    return Promise.all([
      this.usersService.create({
        name: 'Agapito',
        surnames: 'Perez Ferrera',
        idCard: '11111111A',
        phoneNumber: 123123123,
        email: 'agapito@cats.org',
        password: '123456',
        colonies: Promise.resolve([colonies[0]]),
        roleId: Roles.Administrator,
      }),
      this.usersService.create({
        name: 'Matilde',
        surnames: 'Modesta Salmeron',
        idCard: '22222222B',
        phoneNumber: 456456456,
        email: 'matilde@cats.org',
        password: '654321',
        colonies: Promise.resolve([colonies[1]]),
        roleId: Roles.Manager,
      }),
      this.usersService.create({
        name: 'Juan',
        surnames: 'Sanchez Brei',
        idCard: '33333333C',
        phoneNumber: 789789789,
        email: 'juan@cats.org',
        password: 'password',
        colonies: Promise.resolve([colonies[2], colonies[1]]),
        roleId: Roles.Manager,
      }),
      this.usersService.create({
        name: 'Maria',
        surnames: 'del Amor Hermoso',
        idCard: '44444444D',
        phoneNumber: 135135135,
        email: 'maria@cats.org',
        password: 'drowssap',
        roleId: Roles.Manager,
      }),
      this.usersService.create({
        name: 'Apolonio',
        surnames: 'García Serrano',
        idCard: '55555555E',
        phoneNumber: 246246246,
        email: 'apolonio@cats.org',
        password: '03/06/1978',
        colonies: Promise.resolve([colonies[3]]),
        roleId: Roles.Manager,
      }),
    ]);
  }
}
