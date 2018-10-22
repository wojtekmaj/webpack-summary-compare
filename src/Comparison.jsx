import React, { Component } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';

import './Comparison.less';

import parseTable from './parse_ascii_table';
import { addUnit, parseSize } from './units';

const getLines = value => value.split('\n').filter(Boolean);

const trimLines = lines => lines.map(line => line.trim());

const getTableHeaderLine = lines => lines.find(line => /\s*Asset\s*/.test(line));

const getChunkTable = (value) => {
  const lines = getLines(value);
  const trimmedLines = trimLines(lines);
  const tableHeaderLine = getTableHeaderLine(lines);
  const tableHeaderLineIndex = lines.indexOf(tableHeaderLine);
  const tableEndLineIndex = trimmedLines.findIndex(line => line.startsWith('Entrypoint'));

  return lines.slice(tableHeaderLineIndex, tableEndLineIndex).join('\n');
};

const getParsedChunkTable = (value) => {
  if (!value) {
    return null;
  }

  const chunkTable = getChunkTable(value);
  return parseTable(chunkTable);
};

const unescape = (html) => {
  const el = document.createElement('textarea');
  el.innerHTML = html;
  return el.value;
};

const Diff = ({ size, newSize }) => {
  const parsedSize = parseSize(size);

  const format = (num) => {
    const [diffValue, diffUnit] = addUnit(num);
    return [diffValue.toFixed(2), ' ', diffUnit];
  };

  if (!newSize) {
    return format(parsedSize);
  }

  const parsedNewSize = parseSize(newSize);

  const diff = parsedNewSize - parsedSize;
  const diffPercent = ((parsedNewSize / parsedSize) * 100) - 100;

  const risen = diff > 0;

  return (
    <>
      {format(parsedSize)}
      {' '}
      →
      {' '}
      {format(parsedNewSize)}
      {' '}
      ({format(diff)}; {diffPercent.toFixed(2)}% {risen ? '⬈' : '⬊'})
    </>
  );
};

export default class Comparison extends Component {
  static getDerivedStateFromProps(nextProps) {
    const leftData = getParsedChunkTable(nextProps.left);
    const rightData = getParsedChunkTable(nextProps.right);

    console.log(leftData, rightData);

    return {
      leftData,
      rightData,
    };
  }

  state = {};

  get diffData() {
    const { leftData, rightData } = this.state;

    if (!leftData || !rightData) {
      return {};
    }

    const newAssets = rightData
      .filter(rightEl => !leftData.find(leftEl => leftEl.Asset === rightEl.Asset));
    const removedAssets = leftData
      .filter(leftEl => !rightData.find(rightEl => leftEl.Asset === rightEl.Asset));
    const changedAssets = leftData
      .filter((leftElement) => {
        const rightElement = rightData.find(rightEl => leftElement.Asset === rightEl.Asset);
        if (!rightElement) {
          return false;
        }
        return leftElement.Size !== rightElement.Size;
      })
      .map((leftElement) => {
        const rightElement = rightData.find(rightEl => leftElement.Asset === rightEl.Asset);

        return {
          Asset: leftElement.Asset,
          Size: leftElement.Size,
          newSize: rightElement.Size,
        };
      });

    return {
      newAssets,
      removedAssets,
      changedAssets,
    };
  }

  // eslint-disable-next-line
  renderChunk(chunk) {
    return (
      <>
        * **{chunk.Asset}**:
        {' '}
        {<Diff
          size={chunk.Size}
          newSize={chunk.newSize}
        /> || chunk.Size}
        {'\n'}
      </>
    );
  }

  // eslint-disable-next-line
  renderSection(title, chunks) {
    if (!chunks || !chunks.length) {
      return null;
    }

    return (
      <>
        ## {title}{'\n'}
        {chunks.map(this.renderChunk)}
        {'\n'}
      </>
    );
  }

  renderSummary() {
    const { leftData, rightData } = this.state;

    if (!leftData || !rightData) {
      return null;
    }

    const size = leftData.reduce((sum, chunk) => sum + parseSize(chunk.Size), 0);
    const newSize = rightData.reduce((sum, chunk) => sum + parseSize(chunk.Size), 0);

    return (
      <>
        ## Summary{'\n'}
        **Total size**:
        {' '}
        <Diff
          size={size}
          newSize={newSize}
        />
      </>
    );
  }

  renderSource() {
    const { newAssets, removedAssets, changedAssets } = this.diffData;

    return (
      <>
        {this.renderSection('New assets', newAssets)}
        {this.renderSection('Removed assets', removedAssets)}
        {this.renderSection('Changed assets', changedAssets)}
        {this.renderSummary()}
      </>
    );
  }

  render() {
    const source = this.renderSource();
    const textSource = renderToStaticMarkup(source);

    return (
      <div className="Comparison">
        <div>
          <h3>Comparison</h3>
          <p>Copy &amp; paste this to Pull Request description.</p>
        </div>
        <div className="Comparison__source">
          <h4>Source</h4>
          <textarea
            onFocus={(event) => {
              event.target.select();
            }}
            ref={(ref) => {
              if (ref) {
                // eslint-disable-next-line
                ref.value = unescape(textSource);
              }
            }}
          />
        </div>
        <div className="Comparison__preview">
          <h4>Preview</h4>
          <ReactMarkdown source={textSource} />
        </div>
      </div>
    );
  }
}
