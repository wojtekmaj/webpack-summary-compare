import React from 'react';
import PropTypes from 'prop-types';

import Asset, { isAsset } from './Asset';

export default function Section({ assets, title }) {
  if (!assets || !assets.length) {
    return null;
  }

  const sortedAssets = assets.sort((a, b) => a.Asset.localeCompare(b.Asset));

  return (
    <>
      ##
      {' '}
      {title}
      {'\n'}
      | Asset | Size |
      {'\n'}
      | ----- | ---- |
      {'\n'}
      {sortedAssets.map((asset, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Asset key={index} asset={asset} />
      ))}
      {'\n'}
    </>
  );
}

export const isAssets = PropTypes.arrayOf(isAsset);

Section.propTypes = {
  assets: isAssets.isRequired,
  title: PropTypes.string,
};
