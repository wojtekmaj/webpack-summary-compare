import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Input.less';

import getDebugValue from './__debug/getDebugValue';
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

export default class Input extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func,
  };

  state = {
    value: getDebugValue.next().value,
  };

  componentDidMount() {
    this.onTableUpdate();
  }

  onChange = (event) => {
    const { value } = event.target;

    this.setState({ value }, this.onTableUpdate);
  }

  onDnDChange = ([firstValue]) => {
    this.setState({ value: firstValue }, this.onTableUpdate);
  }

  onTableUpdate = () => {
    const { onChange } = this.props;
    const { value } = this.state;

    setRows(this.textarea);

    if (onChange) {
      onChange(value);
    }
  }

  render() {
    const { id, label } = this.props;
    const { value } = this.state;

    return (
      <DragAndDrop
        onlyAccept={1}
        onChange={this.onDnDChange}
      >
        <div className="Input">
          <h3>
            <label htmlFor={id}>{label}</label>
          </h3>
          <textarea
            id={id}
            value={value}
            onChange={this.onChange}
            ref={(ref) => {
              if (ref) {
                setRows(ref);
              }

              this.textarea = ref;
            }}
            wrap="off"
          />
        </div>
      </DragAndDrop>
    );
  }
}
