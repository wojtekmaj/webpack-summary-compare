import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './InputWrapper.less';

import Input from './Input';
import DragAndDrop from './DragAndDrop';

export default class InputWrapper extends Component {
  static propTypes = {
    onChangeLeft: PropTypes.func.isRequired,
    onChangeRight: PropTypes.func.isRequired,
    valueLeft: PropTypes.string,
    valueRight: PropTypes.string,
  };

  onDnDChange = (values) => {
    const { onChangeLeft, onChangeRight } = this.props;

    onChangeLeft(values[0]);
    onChangeRight(values[1]);
  }

  render() {
    const {
      onChangeLeft,
      onChangeRight,
      valueLeft,
      valueRight,
    } = this.props;

    return (
      <DragAndDrop
        acceptOnlyNFiles={2}
        onChange={this.onDnDChange}
      >
        <section className="InputWrapper">
          <div>
            <h2>Input</h2>
            <p>
              Paste Webpack outputs here.
              {' '}
              You can also drop one file on each field, or two files at the same time.
            </p>
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
      </DragAndDrop>
    );
  }
}
