const fs = require('fs');
const util = require('util');
const path = require('path');

const CSVToJSON = require('csvtojson');
const exec = util.promisify(require('child_process').exec);

const MDB_PATH = './data/CENSO COLONIAS FELINAS ALBATERA.accdb';
const OUTPUT_PATH = './output';

const strToDate = (str) => {
  if (!str) return null;
  return new Date(str.replace(' 00:00:00', 'Z'));
};

const strToCeaseCauseId = (str) => {
  if (str.toLowerCase().includes('desaparecid')) return 1;
  if (str.toLowerCase().includes('atropello')) return 2;
  if (str.toLowerCase().includes('adoptad')) return 3;
  if (str.toLowerCase().includes('acogid')) return 4;
  if (str.toLowerCase().includes('eutanasia')) return 5;
  return 6;
};

const strToEyeColorId = (str) => {
  if (str.toLowerCase().includes('ama')) return 1;
  if (str.toLowerCase().includes('ambar')) return 2;
  if (str.toLowerCase().includes('azul')) return 3;
  if (str.toLowerCase().includes('gris')) return 4;
  if (str.toLowerCase().includes('marron')) return 5;
  if (str.toLowerCase().includes('miel')) return 6;
  if (str.toLowerCase().includes('verde')) return 7;
  return 8;
};

const strToKitten = (str) => {
  if (str.toLowerCase().includes('si')) return true;
  return false;
};

const importCeaseCauses = async () => {
  return Promise.resolve([
    {
      id: 1,
      description: 'Desaparición',
    },
    {
      id: 2,
      description: 'Atropello',
    },
    {
      id: 3,
      description: 'Adopción',
    },
    {
      id: 4,
      description: 'Acogida',
    },
    {
      id: 5,
      description: 'Eutanasia',
    },
    {
      id: 6,
      description: 'NS/NC',
    },
  ]);
};

const importEyeColors = async () => {
  return Promise.resolve([
    {
      id: 1,
      description: 'Amarillo',
    },
    {
      id: 2,
      description: 'Ambar',
    },
    {
      id: 3,
      description: 'Azul',
    },
    {
      id: 4,
      description: 'Gris',
    },
    {
      id: 5,
      description: 'Marrón',
    },
    {
      id: 6,
      description: 'Miel',
    },
    {
      id: 7,
      description: 'Verde',
    },
    {
      id: 8,
      description: 'NS/NC',
    },
  ]);
};

const importCats = async () => {
  const { stdout } = await exec(`mdb-export "${MDB_PATH}" gatos`);

  return (await CSVToJSON().fromString(stdout)).map((mdbCat) => {
    // CAPA: 'EUROPEO Y BLANCO',
    // ESTERIL: '48',
    // SEXO: '48',
    // 'IMÁGEN': '48',

    return {
      id: +mdbCat['Id GATO'],
      colonyId: +mdbCat['Id Colonia'],
      createdAt: strToDate(mdbCat['Fecha Alta']),
      birthYear: +mdbCat['AÑO NACIDO'],
      kitten: strToKitten(mdbCat['CACHORRO']),
      ceasedAt: strToDate(mdbCat['BAJA']),
      ceaseCauseId: strToCeaseCauseId(mdbCat['CAUSA']),
      eyeColorId: strToEyeColorId(mdbCat['OJOS']),
    };
  });
};

const catFormatter = (cat) => {
  return `INSERT INTO cats (id, colonyId, createdAt, birthYear, kitten, ceasedAt, ceaseCauseId, eyeColorId) VALUES (
    ${cat.id}, 
    ${cat.colonyId}, 
    '${cat.createdAt.toLocaleDateString()}',
    ${cat.birthYear}, 
    ${cat.kitten ? 'True' : 'False'}, 
    ${cat.ceasedAt ? "'" + cat.ceasedAt.toLocaleDateString() + "'" : null},
    ${cat.ceaseCauseId},
    ${cat.eyeColorId}
  );`;
};

const ceaseCauseFormatter = (cause) => {
  return `INSERT INTO ceaseCauses (id, description) VALUES (
      ${cause.id}, 
      '${cause.description}'
    );`;
};

const eyeColorFormatter = (eyeColor) => {
  return `INSERT INTO eyeColors (id, description) VALUES (
    ${eyeColor.id}, 
    '${eyeColor.description}'
  );`;
};

const exportFile = (filename, data, formatter) => {
  const sql = data.reduce((acc, current) => {
    return `${acc}${formatter(current).replace(/\n/g, ' ').replace(/\s+/g, ' ')}\n`;
  }, '');

  fs.writeFileSync(path.join(OUTPUT_PATH, filename), sql);
};

(async () => {
  exportFile('eye-colors.sql', await importEyeColors(), eyeColorFormatter);
  exportFile('cease-causes.sql', await importCeaseCauses(), ceaseCauseFormatter);
  exportFile('cats.sql', await importCats(), catFormatter);
})();
