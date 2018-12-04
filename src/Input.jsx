import React, { Component } from 'react';
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

export default class Input extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    value: PropTypes.string,
  };

  componentDidMount() {
    setRows(this.textarea);
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;

    if (value !== prevProps.value) {
      setRows(this.textarea);
    }
  }

  onChange = (event) => {
    const { onChange } = this.props;
    const { value } = event.target;

    onChange(value);
  }

  onDnDChange = ([firstValue]) => {
    const { onChange } = this.props;

    onChange(firstValue);
  }

  render() {
    const { id, label, value } = this.props;

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
