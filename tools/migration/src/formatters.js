const { dateToIso } = require('./mappers');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const catFormatter = (cat) => {
  return `INSERT INTO cat ("id", "colonyId", "createdAt", "bornAt", "gender", "sterilized", "patternId", "eyeColorId", "ceasedAt", "ceaseCauseId") VALUES (
    ${cat.id}, 
    ${cat.colonyId},
    ${dateToIso(cat.createdAt)},
    ${cat.bornAt ? dateToIso(cat.bornAt) : null},
    '${cat.gender}', 
    ${cat.esterilized ? 'True' : 'False'}, 
    ${cat.patternId},
    ${cat.eyeColorId},
    ${cat.ceasedAt ? dateToIso(cat.ceasedAt) : null},
    ${cat.ceaseCauseId}
  );`;
};

const locationTypeFormatter = (locationType) => {
  return `INSERT INTO location_type ("id", "description") VALUES (
    ${locationType.id}, 
    '${locationType.description}'
  );`;
};

const pictureFormatter = (inputPath, outputPath, picture) => {
  const src = path.join(inputPath, picture.originalFilename);
  const imageDst = path.join(outputPath, picture.image);
  const thumbDst = path.join(outputPath, picture.thumbnail);

  fs.copyFileSync(src, imageDst);

  sharp(src)
    .rotate()
    .resize({
      width: 160,
      height: 108,
      fit: sharp.fit.contain,
    })
    .png()
    .toFile(thumbDst);

  return `INSERT INTO picture ("id", "catId", "createdAt", "originalFilename", "image", "thumbnail") VALUES (
    ${picture.id}, 
    ${picture.catId}, 
    ${dateToIso(picture.createdAt)},
    '${picture.originalFilename}', 
    '${picture.image}', 
    '${picture.thumbnail}'
  );`;
};

const roleFormatter = (role) => {
  return `INSERT INTO role ("id", "description") VALUES (
    ${role.id}, 
    '${role.description}'
  );`;
};

const townFormatter = (town) => {
  return `INSERT INTO town ("id", "name") VALUES (
    ${town.id}, 
    '${town.name}'
  );`;
};

const environmentFormatter = (environment) => {
  return `INSERT INTO environment ("id", "description") VALUES (
    ${environment.id}, 
    '${environment.description}'
  );`;
};

const colonyFormatter = (colony) => {
  return `INSERT INTO colony ("id", "createdAt", "address", "locationTypeId", "environmentId", "townId") VALUES (
    ${colony.id}, 
    ${dateToIso(colony.createdAt)},
    '${colony.address}', 
    ${colony.locationTypeId}, 
    ${colony.environmentId}, 
    ${colony.townId}
  );`;
};

const ceaseCauseFormatter = (cause) => {
  return `INSERT INTO cease_cause ("id", "description") VALUES (
      ${cause.id}, 
      '${cause.description}'
    );`;
};

const eyeColorFormatter = (eyeColor) => {
  return `INSERT INTO eye_color ("id", "description") VALUES (
    ${eyeColor.id}, 
    '${eyeColor.description}'
  );`;
};

const userFormatter = (user) => {
  return `INSERT INTO "user" ("id", "createdAt", "name", "surnames", "idCard", "phoneNumber", "email", "ceasedAt", "authorizesWhatsApp", "password", "roleId") VALUES (
    ${user.id}, 
    ${dateToIso(user.createdAt)},
    '${user.name}',
    '${user.surnames}',
    '${user.idCard}',
    ${user.phoneNumber || 0},
    '${user.email}',
    ${user.ceasedAt ? dateToIso(user.ceasedAt) : null},
    ${user.authorizesWhatsApp ? 'True' : 'False'},
    '${user.password}',
    ${user.roleId}
  );`;
};

const colonyUserRelationFormatter = (entity) => {
  return `INSERT INTO "user_colonies_colony" ("userId", "colonyId") VALUES (
    ${entity.userId}, 
    ${entity.colonyId}
  );`;
};

const catColorRelationFormatter = (entity) => {
  return `INSERT INTO "cat_colors_color" ("catId", "colorId") VALUES (
    ${entity.catId}, 
    ${entity.colorId}
  );`;
};

const annotationFormatter = (entity) => {
  return `INSERT INTO "annotation" ("id", "catId", "date", "annotation") VALUES (
    ${entity.id}, 
    ${entity.catId},
    ${entity.createdAt ? dateToIso(entity.createdAt) : null},
    '${entity.annotation}'
  );`;
};

const colorFormatter = (color) => {
  return `INSERT INTO color ("id", "description") VALUES (
    ${color.id}, 
    '${color.description}'
  );`;
};

const patternFormatter = (pattern) => {
  return `INSERT INTO pattern ("id", "description") VALUES (
    ${pattern.id}, 
    '${pattern.description}'
  );`;
};

module.exports = {
  annotationFormatter,
  catColorRelationFormatter,
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
};
