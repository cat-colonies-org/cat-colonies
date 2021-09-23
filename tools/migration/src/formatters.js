const { dateToIso } = require('./mappers');

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

const locationTypeFormatter = (locationType) => {
  return `INSERT INTO locationType ("id", "description") VALUES (
    ${locationType.id}, 
    '${locationType.description}'
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
  return `INSERT INTO colony ("id", "createdAt", "locationTypeId", "environmentId", "townId") VALUES (
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
  return `INSERT INTO user ("id", "createdAt", "name", "surnames", "idCard", "phoneNumber", "email", "ceasedAt", "authorizesWhatsApp") VALUES (
    ${user.id}, 
    ${dateToIso(user.createdAt)},
    '${user.name}',
    '${user.surnames}',
    '${user.idCard}',
    ${user.phoneNumber || 0},
    '${user.email}',
    ${user.ceasedAt ? dateToIso(user.ceasedAt) : null},
    ${user.authorizesWhatsApp ? 'True' : 'False'},
  );`;
};

module.exports = {
  catFormatter,
  ceaseCauseFormatter,
  eyeColorFormatter,
  colonyFormatter,
  locationTypeFormatter,
  environmentFormatter,
  townFormatter,
  userFormatter,
};
