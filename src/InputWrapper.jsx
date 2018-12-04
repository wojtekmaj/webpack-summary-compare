import React from 'react';
import PropTypes from 'prop-types';

import './InputWrapper.less';

import Input from './Input';

const InputWrapper = ({ onChangeLeft, onChangeRight, valueLeft, valueRight }) => (
  <section className="InputWrapper">
    <div>
      <h2>Input</h2>
      <p>Paste Webpack outputs here or drag and drop a text file on the field.</p>
    </div>
    <Input
      id="left"
      label="Left"
      onChange={onChangeLeft}
      value={valueLeft}
    />
    <Input
      id="right"
      label="Right"
      onChange={onChangeRight}
      value={valueRight}
    />
  </section>
);

InputWrapper.propTypes = {
  onChangeLeft: PropTypes.func.isRequired,
  onChangeRight: PropTypes.func.isRequired,
  valueLeft: PropTypes.string,
  valueRight: PropTypes.string,
};

export default InputWrapper;
