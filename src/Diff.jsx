const SizeDiff = ({ unit, value, newValue }) => {
  const parsedSize = parseFloat(value);

  const format = (diffValue) => {
    const roundedValue = diffValue.toFixed(2) * 1; // Remove insignificant trailing zeros
    return `${roundedValue}&nbsp;${unit}`;
  };

  if (!newValue) {
    return format(parsedSize);
  }

  const parsedNewSize = parseFloat(newValue);

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

export default SizeDiff;
