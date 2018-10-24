import React, { Component } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';

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

const readFileAsText = (file) => {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onerror = (error) => {
      fileReader.abort();
      reject(error);
    };

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.readAsText(file);
  });
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

    this.setState({ value }, this.onTableUpdate);
  }

  onTableUpdate = () => {
    const { onChange } = this.props;
    const { value } = this.state;

    setRows(this.textarea);

    if (onChange) {
      onChange(value);
    }
  }

  onDragOver = (event) => {
    event.preventDefault();

    this.setState({
      dragOverActive: true,
    });
  };

  onDrop = (event) => {
    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();

    const files = (() => {
      if (event.dataTransfer.items) {
        return Array.from(event.dataTransfer.items)
          .filter(item => item.kind === 'file')
          .map(item => item.getAsFile());
      }

      return Array.from(event.dataTransfer.files);
    })();

    if (files.length === 0) {
      return;
    }

    const [firstFile] = files;

    readFileAsText(firstFile).then((value) => {
      this.setState({ value }, this.onTableUpdate);
    });

    this.cleanupDrag(event);
  };

  cleanupDrag = (event) => {
    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to remove the drag data
      event.dataTransfer.items.clear();
    } else {
      // Use DataTransfer interface to remove the drag data
      event.dataTransfer.clearData();
    }

    this.onDragLeave();
  }

  onDragLeave = () => {
    this.setState({
      dragOverActive: false,
    });
  }

  render() {
    const { id, label } = this.props;
    const { dragOverActive, value } = this.state;

    return (
      <div
        className={mergeClassNames('Input', dragOverActive && 'Input--dragOverActive')}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      >
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
    );
  }
}
