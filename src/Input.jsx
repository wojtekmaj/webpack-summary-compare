import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import './Input.less';

import DragAndDrop from './DragAndDrop';

const setRows = (el) => {
  if (!el) {
    return;
  }

  const { value } = el;
  const lines = value.split('\n').length;

  // eslint-disable-next-line
  el.rows = lines;
};

export default function Input({
  id, label, onChange, value,
}) {
  const textarea = useRef();

  useEffect(() => {
    setRows(textarea.current);
  }, [value]);

  function onChangeInternal(event) {
    const { value: nextValue } = event.target;

    onChange(nextValue);
  }

  function onDnDChange([firstValue]) {
    onChange(firstValue);
  }

  return (
    <DragAndDrop
      acceptOnlyNFiles={1}
      onChange={onDnDChange}
    >
      <div className="Input">
        <h3>
          <label htmlFor={id}>{label}</label>
        </h3>
        <textarea
          id={id}
          value={value}
          onChange={onChangeInternal}
          ref={(ref) => {
            if (ref) {
              setRows(ref);
            }

            textarea.current = ref;
          }}
          wrap="off"
        />
      </div>
    </DragAndDrop>
  );
}

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.string,
};
