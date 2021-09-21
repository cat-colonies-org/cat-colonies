const CeaseCause = Object.freeze({
  Desaparicion: 1,
  Atropello: 2,
  Adopcion: 3,
  Acogida: 4,
  Eutanasia: 5,
  NS_NC: null,
});

const EyeColor = Object.freeze({
  Amarillo: 1,
  Ambar: 2,
  Azul: 3,
  Gris: 4,
  Marron: 5,
  Miel: 6,
  Verde: 7,
  NS_NC: null,
});

const strToDate = (str) => {
  if (!str) return null;
  return new Date(str.replace(' 00:00:00', 'Z'));
};

const dateToIso = (date) => {
  return `'${date.toISOString().replace(/T.*/g, '')}'`;
};

const strToGender = (str) => {
  if (str.toLowerCase().includes('macho')) return 'Male';
  if (str.toLowerCase().includes('hembra')) return 'Female';
  return 'Unknown';
};

const strToSterilized = (str) => {
  if (str.toLowerCase().includes('si')) return true;
  return false;
};

const strToCeaseCauseId = (str) => {
  if (str.toLowerCase().includes('desaparecid')) return CeaseCause.Desaparicion;
  if (str.toLowerCase().includes('atropello')) return CeaseCause.Atropello;
  if (str.toLowerCase().includes('adoptad')) return CeaseCause.Adopcion;
  if (str.toLowerCase().includes('acogid')) return CeaseCause.Acogida;
  if (str.toLowerCase().includes('eutanasia')) return CeaseCause.Eutanasia;
  return CeaseCause.NS_NC;
};

const strToEyeColorId = (str) => {
  if (str.toLowerCase().includes('ama')) return EyeColor.Amarillo;
  if (str.toLowerCase().includes('ambar')) return EyeColor.Ambar;
  if (str.toLowerCase().includes('azul')) return EyeColor.Azul;
  if (str.toLowerCase().includes('gris')) return EyeColor.Gris;
  if (str.toLowerCase().includes('marron')) return EyeColor.Marron;
  if (str.toLowerCase().includes('miel')) return EyeColor.Miel;
  if (str.toLowerCase().includes('verde')) return EyeColor.Verde;
  return EyeColor.NS_NC;
};

const strToKitten = (str) => {
  if (str.toLowerCase().includes('si')) return true;
  return false;
};

module.exports = {
  strToDate,
  dateToIso,
  strToGender,
  strToSterilized,
  strToCeaseCauseId,
  strToEyeColorId,
  strToKitten,
};
