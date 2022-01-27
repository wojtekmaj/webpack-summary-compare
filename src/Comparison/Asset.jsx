import PropTypes from 'prop-types';

import FileIcon from '../FileIcon';
import SizeDiff from '../SizeDiff';

function cutString(str, max) {
  return str.length > max
    ? `${str.slice(0, max / 2)}…${str.slice(str.length - max / 2, str.length)}`
    : str;
}

function unescapeMd(md) {
  return md.replace(/\\([[\]])/g, '$1');
}

export default function Asset({ asset }) {
  if (!asset.Asset || !asset.Size) {
    // eslint-disable-next-line
    console.warn('Invalid asset:', asset);
    return null;
  }

  const filename = (() => {
    const isMap = asset.Asset.endsWith('.map');

    const shortenedFilename = cutString(asset.Asset, 80)
      .replace(/~/g, '&shy;&#126;')
      .replace(/_/g, '&shy;&#95;');
    const wrappedShortenedFilename = `<span title="${unescapeMd(
      asset.Asset,
    )}">${shortenedFilename}</span>`;

    if (isMap) {
      return wrappedShortenedFilename;
    }

    return `**${wrappedShortenedFilename}**`;
  })();

  return (
    <>
      | <FileIcon filename={asset.Asset} /> {filename} |{' '}
      {<SizeDiff a={asset.Size} b={asset.newSize} /> || asset.Size} |{'\n'}
    </>
  );
}

export const isAsset = PropTypes.shape({
  Asset: PropTypes.string,
  newSize: PropTypes.string,
  Size: PropTypes.string,
});

Asset.propTypes = {
  asset: isAsset.isRequired,
};
