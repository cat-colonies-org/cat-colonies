const util = require('util');
const exec = util.promisify(require('child_process').exec);
const CSVToJSON = require('csvtojson');

const {
  strToDate,
  strToGender,
  strToSterilized,
  birthYearToBornAt,
  strToCeaseCauseId,
  strToEyeColorId,
  strToLocationType,
  strToEnvironment,
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

const importCats = async () => {
  const { stdout } = await exec(`mdb-export "${MDB_PATH}" gatos`);

  return (await CSVToJSON().fromString(stdout)).map((mdbCat) => {
    // CAPA: 'EUROPEO Y BLANCO',
    // 'IMÁGEN': '48',
    return {
      id: +mdbCat['Id GATO'],
      colonyId: +mdbCat['Id Colonia'],
      createdAt: strToDate(mdbCat['Fecha Alta']),
      bornAt: birthYearToBornAt(mdbCat['AÑO NACIDO']),
      esterilized: strToSterilized(mdbCat['ESTERIL']),
      gender: strToGender(mdbCat['SEXO']),
      ceasedAt: strToDate(mdbCat['BAJA']),
      ceaseCauseId: strToCeaseCauseId(mdbCat['CAUSA']),
      eyeColorId: strToEyeColorId(mdbCat['OJOS']),
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

module.exports = {
  importCeaseCauses,
  importEyeColors,
  importCats,
  importColonies,
  importLocationTypes,
  importEnvironments,
  importTowns,
  importUsers,
  importRoles,
  importColoniesUserRelation: importColonyUserRelation,
};
