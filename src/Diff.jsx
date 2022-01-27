function defaultFormat(value) {
  const roundedValue = value.toFixed(2) * 1; // Remove insignificant trailing zeros
  return roundedValue;
}

export default function Diff({ unit, format = defaultFormat, parse = parseFloat, a, b }) {
  function formatWithUnit(value) {
    return format(value) + (unit ? `&nbsp;${unit}` : '');
  }

  const parsedA = parse(a);

  if (!b) {
    return formatWithUnit(parsedA);
  }

  const parsedB = parse(b);

  const diff = parsedB - parsedA;
  const diffPercent = (parsedB / parsedA) * 100 - 100;

  if (!diff) {
    return formatWithUnit(parsedA);
  }

  const risen = diff > 0;

  return `${formatWithUnit(parsedA)} → ${formatWithUnit(parsedB)} (${formatWithUnit(
    diff,
  )}; ${diffPercent.toFixed(2)}% ${risen ? '↗' : '↘'})`;
}
