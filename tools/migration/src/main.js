const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = './output';

const { importCeaseCauses, importEyeColors, importCats } = require('./importers');
const { catFormatter, ceaseCauseFormatter, eyeColorFormatter } = require('./formatters');

const exportFile = async (filename, importer, formatter) => {
  const sql = (await importer()).reduce((acc, current) => {
    return `${acc}${formatter(current).replace(/\n/g, ' ').replace(/\s+/g, ' ')}\n`;
  }, '');

  fs.writeFileSync(path.join(OUTPUT_PATH, filename), sql);
};

(async () => {
  Promise.all([
    exportFile('eye-colors.sql', importEyeColors, eyeColorFormatter),
    exportFile('cease-causes.sql', importCeaseCauses, ceaseCauseFormatter),
    exportFile('cats.sql', importCats, catFormatter),
  ]);
})();
