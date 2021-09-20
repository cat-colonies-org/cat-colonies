const util = require('util');
const CSVToJSON = require('csvtojson');
const exec = util.promisify(require('child_process').exec);

const MDB_PATH = './data/CENSO COLONIAS FELINAS ALBATERA.accdb';
const OUTPUT_PATH = './output';

const strToDate = (str) => {
  if (!str) return null;
  return new Date(str.replace(' 00:00:00', 'Z'));
};

const importCats = async () => {
  const { stdout } = await exec(`mdb-export "${MDB_PATH}" gatos`);

  return (await CSVToJSON().fromString(stdout)).map((mdbCat) => {
    return {
      id: +mdbCat['Id GATO'],
      colonyId: +mdbCat['Id Colonia'],
      createdAt: strToDate(mdbCat['Fecha Alta']),
      ceasedAt: strToDate(mdbCat['BAJA']),
    };
  });
};

const exportCats = async (cats) => {
  cats.forEach((cat) => {
    console.log(
      `INSERT INTO cats (id, colonyId, createdAt, ceasedAt) VALUES (
        ${cat.id}, 
        ${cat.colonyId}, 
        '${cat.createdAt.toLocaleDateString()}', 
        '${cat.ceasedAt?.toLocaleDateString()}'
      );`,
    );
  });
};

(async () => {
  const cats = await importCats();

  exportCats(cats);
})();
