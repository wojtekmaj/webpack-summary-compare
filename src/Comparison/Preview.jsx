import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';

const ReactMarkdown = lazy(() => new Promise((resolve, reject) => {
  import('../react-markdown')
    .then((result) => resolve(result.default ? result : { default: result }))
    .catch(reject);
}));

export default function Preview({ textSource }) {
  return (
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
  );
}

Preview.propTypes = {
  textSource: PropTypes.string,
};