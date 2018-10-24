import { addUnit, parseSize } from './units';

const Diff = ({ size, newSize }) => {
  const parsedSize = parseSize(size);

  const format = (num) => {
    const [diffValue, diffUnit] = addUnit(num);
    return `${diffValue.toFixed(2)} ${diffUnit}`;
  };

  if (!newSize) {
    return format(parsedSize);
  }

  const parsedNewSize = parseSize(newSize);

  const diff = parsedNewSize - parsedSize;
  const diffPercent = ((parsedNewSize / parsedSize) * 100) - 100;

  if (!diff) {
    return format(parsedSize);
  }

  const risen = diff > 0;

  return `${
    format(parsedSize)
  } → ${
    format(parsedNewSize)
  } (${
    format(diff)
  }; ${
    diffPercent.toFixed(2)
  }% ${
    risen ? '↗' : '↘'
  })`;
};

export default Diff;
