import React from 'react';
import PropTypes from 'prop-types';

import Diff from '../Diff';
import SizeDiff from '../SizeDiff';

import { parseSize } from '../utils/units';

export default function Summary({ leftData, rightData }) {
  if (!leftData || !rightData) {
    return null;
  }

  const { assets: leftAssets } = leftData;
  const { assets: rightAssets } = rightData;

  const sumSizes = (sum, asset) => sum + parseSize(asset.Size);
  const onlyMaps = (asset) => asset.Asset.endsWith('.map');
  const excludeMaps = (asset) => !onlyMaps(asset);

  const mapsPresent = leftAssets.some(onlyMaps) || rightAssets.some(onlyMaps);

  const size = leftAssets.reduce(sumSizes, 0);
  const newSize = rightAssets.reduce(sumSizes, 0);

  const sizeNoMap = leftAssets.filter(excludeMaps).reduce(sumSizes, 0);
  const newSizeNoMap = rightAssets.filter(excludeMaps).reduce(sumSizes, 0);

  const { Time: time } = leftData.stats;
  const { Time: newTime } = rightData.stats;

  return (
    <>
      ## Summary
      {'\n'}
      **Total size**:
      {' '}
      <SizeDiff
        a={size}
        b={newSize}
      />
      {'\n'}
      {'\n'}
      {mapsPresent && (
        <>
          **Total size excl. source maps**:
          {' '}
          <SizeDiff
            a={sizeNoMap}
            b={newSizeNoMap}
          />
          {'\n'}
          {'\n'}
        </>
      )}
      **Time**:
      {' '}
      <Diff
        a={time}
        b={newTime}
        unit="ms"
      />
    </>
  );
}

const isAssets = PropTypes.shape({});

const isStats = PropTypes.shape({
  Time: PropTypes.string,
});

export const isData = PropTypes.shape({
  assets: PropTypes.arrayOf(isAssets),
  stats: isStats,
});

Summary.propTypes = {
  leftData: isData,
  rightData: isData,
};
