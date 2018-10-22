const KiB = 1024;
const MiB = KiB * 1024;

export const parseSize = (sizeString) => {
  if (typeof sizeString === 'number') {
    return sizeString;
  }

  const [value, unit] = sizeString.split(' ');
  const valueNum = parseFloat(value);

  switch (unit) {
    case 'KiB':
      return parseInt(valueNum * KiB, 10);
    case 'MiB':
      return parseInt(valueNum * MiB, 10);
    default:
      throw new Error(`Unrecognized unit: ${unit}`);
  }
};

export const addUnit = (valueNum) => {
  if (Math.abs(valueNum) >= KiB) {
    if (Math.abs(valueNum) >= MiB) {
      return [valueNum / MiB, 'MiB'];
    }

    return [valueNum / KiB, 'KiB'];
  }

  return [valueNum, 'B'];
};
