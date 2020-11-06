import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { renderToStaticMarkup } from 'react-dom/server';

import './Comparison.less';

import Section, { isAssets } from './Comparison/Section';
import Summary, { isData } from './Comparison/Summary';
import TextSource from './Comparison/TextSource';
import Preview from './Comparison/Preview';

import {
  getStatProperties,
  getParsedAssetsTable,
} from './utils/assets_table';

const unescape = (html) => {
  const el = document.createElement('textarea');
  el.innerHTML = html;
  return el.value;
};

function renderSource({ diffData, leftData, rightData }) {
  const { newAssets, removedAssets, changedAssets } = diffData;

  return (
    <>
      <Section assets={newAssets} title="✨ New assets" />
      <Section assets={removedAssets} title="🗑️ Removed assets" />
      <Section assets={changedAssets} title="✏️ Changed assets" />
      <Summary leftData={leftData} rightData={rightData} />
    </>
  );
}

renderSource.propTypes = {
  diffData: PropTypes.shape({
    changedAssets: isAssets,
    newAssets: isAssets,
    removedAssets: isAssets,
  }),
  leftData: isData,
  rightData: isData,
};

function getTextSource({ diffData, leftData, rightData }) {
  const source = renderSource({ diffData, leftData, rightData });
  return unescape(renderToStaticMarkup(source));
}

export default function Comparison({ left, right }) {
  const leftData = useMemo(() => left && ({
    assets: getParsedAssetsTable(left),
    stats: getStatProperties(left),
  }), [left]);

  const rightData = useMemo(() => right && ({
    assets: getParsedAssetsTable(right),
    stats: getStatProperties(right),
  }), [right]);

  const diffData = useMemo(() => {
    if (!leftData || !rightData) {
      return {};
    }

    const newAssets = rightData.assets
      .filter((rightEl) => !leftData.assets.find((leftEl) => leftEl.Asset === rightEl.Asset));

    const removedAssets = leftData.assets
      .filter((leftEl) => !rightData.assets.find((rightEl) => leftEl.Asset === rightEl.Asset));

    const changedAssets = leftData.assets
      .filter((leftElement) => {
        const rightElement = rightData.assets
          .find((rightEl) => leftElement.Asset === rightEl.Asset);

        if (!rightElement) {
          return false;
        }

        return leftElement.Size !== rightElement.Size;
      })
      .map((leftElement) => {
        const rightElement = rightData.assets
          .find((rightEl) => leftElement.Asset === rightEl.Asset);

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
  }, [leftData, rightData]);

  const textSource = getTextSource({ diffData, leftData, rightData });

  return (
    <section className="Comparison">
      <div>
        <h2>Comparison</h2>
        <p>Copy &amp; paste this to Pull Request description.</p>
      </div>
      <TextSource textSource={textSource} />
      <Preview textSource={textSource} />
    </section>
  );
}

Comparison.propTypes = {
  left: PropTypes.string,
  right: PropTypes.string,
};
