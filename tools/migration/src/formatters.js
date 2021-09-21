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

module.exports = { catFormatter, ceaseCauseFormatter, eyeColorFormatter };
