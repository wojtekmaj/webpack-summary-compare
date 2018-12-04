import parseTable from './parse_ascii_table';

const getLines = value => value.split('\n').filter(Boolean);

const trimLines = lines => lines.map(line => line.trim());

const getTableHeaderLine = lines => lines.find(line => /\s*Asset\s*/.test(line));

const getAssetsTable = (value) => {
  const lines = getLines(value);
  const trimmedLines = trimLines(lines);
  const tableHeaderLine = getTableHeaderLine(lines);
  const tableHeaderLineIndex = lines.indexOf(tableHeaderLine);
  const linesStartingFromTableContent = trimmedLines.slice(tableHeaderLineIndex + 1);
  let tableEndLineIndex = linesStartingFromTableContent.findIndex(line => line.startsWith('Entrypoint'));
  // No "Entrypoint" output included
  if (tableEndLineIndex === -1) {
    tableEndLineIndex = linesStartingFromTableContent.findIndex(line => !line.includes('KiB') && !line.includes('MiB'));
  }
  // No lines after assets table
  if (tableEndLineIndex === -1) {
    tableEndLineIndex = linesStartingFromTableContent.length;
  }

  return lines.slice(tableHeaderLineIndex, tableHeaderLineIndex + tableEndLineIndex + 1).join('\n');
};

export const getStatProperty = (value, key) => {
  if (!value) {
    return null;
  }

  const lines = getLines(value);
  const trimmedLines = trimLines(lines);

  const valueLabel = `${key}: `;
  const valueLine = trimmedLines.find(line => line.startsWith(valueLabel));

  if (!valueLine) {
    return null;
  }

  return valueLine.slice(valueLabel.length);
};

const getHash = value => getStatProperty(value, 'Hash');

const removeHash = (name = '', hash) => {
  if (!hash) {
    return name;
  }

  return name.replace(hash, '\\[hash\\]');
};

export const getParsedAssetsTable = (value) => {
  if (!value) {
    return [];
  }

  const hash = getHash(value);
  const assetsTable = getAssetsTable(value);
  const parsedAssetsTable = parseTable(assetsTable);

  return parsedAssetsTable.map(asset => ({
    ...asset,
    Asset: removeHash(asset.Asset, hash).replace(/~/g, '&shy;~'),
  }));
};

export const getStatProperties = value => ['Hash', 'Version', 'Time', 'Built at']
  .reduce((result, key) => ({
    ...result,
    [key]: getStatProperty(value, key),
  }), {});
