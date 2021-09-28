const CeaseCause = Object.freeze({
  Desconodido: 0,
  Desaparicion: 1,
  Atropello: 2,
  Adopcion: 3,
  Acogida: 4,
  Eutanasia: 5,
});

const EyeColor = Object.freeze({
  Desconocido: 0,
  Amarillo: 1,
  Ambar: 2,
  Azul: 3,
  Gris: 4,
  Marron: 5,
  Miel: 6,
  Verde: 7,
});

const Color = Object.freeze({
  Desconocido: 0,
  Atigrado: 1,
  AtigradoDiluido: 2,
  Azul: 3,
  Blanco: 4,
  Calico: 5,
  Canela: 6,
  Carey: 7,
  CareyDiluido: 8,
  Chocolate: 9,
  Crema: 10,
  Gris: 11,
  Negro: 12,
  Rojo: 13,
});

const Pattern = Object.freeze({
  Desconocido: 0,
  Particolor: 1,
  Point: 2,
  Solido: 3,
  Tabby: 4,
  Tricolor: 5,
});

const LocationType = Object.freeze({
  Desconocido: 0,
  SolarPrivado: 1,
  SolarPublico: 2,
  CentroEducativo: 3,
  Campo: 4,
});

const EnvironemntType = Object.freeze({
  Desconocido: 0,
  Urbano: 1,
  Periferia: 2,
});

const strToDate = (str) => {
  if (!str) return null;
  return new Date(str.replace(' 00:00:00', 'Z'));
};

const dateToIso = (date) => {
  return `'${date.toISOString().replace(/T.*/g, '')}'`;
};

const birthYearToBornAt = (year) => {
  if (year == 0) return null;
  return new Date('05/15/' + year.toString().substring(2) + 'Z');
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
  return CeaseCause.Desconodido;
};

const strToLocationType = (str) => {
  if (str.toLowerCase().includes('privado')) return LocationType.SolarPrivado;
  if (str.toLowerCase().includes('público')) return LocationType.SolarPublico;
  if (str.toLowerCase().includes('educativo')) return LocationType.CentroEducativo;
  if (str.toLowerCase().includes('campo')) return LocationType.Campo;
  return LocationType.Desconocido;
};

const strToEnvironment = (str) => {
  if (str.toLowerCase().includes('urbano')) return EnvironemntType.Urbano;
  if (str.toLowerCase().includes('perifer')) return EnvironemntType.Periferia;
  return EnvironemntType.Desconocido;
};

const strToEyeColorId = (str) => {
  if (str.toLowerCase().includes('ama')) return EyeColor.Amarillo;
  if (str.toLowerCase().includes('ambar')) return EyeColor.Ambar;
  if (str.toLowerCase().includes('azul')) return EyeColor.Azul;
  if (str.toLowerCase().includes('gris')) return EyeColor.Gris;
  if (str.toLowerCase().includes('marron')) return EyeColor.Marron;
  if (str.toLowerCase().includes('miel')) return EyeColor.Miel;
  if (str.toLowerCase().includes('verde')) return EyeColor.Verde;
  return EyeColor.Desconocido;
};

const strToColorId = (str) => {
  if (str.toLowerCase().includes('azul')) return Color.Azul;
  if (str.toLowerCase().includes('blanc')) return Color.Blanco;
  if (str.toLowerCase().includes('canela')) return Color.Canela;
  if (str.toLowerCase().includes('carey')) return Color.Carey;
  if (str.toLowerCase().includes('chocolate')) return Color.Chocolate;
  if (str.toLowerCase().includes('crema')) return Color.Crema;
  if (str.toLowerCase().includes('negr')) return Color.Negro;
  if (str.toLowerCase().includes('gris')) return Color.Gris;
  if (str.toLowerCase().includes('rojo')) return Color.Rojo;
  if (str.toLowerCase().includes('red')) return Color.Rojo;
  if (str.toLowerCase() === 'particolor') return Color.Negro;
  if (str.toLowerCase() === 'particolor tabby') return Color.Gris;
  if (str.toLowerCase() === 'siamés') return Color.Chocolate;
  if (str.toLowerCase() === 'siamés atigrado') return Color.Atigrado;
  if (str.toLowerCase() === 'tricolor atigrada') return Color.Atigrado;
  if (str.toLowerCase() === 'tricolor') return Color.Calico;
  if (str.toLowerCase() === 'tricolor atigrada diluida') return Color.AtigradoDiluido;
  if (str.toLowerCase() === 'tricolor cálico') return Color.Calico;
  if (str.toLowerCase() === 'tricolor diluido') return Color.CareyDiluido;

  return Color.Desconocido;
};

const strToPatternId = (str) => {
  if (
    ['azul', 'blanca', 'blanco', 'canela', 'crema', 'negra', 'negro', 'sólido negra'].includes(str.trim().toLowerCase())
  ) {
    return Pattern.Solido;
  }

  if (
    [
      'carey',
      'siamés atigrado',
      'tricolor',
      'tricolor atigrada',
      'tricolor atigrada diluida',
      'tricolor cálico',
      'tricolor carey',
      'tricolor carey',
      'tricolor diluido',
    ].includes(str.trim().toLowerCase())
  ) {
    return Pattern.Tricolor;
  }

  if (
    [
      'particolor',
      'particolor negro',
      'particolor  negro',
      'particolor azul',
      'particolor crema',
      'particolor gris',
      'particolor negra',
      'particolor negro',
      'particolor rojo tabby',
      'particolor tabby',
    ].includes(str.trim().toLowerCase())
  ) {
    return Pattern.Particolor;
  }

  if (
    ['chocolate point', 'point azul', 'point azul', 'point chocolate', 'red point', 'red point', 'siamés'].includes(
      str.trim().toLowerCase(),
    )
  ) {
    return Pattern.Point;
  }

  if (['rojo tabby', 'tabby', 'tabby azul'].includes(str.trim().toLowerCase())) {
    return Pattern.Tabby;
  }

  if (str.trim().toLowerCase().includes('particolor')) return Pattern.Particolor;

  return Pattern.Desconocido;
};

module.exports = {
  birthYearToBornAt,
  dateToIso,
  strToCeaseCauseId,
  strToColorId,
  strToDate,
  strToEnvironment,
  strToEyeColorId,
  strToGender,
  strToLocationType,
  strToPatternId,
  strToSterilized,
};
