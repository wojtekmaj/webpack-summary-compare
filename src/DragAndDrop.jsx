import React, { Component } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';

import './DragAndDrop.less';

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

export default class DragAndDrop extends Component {
  state = {
    isActive: false,
  };

  onDragOver = (event) => {
    if (!this.shouldReact(event)) {
      return;
    }

    event.preventDefault();

    this.setState({
      isActive: true,
    });
  };

  onDrop = (event) => {
    if (!this.shouldReact(event)) {
      return;
    }

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

    const { onChange } = this.props;

    Promise.all(files.map(readFileAsText)).then(onChange);

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
      isActive: false,
    });
  }

  shouldReact(event) {
    const { acceptOnlyNFiles } = this.props;

    if (acceptOnlyNFiles && event.dataTransfer.items.length !== acceptOnlyNFiles) {
      return false;
    }

    return true;
  }

  render() {
    const { children } = this.props;
    const { isActive } = this.state;

    return (
      <div
        className={mergeClassNames('DragAndDrop', isActive && 'DragAndDrop--active')}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      >
        {children}
      </div>
    );
  }
}

DragAndDrop.propTypes = {
  children: PropTypes.node,
  onChange: PropTypes.func,
  acceptOnlyNFiles: PropTypes.number,
};
