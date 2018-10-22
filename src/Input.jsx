import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Input.less';

import getDebugValue from './__debug/getDebugValue';

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
  }

  state = {
    value: getDebugValue.next().value,
  }

  componentDidMount() {
    this.onTableUpdate();
  }

  onChange = (event) => {
    const { value } = event.target;

    setRows(event.target);

    this.setState({ value }, this.onTableUpdate);
  }

  onTableUpdate = () => {
    const { onChange } = this.props;
    const { value } = this.state;

    if (onChange) {
      onChange(value);
    }
  }

  render() {
    const { id, label } = this.props;
    const { value } = this.state;

    return (
      <div className="Input">
        <h4><label htmlFor={id}>{label}</label></h4>
        <textarea
          id={id}
          value={value}
          onChange={this.onChange}
          ref={setRows}
          wrap="off"
        />
      </div>
    );
  }
}
