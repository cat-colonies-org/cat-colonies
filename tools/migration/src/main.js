const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = './output';
const COMBINED_OUTPUT = path.join(OUTPUT_PATH, 'combined.sql');

const {
  importCeaseCauses,
  importEyeColors,
  importCats,
  importColonies,
  importLocationTypes,
  importEnvironments,
  importTowns,
  importUsers,
} = require('./importers');

const {
  catFormatter,
  ceaseCauseFormatter,
  eyeColorFormatter,
  colonyFormatter,
  locationTypeFormatter,
  environmentFormatter,
  townFormatter,
  userFormatter,
} = require('./formatters');

const exportFile = async (filename, importer, formatter) => {
  const sql = (await importer()).reduce((acc, current) => {
    return `${acc}${formatter(current).replace(/\n/g, ' ').replace(/\s+/g, ' ')}\n`;
  }, '');

  // Split output
  fs.writeFileSync(path.join(OUTPUT_PATH, filename), sql);

  // Combined output
  fs.appendFileSync(COMBINED_OUTPUT, `-- ${filename} --------------------------------------------\n`);
  fs.appendFileSync(COMBINED_OUTPUT, sql);
  fs.appendFileSync(COMBINED_OUTPUT, `\n`);
};

(async () => {
  fs.existsSync(COMBINED_OUTPUT) && fs.truncateSync(COMBINED_OUTPUT, 0);

  await exportFile('towns.sql', importTowns, townFormatter);
  await exportFile('location-types.sql', importLocationTypes, locationTypeFormatter);
  await exportFile('environments.sql', importEnvironments, environmentFormatter);
  await exportFile('colonies.sql', importColonies, colonyFormatter);

  await exportFile('eye-colors.sql', importEyeColors, eyeColorFormatter);
  await exportFile('cease-causes.sql', importCeaseCauses, ceaseCauseFormatter);
  await exportFile('cats.sql', importCats, catFormatter);

  await exportFile('users.sql', importUsers, userFormatter);
})();
