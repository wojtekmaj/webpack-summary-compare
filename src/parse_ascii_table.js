const getLines = value => value.split('\n').filter(Boolean);

const getTableHeaderColumns = headerLine => headerLine.split('  ').map(el => el.trim()).filter(Boolean);

const parseLine = (line, { tableHeaderColumns, tableColumnsEnds }) => {
  const chunkValues = tableColumnsEnds
    .map((el, index, arr) => line.slice(arr[index - 1] || 0, el));

  return tableHeaderColumns.reduce((obj, column, index) => ({
    ...obj,
    [column]: chunkValues[index].trim(),
  }), {});
};

const parseTable = (input) => {
  const lines = getLines(input);
  const [headerLine, ...contentLines] = lines;

  const tableHeaderColumns = getTableHeaderColumns(headerLine);
  const tableColumnsEnds = tableHeaderColumns
    .map(col => headerLine.indexOf(col) + col.length);

  return contentLines.map(line => parseLine(line, { tableHeaderColumns, tableColumnsEnds }));
};

export default parseTable;
