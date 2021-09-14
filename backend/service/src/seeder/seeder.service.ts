import { Annotation } from 'src/domain/annotations/entities/annotation.entity';
import { Environment } from 'src/domain/environments/entities/environment.entity';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Town } from 'src/domain/towns/entities/town.entity';
import { User } from 'src/domain/users/entities/user.entity';
import { Color } from 'src/domain/colors/entities/color.entity';
import { Pattern } from 'src/domain/patterns/entities/pattern.entity';
import { EyeColor } from 'src/domain/eye-colors/entities/eye-color.entity';
import { CeaseCause } from 'src/domain/cease-causes/entities/cease-cause.entity';
import { LocationType } from 'src/domain/location-types/entities/location-type.entity';
import { Colony } from 'src/domain/colonies/entities/colony.entity';
import { Cat, Gender } from 'src/domain/cats/entities/cat.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  async onModuleInit() {
    await this.seedUsers();

    await this.seedTowns();
    await this.seedLocationTypes();
    await this.seedEnvironments();
    await this.seedColonies();

    await this.seedColors();
    await this.seedPatterns();
    await this.seedEyeColors();
    await this.seedCeaseCauses();
    await this.seedCats();

    await this.seedAnnotations();
  }

  private async seedTowns(): Promise<any> {
    return Promise.all([
      Town.create({ id: 1, name: 'Alicante' }).save(),
      Town.create({ id: 2, name: 'Albatera' }).save(),
      Town.create({ id: 3, name: 'Alhama de Granada' }).save(),
      Town.create({ id: 4, name: 'Almoradí' }).save(),
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
        birthYear: 2015,
        colonyId: 1,
        colorId: 1,
        patternId: 1,
        gender: Gender.Male,
        imageURL:
          'https://external-content.duckduckgo.com' +
          '/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.ueMqYHUuxXOm8RK_rHF62AHaHa%26pid%3DApi&f=1',
      }).save(),
      Cat.create({
        id: 2,
        createdAt: new Date(),
        sterilized: false,
        birthYear: 2016,
        colonyId: 1,
        colorId: 1,
        patternId: 1,
        gender: Gender.Female,
        imageURL:
          'https://external-content.duckduckgo.com' +
          '/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.ORcvmgw3Me7_C19XHykrrgAAAA%26pid%3DApi&f=1',
      }).save(),
      Cat.create({
        id: 3,
        createdAt: new Date(),
        sterilized: false,
        birthYear: 2017,
        colonyId: 2,
        colorId: 2,
        patternId: 2,
        gender: Gender.Male,
        eyeColorId: 2,
        imageURL:
          'https://external-content.duckduckgo.com' +
          '/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.lU48EMNgLJdqviTM8MuYiQAAAA%26pid%3DApi&f=1',
      }).save(),
      Cat.create({
        id: 4,
        createdAt: new Date(),
        sterilized: true,
        birthYear: 2017,
        colonyId: 3,
        colorId: 1,
        patternId: 1,
        gender: Gender.Female,
        kitten: true,
        imageURL:
          'https://external-content.duckduckgo.com' +
          '/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.hevumcN2wlrp8oR0FunK7wAAAA%26pid%3DApi&f=1',
      }).save(),
      Cat.create({
        id: 5,
        createdAt: new Date(),
        sterilized: true,
        birthYear: 2017,
        colonyId: 4,
        colorId: 1,
        patternId: 1,
        ceasedAt: new Date(),
        ceaseCauseId: 1,
        gender: Gender.Male,
        eyeColorId: 1,
        imageURL: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.imgur.com%2FxPy88y5.png&f=1&nofb=1',
      }).save(),
      Cat.create({
        id: 6,
        createdAt: new Date(),
        sterilized: false,
        birthYear: 2021,
        colonyId: 2,
        colorId: 2,
        patternId: 2,
        ceasedAt: null,
        ceaseCauseId: null,
        gender: Gender.Female,
        eyeColorId: 2,
        imageURL:
          'https://external-content.duckduckgo.com' +
          '/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FF1ZpwvdjHQQ%2Fhqdefault.jpg&f=1&nofb=1',
      }).save(),
      Cat.create({
        id: 7,
        createdAt: new Date(),
        sterilized: false,
        birthYear: 2022,
        colonyId: 2,
        colorId: 3,
        patternId: 3,
        ceasedAt: null,
        ceaseCauseId: null,
        gender: Gender.Female,
        eyeColorId: 1,
        imageURL:
          'https://external-content.duckduckgo.com' +
          '/iu/?u=https%3A%2F%2Fi1.wp.com%2Fwww.techjunkie.com%2Fwp-content%2Fuploads%2F2018%2F02%2Fsmiling-kitten.jpg',
      }).save(),
      Cat.create({
        id: 8,
        createdAt: new Date(),
        sterilized: false,
        birthYear: 2022,
        colonyId: 2,
        colorId: 3,
        patternId: 1,
        ceasedAt: null,
        ceaseCauseId: null,
        gender: Gender.Male,
        eyeColorId: 1,
        imageURL:
          'https://external-content.duckduckgo.com' +
          '/iu/?u=https%3A%2F%2Fmedia.giphy.com%2Fmedia%2F1HKaikaFqDt7i%2Fgiphy.gif&f=1&nofb=1',
      }).save(),
      Cat.create({
        id: 9,
        createdAt: new Date(),
        sterilized: true,
        birthYear: 2024,
        colonyId: 4,
        colorId: 1,
        patternId: 2,
        ceasedAt: new Date(),
        ceaseCauseId: 2,
        gender: Gender.Male,
        eyeColorId: 3,
        imageURL:
          'https://external-content.duckduckgo.com' + '/iu/?u=https%3A%2F%2Fi.imgflip.com%2F2%2Fna5r3.jpg&f=1&nofb=1',
      }).save(),
      Cat.create({
        id: 10,
        createdAt: new Date(),
        sterilized: false,
        birthYear: 2025,
        colonyId: 2,
        colorId: 3,
        patternId: 1,
        ceasedAt: new Date(),
        ceaseCauseId: 3,
        gender: Gender.Male,
        eyeColorId: 3,
        imageURL:
          'https://external-content.duckduckgo.com' +
          '/iu/?u=https%3A%2F%2Fpixel.nymag.com' +
          '%2Fimgs%2Fdaily%2Fvulture%2F2016%2F09%2F29%2F29-grumpy-cat.w190.h190.jpg&f=1&nofb=1',
      }).save(),
      Cat.create({
        id: 11,
        createdAt: new Date(),
        sterilized: true,
        birthYear: 1999,
        colonyId: 4,
        colorId: 4,
        patternId: 4,
        ceasedAt: undefined,
        ceaseCauseId: undefined,
        gender: Gender.Female,
        eyeColorId: 4,
        imageURL:
          'https://external-content.duckduckgo.com' + '/iu/?u=https%3A%2F%2Fi.imgflip.com%2F2%2F7w4oz.jpg&f=1&nofb=1',
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
    return Promise.all([
      User.create({
        id: 1,
        name: 'Agapito',
        surnames: 'Perez Ferrera',
        idCard: '11111111A',
        phoneNumber: 123123123,
        email: 'agapito@cats.org',
        createdAt: new Date(),
        password: '123456',
      }).save(),
      User.create({
        id: 2,
        name: 'Matilde',
        surnames: 'Modesta Salmeron',
        idCard: '22222222B',
        phoneNumber: 456456456,
        email: 'matilde@cats.org',
        createdAt: new Date(),
        password: '654321',
      }).save(),
      User.create({
        id: 3,
        name: 'Juan',
        surnames: 'Sanchez Brei',
        idCard: '33333333C',
        phoneNumber: 789789789,
        email: 'juan@cats.org',
        createdAt: new Date(),
        password: 'password',
      }).save(),
      User.create({
        id: 4,
        name: 'Maria',
        surnames: 'del Amor Hermoso',
        idCard: '44444444D',
        phoneNumber: 135135135,
        email: 'maria@cats.org',
        createdAt: new Date(),
        password: 'drowssap',
      }).save(),
      User.create({
        id: 5,
        name: 'Apolonio',
        surnames: 'García Serrano',
        idCard: '55555555E',
        phoneNumber: 246246246,
        email: 'apolonio@cats.org',
        createdAt: new Date(),
        password: '03/06/1978',
      }).save(),
    ]);
  }
}
