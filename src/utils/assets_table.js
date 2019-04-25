import parseTable, { getAllColumnsEnds } from './parse_ascii_table';

const getLines = value => value.split('\n').filter(Boolean);

const trimLines = lines => lines.map(line => line.trim().replace('⚠️', ' '));

const isWebpack = line => /\s*Asset\s*/.test(line);
const isParcel = line => line && line.includes('✨  Built in');

const getTableHeaderLine = lines => lines.find(line => isWebpack(line) || isParcel(line));

const units = ['KB', 'KiB', 'MB', 'MiB'];

const generateProperHeaderLine = (tableLines) => {
  const trimmedLines = trimLines(tableLines);
  const contentTableLines = trimmedLines.slice(1);
  const tableColumnsEnds = getAllColumnsEnds(contentTableLines, 4);
  let str = '';
  const tableHeaders = ['Asset', 'Size', 'Time'];
  [...tableColumnsEnds.slice(1), contentTableLines[0].length].forEach((columnEnd, index) => {
    str += tableHeaders[index][index ? 'padStart' : 'padEnd'](columnEnd - str.length);
  });
  const tableLinesWithReplacedHeader = [str, ...contentTableLines];
  return tableLinesWithReplacedHeader;
};

const getAssetsTable = (value) => {
  const lines = getLines(value);
  const trimmedLines = trimLines(lines);
  const tableHeaderLine = getTableHeaderLine(lines);
  const tableHeaderLineIndex = lines.indexOf(tableHeaderLine);
  const linesStartingFromTableContent = trimmedLines.slice(tableHeaderLineIndex + 1);
  let tableEndLineIndex = linesStartingFromTableContent.findIndex(line => line.startsWith('Entrypoint'));
  // No "Entrypoint" output included
  if (tableEndLineIndex === -1) {
    tableEndLineIndex = linesStartingFromTableContent.findIndex(line => (
      !units.some(unit => line.includes(unit))
    ));
  }
  // No lines after assets table
  if (tableEndLineIndex === -1) {
    tableEndLineIndex = linesStartingFromTableContent.length;
  }

  let tableLines = lines.slice(
    tableHeaderLineIndex, tableHeaderLineIndex + tableEndLineIndex + 1,
  );

  // Since Parcel is not generating table header, we need to generate one
  // on our own to help with parsing ASCII table
  if (isParcel(tableHeaderLine)) {
    tableLines = generateProperHeaderLine(tableLines);
  }

  return tableLines.join('\n');
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
    const match = name.match(/\.([0-9a-f]*)/);
    // eslint-disable-next-line no-param-reassign
    hash = match && match[1];
  }
  if (!hash) {
    return name;
  }

  return name.replace(hash, '\\[hash\\]');
};

const removeShortHash = (name = '') => name.replace(/~[0-f]{8}/, '~\\[…\\]');

const removeId = (name = '', chunks) => {
  if (!chunks || `${parseInt(chunks, 10)}` !== chunks) {
    return name;
  }

  return name.replace(`-${chunks}`, '-\\[id\\]');
};

const formatAsset = (asset, hash) => {
  let { Asset: name } = asset;
  name = removeHash(name, hash);
  name = removeShortHash(name);
  name = removeId(name, asset.Chunks);

  return {
    ...asset,
    Asset: name,
  };
};

export const getParsedAssetsTable = (value) => {
  if (!value) {
    return [];
  }

  const hash = getHash(value);
  const assetsTable = getAssetsTable(value);
  const parsedAssetsTable = parseTable(assetsTable);

  return parsedAssetsTable.map(asset => formatAsset(asset, hash));
};

export const getStatProperties = value => ['Hash', 'Version', 'Time', 'Built at']
  .reduce((result, key) => ({
    ...result,
    [key]: getStatProperty(value, key),
  }), {});
