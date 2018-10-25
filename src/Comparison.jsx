import React, { lazy, Component, Suspense } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import './Comparison.less';

import Diff from './Diff';
import SizeDiff from './SizeDiff';

import parseTable from './utils/parse_ascii_table';
import { parseSize } from './utils/units';

const ReactMarkdown = lazy(() => new Promise((resolve, reject) => {
  import('react-markdown/with-html')
    .then((result) => {
      if (result.default) {
        resolve(result);
      } else {
        resolve({ default: result });
      }
    })
    .catch(reject);
}));

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

const getStatProperty = (value, key) => {
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

const getParsedAssetsTable = (value) => {
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

const getStatProperties = value => ['Hash', 'Version', 'Time', 'Built at']
  .reduce((result, key) => ({
    ...result,
    [key]: getStatProperty(value, key),
  }), {});

const unescape = (html) => {
  const el = document.createElement('textarea');
  el.innerHTML = html;
  return el.value;
};

export default class Comparison extends Component {
  static getDerivedStateFromProps(nextProps) {
    const { left, right } = nextProps;

    const leftData = left && {
      assets: getParsedAssetsTable(left),
      stats: getStatProperties(left),
    };

    const rightData = right && {
      assets: getParsedAssetsTable(right),
      stats: getStatProperties(right),
    };

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

    const newAssets = rightData.assets
      .filter(rightEl => !leftData.assets.find(leftEl => leftEl.Asset === rightEl.Asset));
    const removedAssets = leftData.assets
      .filter(leftEl => !rightData.assets.find(rightEl => leftEl.Asset === rightEl.Asset));
    const changedAssets = leftData.assets
      .filter((leftElement) => {
        const rightElement = rightData.assets.find(rightEl => leftElement.Asset === rightEl.Asset);
        if (!rightElement) {
          return false;
        }
        return leftElement.Size !== rightElement.Size;
      })
      .map((leftElement) => {
        const rightElement = rightData.assets.find(rightEl => leftElement.Asset === rightEl.Asset);

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
        | **{asset.Asset}** |
        {' '}
        {<SizeDiff
          size={asset.Size}
          newSize={asset.newSize}
        /> || asset.Size}
        {' '}
        |{'\n'}
      </>
    );
  }

  // eslint-disable-next-line
  renderSection(title, assets) {
    if (!assets || !assets.length) {
      return null;
    }

    const sortedAssets = assets.sort((a, b) => a.Asset > b.Asset);

    return (
      <>
        ## {title}{'\n'}
        | Asset | Size |{'\n'}
        | ----- | ---- |{'\n'}
        {sortedAssets.map(this.renderAsset)}
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
    const size = leftData.assets.reduce(sumSizes, 0);
    const newSize = rightData.assets.reduce(sumSizes, 0);
    const time = leftData.stats.Time;
    const newTime = rightData.stats.Time;

    return (
      <>
        ## Summary{'\n'}
        **Total size**:
        {' '}
        <SizeDiff
          size={size}
          newSize={newSize}
        />
        {'\n'}{'\n'}
        **Time**:
        {' '}
        <Diff
          value={time}
          newValue={newTime}
          unit="ms"
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

  getTextSource() {
    const source = this.renderSource();
    return unescape(renderToStaticMarkup(source));
  }

  render() {
    const textSource = this.getTextSource();

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
            value={textSource}
          />
        </div>
        <div className="Comparison__preview">
          <h3>Preview</h3>
          <div className="Comparison__preview__body">
            <Suspense fallback={<p>Loading preview...</p>}>
              <ReactMarkdown
                // Have to change &shy; into <wbr /> as React-Markdown has issues rendering these
                source={textSource.replace(/&shy;/g, '<wbr />')}
                escapeHtml={false}
              />
            </Suspense>
          </div>
        </div>
      </section>
    );
  }
}
