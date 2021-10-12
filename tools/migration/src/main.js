const fs = require('fs');
const path = require('path');

const PICTURES_INPUT_PATH = './pictures';
const SQL_OUTPUT_PATH = './output/sql';
const PICTURES_OUTPUT_PATH = './output/pictures';
const COMBINED_OUTPUT = path.join(SQL_OUTPUT_PATH, 'combined.sql');

const {
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
} = require('./importers');

const {
  annotationFormatter,
  catFormatter,
  ceaseCauseFormatter,
  colonyFormatter,
  colonyUserRelationFormatter,
  colorFormatter,
  environmentFormatter,
  eyeColorFormatter,
  locationTypeFormatter,
  patternFormatter,
  pictureFormatter,
  roleFormatter,
  townFormatter,
  userFormatter,
} = require('./formatters');

const exportFile = async (tableName, importer, formatter) => {
  let maxId = 0;

  let sql = (await importer()).reduce((acc, current) => {
    maxId = current.id ? Math.max(maxId, current.id) : 0;
    return `${acc}${formatter(current).replace(/\n/g, ' ').replace(/\s+/g, ' ')}\n`;
  }, '');

  if (maxId) sql += `\nALTER SEQUENCE ${tableName}_id_seq RESTART WITH ${maxId + 1};\n`;

  // Split output
  fs.writeFileSync(path.join(SQL_OUTPUT_PATH, `${tableName}.sql`), sql);

  // Combined output
  fs.appendFileSync(COMBINED_OUTPUT, `-- ${tableName} --------------------------------------------\n`);
  fs.appendFileSync(COMBINED_OUTPUT, sql);
  fs.appendFileSync(COMBINED_OUTPUT, `\n`);
};

(async () => {
  fs.existsSync(COMBINED_OUTPUT) && fs.truncateSync(COMBINED_OUTPUT, 0);

  await exportFile('town', importTowns, townFormatter);
  await exportFile('location_type', importLocationTypes, locationTypeFormatter);
  await exportFile('environment', importEnvironments, environmentFormatter);
  await exportFile('colony', importColonies, colonyFormatter);

  await exportFile('color', importColors, colorFormatter);
  await exportFile('pattern', importPatterns, patternFormatter);
  await exportFile('eye_color', importEyeColors, eyeColorFormatter);
  await exportFile('cease_cause', importCeaseCauses, ceaseCauseFormatter);
  await exportFile('cat', importCats, catFormatter);
  await exportFile('annotation', importAnnotations, annotationFormatter);
  await exportFile(
    'picture',
    () => importPictures(PICTURES_INPUT_PATH),
    (picture) => pictureFormatter(PICTURES_INPUT_PATH, PICTURES_OUTPUT_PATH, picture),
  );

  await exportFile('role', importRoles, roleFormatter);
  await exportFile('user', importUsers, userFormatter);
  await exportFile('user_colonies_colony', importColonyUserRelation, colonyUserRelationFormatter);
})();
