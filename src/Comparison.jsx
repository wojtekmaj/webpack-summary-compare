import React, { Component } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';

import './Comparison.less';

import Diff from './Diff';

import parseTable from './parse_ascii_table';
import { parseSize } from './units';

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

const getHash = (value) => {
  const lines = getLines(value);
  const trimmedLines = trimLines(lines);

  const hashLabel = 'Hash: ';
  const hashLine = trimmedLines.find(line => line.startsWith(hashLabel));

  return hashLine.slice(hashLabel.length);
};

const removeHash = (name, hash) => {
  if (!hash) {
    return name;
  }

  return name.replace(hash, '\\[hash\\]');
};

const getParsedAssetsTable = (value) => {
  if (!value) {
    return null;
  }

  const hash = getHash(value);
  const assetsTable = getAssetsTable(value);
  const parsedAssetsTable = parseTable(assetsTable);

  return parsedAssetsTable.map(asset => ({
    ...asset,
    Asset: removeHash(asset.Asset, hash),
  }));
};

const unescape = (html) => {
  const el = document.createElement('textarea');
  el.innerHTML = html;
  return el.value;
};

export default class Comparison extends Component {
  static getDerivedStateFromProps(nextProps) {
    const leftData = getParsedAssetsTable(nextProps.left);
    const rightData = getParsedAssetsTable(nextProps.right);

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
  renderAsset(asset) {
    if (!asset.Asset || !asset.Size) {
      // eslint-disable-next-line
      console.warn('Invalid asset:', asset);
      return null;
    }

    return (
      <>
        * **{asset.Asset}**:
        {' '}
        {<Diff
          size={asset.Size}
          newSize={asset.newSize}
        /> || asset.Size}
        {'\n'}
      </>
    );
  }

  // eslint-disable-next-line
  renderSection(title, assets) {
    if (!assets || !assets.length) {
      return null;
    }

    return (
      <>
        ## {title}{'\n'}
        {assets.map(this.renderAsset)}
        {'\n'}
      </>
    );
  }

  renderSummary() {
    const { leftData, rightData } = this.state;

    if (!leftData || !rightData) {
      return null;
    }

    const sumSizes = (sum, asset) => sum + parseSize(asset.Size);
    const size = leftData.reduce(sumSizes, 0);
    const newSize = rightData.reduce(sumSizes, 0);

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
        {this.renderSection('✨ New assets', newAssets)}
        {this.renderSection('🗑️ Removed assets', removedAssets)}
        {this.renderSection('✏️ Changed assets', changedAssets)}
        {this.renderSummary()}
      </>
    );
  }

  render() {
    const source = this.renderSource();
    const textSource = renderToStaticMarkup(source);

    return (
      <section className="Comparison">
        <div>
          <h2>Comparison</h2>
          <p>Copy &amp; paste this to Pull Request description.</p>
        </div>
        <div className="Comparison__source">
          <h3>Source</h3>
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
          <h3>Preview</h3>
          <ReactMarkdown source={textSource} />
        </div>
      </section>
    );
  }
}
