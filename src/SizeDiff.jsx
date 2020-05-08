import { addUnit, parseSize } from './utils/units';
import Diff from './Diff';

function format(value) {
  const [diffValue, diffUnit] = addUnit(value);
  const roundedValue = diffValue.toFixed(2) * 1; // Remove insignificant trailing zeros
  return `${roundedValue}&nbsp;${diffUnit}`;
}

export default function SizeDiff({ a, b }) {
  return Diff({
    format,
    parse: parseSize,
    a,
    b,
  });
}
