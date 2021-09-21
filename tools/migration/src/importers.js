const util = require('util');
const exec = util.promisify(require('child_process').exec);
const CSVToJSON = require('csvtojson');

const {
  strToDate,
  strToGender,
  strToSterilized,
  strToKitten,
  strToCeaseCauseId,
  strToEyeColorId,
} = require('./mappers');

const MDB_PATH = './data/CENSO COLONIAS FELINAS ALBATERA.accdb';

const importCeaseCauses = async () => {
  return Promise.resolve([
    { id: 1, description: 'Desaparición' },
    { id: 2, description: 'Atropello' },
    { id: 3, description: 'Adopción' },
    { id: 4, description: 'Acogida' },
    { id: 5, description: 'Eutanasia' },
    { id: 6, description: 'NS/NC' },
  ]);
};

const importEyeColors = async () => {
  return Promise.resolve([
    { id: 1, description: 'Amarillo' },
    { id: 2, description: 'Ambar' },
    { id: 3, description: 'Azul' },
    { id: 4, description: 'Gris' },
    { id: 5, description: 'Marrón' },
    { id: 6, description: 'Miel' },
    { id: 7, description: 'Verde' },
    { id: 8, description: 'NS/NC' },
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
      birthYear: +mdbCat['AÑO NACIDO'],
      kitten: strToKitten(mdbCat['CACHORRO']),
      sterilized: strToSterilized(mdbCat['ESTERIL']),
      gender: strToGender(mdbCat['SEXO']),
      ceasedAt: strToDate(mdbCat['BAJA']),
      ceaseCauseId: strToCeaseCauseId(mdbCat['CAUSA']),
      eyeColorId: strToEyeColorId(mdbCat['OJOS']),
    };
  });
};

module.exports = { importCeaseCauses, importEyeColors, importCats };
