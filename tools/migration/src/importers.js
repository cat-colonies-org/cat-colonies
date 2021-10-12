const util = require('util');
const CSVToJSON = require('csvtojson');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const { v4: uuid } = require('uuid');

const {
  strToDate,
  strToGender,
  strToSterilized,
  birthYearToBornAt,
  strToCeaseCauseId,
  strToEyeColorId,
  strToLocationType,
  strToEnvironment,
  strToColorId,
  strToPatternId,
} = require('./mappers');

const MDB_PATH = './data/CENSO COLONIAS FELINAS ALBATERA.accdb';

const capitalize = (str) => {
  return str
    ?.toLocaleLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
    .join(' ');
};

const importTowns = async () => {
  return Promise.resolve([{ id: 1, name: 'Albatera' }]);
};

const importRoles = async () => {
  return Promise.resolve([
    { id: 1, description: 'Administrador' },
    { id: 2, description: 'Gestor' },
  ]);
};

const importLocationTypes = async () => {
  return Promise.resolve([
    { id: 0, description: 'Desconocido' },
    { id: 1, description: 'Solar privado' },
    { id: 2, description: 'Solar público' },
    { id: 3, description: 'Centro educativo' },
    { id: 4, description: 'Campo' },
  ]);
};

const importEnvironments = async () => {
  return Promise.resolve([
    { id: 0, description: 'Desconocido' },
    { id: 1, description: 'Urbano' },
    { id: 2, description: 'Perifería' },
    { id: 3, description: 'Selecciona' },
  ]);
};

const importCeaseCauses = async () => {
  return Promise.resolve([
    { id: 0, description: 'Desconocido' },
    { id: 1, description: 'Desaparición' },
    { id: 2, description: 'Atropello' },
    { id: 3, description: 'Adopción' },
    { id: 4, description: 'Acogida' },
    { id: 5, description: 'Eutanasia' },
  ]);
};

const importEyeColors = async () => {
  return Promise.resolve([
    { id: 0, description: 'Desconocido' },
    { id: 1, description: 'Amarillo' },
    { id: 2, description: 'Ambar' },
    { id: 3, description: 'Azul' },
    { id: 4, description: 'Gris' },
    { id: 5, description: 'Marrón' },
    { id: 6, description: 'Miel' },
    { id: 7, description: 'Verde' },
  ]);
};

const importColors = async () => {
  return Promise.resolve([
    { id: 0, description: 'Desconocido' },
    { id: 1, description: 'Atigrado' },
    { id: 2, description: 'Atigrado diluído' },
    { id: 3, description: 'Azul' },
    { id: 4, description: 'Blanco' },
    { id: 5, description: 'Calico' },
    { id: 6, description: 'Canela' },
    { id: 7, description: 'Carey' },
    { id: 8, description: 'Carey diluído' },
    { id: 9, description: 'Chocolate' },
    { id: 10, description: 'Crema' },
    { id: 11, description: 'Gris' },
    { id: 12, description: 'Negro' },
    { id: 13, description: 'Rojo' },
  ]);
};

const importPatterns = async () => {
  return Promise.resolve([
    { id: 0, description: 'Desconocido' },
    { id: 1, description: 'Particolor' },
    { id: 2, description: 'Point' },
    { id: 3, description: 'Sólido' },
    { id: 4, description: 'Tabby' },
    { id: 5, description: 'Tricolor' },
  ]);
};

const importPictures = async (path) => {
  const files = fs.readdirSync(path);

  let counter = 1;

  return files
    .filter((file) => file.includes('.jpg'))
    .map((file) => {
      const id = uuid();
      const catId = file.split('_')[0];
      const image = `${catId}-${id}.jpg`;
      const thumbnail = `${catId}-${id}-thumb.png`;

      return {
        id: counter++,
        catId,
        createdAt: new Date(),
        originalFilename: file,
        image,
        thumbnail,
      };
    });
};

const importCats = async () => {
  const { stdout } = await exec(`mdb-export "${MDB_PATH}" gatos`);

  return (await CSVToJSON().fromString(stdout)).map((mdbCat) => {
    // 'IMÁGEN': '48',
    return {
      id: +mdbCat['Id GATO'],
      colonyId: +mdbCat['Id Colonia'],
      createdAt: strToDate(mdbCat['Fecha Alta']),
      bornAt: birthYearToBornAt(mdbCat['AÑO NACIDO']),
      ceasedAt: strToDate(mdbCat['BAJA']),
      ceaseCauseId: strToCeaseCauseId(mdbCat['CAUSA']),
      esterilized: strToSterilized(mdbCat['ESTERIL']),
      gender: strToGender(mdbCat['SEXO']),
      eyeColorId: strToEyeColorId(mdbCat['OJOS']),
      // colorId: strToColorId(mdbCat['CAPA']),
      patternId: strToPatternId(mdbCat['CAPA']),
    };
  });
};

const importAddresses = async () => {
  const { stdout } = await exec(`mdb-export "${MDB_PATH}" calle`);

  return (await CSVToJSON().fromString(stdout)).map((mdbStreet) => {
    return {
      id: +mdbStreet['Id'],
      address: mdbStreet['CALLEJERO'],
      area: mdbStreet['ÁREA'],
    };
  });
};

const importColonies = async () => {
  const { stdout } = await exec(`mdb-export "${MDB_PATH}" colonias`);

  const addresses = await importAddresses();

  return (await CSVToJSON().fromString(stdout)).map((mdbColony) => {
    const addressId = +mdbColony['Dirección'];
    const address = addresses[addressId]?.address || '';

    return {
      id: +mdbColony['Id COLONIA'],
      createdAt: strToDate(mdbColony['Fecha alta']),
      address,
      locationTypeId: strToLocationType(mdbColony['Ubicación']),
      environmentId: strToEnvironment(mdbColony['Entorno']),
      townId: 1,
    };
  });
};

const importUsers = async () => {
  const AdminRoleId = 1;
  const ManagerRoleId = 2;

  const { stdout } = await exec(`mdb-export "${MDB_PATH}" gestoras`);
  let maxId = -1;

  const users = (await CSVToJSON().fromString(stdout)).map((mdbColony) => {
    const id = +mdbColony['Id GESTORA'];
    maxId = Math.max(maxId, id);

    return {
      id,
      createdAt: strToDate(mdbColony['FECHA ALTA']),
      name: capitalize(mdbColony['NOMBRE']),
      surnames: capitalize(mdbColony['APELLIDOS']),
      idCard: mdbColony['DNI'],
      phoneNumber: mdbColony['TELÉFONO'],
      email: mdbColony['CORREO ELECTRONICO'],
      ceasedAt: strToDate(mdbColony['FECHA BAJA']),
      authorizesWhatsApp: mdbColony['Autoriza WhatsApp'] ? true : false,
      ceaseCause: mdbColony['Motivo baja'],
      password: '$2b$10$4.2Qt8mc9T.Hj0ofYf8D0e7uA8013PXuB/KWPAxh4Frmy9yJmV7om',
      salt: '$2b$10$4.2Qt8mc9T.Hj0ofYf8D0e',
      roleId: ManagerRoleId,
    };
  });

  users.push({
    id: maxId + 1,
    createdAt: new Date(),
    name: 'Administrador',
    surnames: '',
    idCard: '',
    phoneNumber: 999999999,
    email: 'admin@cats.org',
    password: '$2b$10$4.2Qt8mc9T.Hj0ofYf8D0e7uA8013PXuB/KWPAxh4Frmy9yJmV7om',
    salt: '$2b$10$4.2Qt8mc9T.Hj0ofYf8D0e',
    roleId: AdminRoleId,
  });

  return users;
};

const importColonyUserRelation = async () => {
  const { stdout } = await exec(`mdb-export "${MDB_PATH}" gestoras_colonia`);

  return (await CSVToJSON().fromString(stdout)).map((mdbEntry) => {
    return {
      userId: +mdbEntry['Id Gestora'],
      colonyId: +mdbEntry['Id Colonia'],
    };
  });
};

const importAnnotations = async () => {
  const { stdout } = await exec(`mdb-export "${MDB_PATH}" anotaciones_gatos`);

  return (await CSVToJSON().fromString(stdout)).map((mdbEntry) => {
    return {
      id: +mdbEntry['ID'],
      catId: +mdbEntry['Id_Gato'],
      createdAt: strToDate(mdbEntry['Fecha']),
      annotation: mdbEntry['Anotación'],
    };
  });
};

module.exports = {
  importAnnotations,
  importCats,
  importCeaseCauses,
  importColonies,
  importColonyUserRelation,
  importColors,
  importEnvironments,
  importEyeColors,
  importLocationTypes,
  importPatterns,
  importPictures,
  importRoles,
  importTowns,
  importUsers,
};
