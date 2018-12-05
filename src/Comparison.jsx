import React, { lazy, Component, Suspense } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import './Comparison.less';

import CopyButton from './CopyButton';
import Diff from './Diff';
import SizeDiff from './SizeDiff';

import {
  getStatProperties,
  getParsedAssetsTable,
} from './utils/assets_table';
import { parseSize } from './utils/units';

const ReactMarkdown = lazy(() => new Promise((resolve, reject) => {
  import('react-markdown')
    .then(result => resolve(result.default ? result : { default: result }))
    .catch(reject);
}));

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

    const sortedAssets = assets.sort((a, b) => a.Asset.localeCompare(b.Asset));

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

    const { assets: leftAssets } = leftData;
    const { assets: rightAssets } = rightData;

    const sumSizes = (sum, asset) => sum + parseSize(asset.Size);
    const onlyMaps = asset => asset.Asset.endsWith('.map');
    const excludeMaps = asset => !onlyMaps(asset);

    const mapsPresent = leftAssets.some(onlyMaps) || rightAssets.some(onlyMaps);

    const size = leftAssets.reduce(sumSizes, 0);
    const newSize = rightAssets.reduce(sumSizes, 0);

    const sizeNoMap = leftAssets.filter(excludeMaps).reduce(sumSizes, 0);
    const newSizeNoMap = rightAssets.filter(excludeMaps).reduce(sumSizes, 0);

    const { Time: time } = leftData.stats;
    const { Time: newTime } = rightData.stats;

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
        {mapsPresent && (
          <>
            **Total size excl. source maps**:
            {' '}
            <SizeDiff
              size={sizeNoMap}
              newSize={newSizeNoMap}
            />
            {'\n'}{'\n'}
          </>
        )}
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
          <CopyButton
            label="Copy source"
            text={textSource}
          />
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
