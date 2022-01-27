const getLines = (value) => value.split('\n').filter(Boolean);

const sliceLineIntoValues = (line, tableColumnsEnds) =>
  tableColumnsEnds.map((el, index, arr) => line.slice(el, arr[index + 1] || line.length).trim());

const parseLine = (line, { columnNames, tableColumnsEnds }) => {
  const chunkValues = sliceLineIntoValues(line, tableColumnsEnds);

  return columnNames.reduce(
    (obj, column, index) => ({
      ...obj,
      [column]: chunkValues[index],
    }),
    {},
  );
};

const getAllColumnsEnds = (lines) => {
  const maxLineLength = lines.reduce((maxLength, line) => Math.max(maxLength, line.length), 0);

  const columnsEnds = [];

  // Find all places where all lines have at least two spaces next to each other
  for (let i = 0; i < maxLineLength; i += 1) {
    if (i === 0 || lines.every((line) => line[i] === ' ' && line[i + 1] === ' ')) {
      columnsEnds.push(i);
    }
  }

  return columnsEnds;
};

const getTableColumnNames = (headerLine, tableColumnsEnds) => {
  const columnNames = sliceLineIntoValues(headerLine, tableColumnsEnds).map(
    (el, index) => el || `__UNNAMED__${index}`,
  );

  return columnNames;
};

const parseTable = (input) => {
  const lines = getLines(input);
  const [headerLine, ...contentLines] = lines;

  const tableColumnsEnds = getAllColumnsEnds(lines);
  const columnNames = getTableColumnNames(headerLine, tableColumnsEnds);

  return contentLines.map((line) => parseLine(line, { columnNames, tableColumnsEnds }));
};

export default parseTable;
