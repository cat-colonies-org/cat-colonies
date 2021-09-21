const fs = require('fs');
const path = require('path');

const { dateToIso } = require('./mappers');
const { importCeaseCauses, importEyeColors, importCats } = require('./importers');

const OUTPUT_PATH = './output';

const catFormatter = (cat) => {
  return `INSERT INTO cat ("id", "colonyId", "createdAt", "birthYear", "gender", "sterilized", "kitten", "eyeColorId", "ceasedAt", "ceaseCauseId") VALUES (
    ${cat.id}, 
    ${cat.colonyId},
    ${dateToIso(cat.createdAt)},
    ${cat.birthYear}, 
    '${cat.gender}', 
    ${cat.esterilized ? 'True' : 'False'}, 
    ${cat.kitten ? 'True' : 'False'}, 
    ${cat.eyeColorId},
    ${cat.ceasedAt ? dateToIso(cat.ceasedAt) : null},
    ${cat.ceaseCauseId}
  );`;
};

const ceaseCauseFormatter = (cause) => {
  return `INSERT INTO cease_cause (id, description) VALUES (
      ${cause.id}, 
      '${cause.description}'
    );`;
};

const eyeColorFormatter = (eyeColor) => {
  return `INSERT INTO eye_color (id, description) VALUES (
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
