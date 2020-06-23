import React, { Component } from 'react';
import PropTypes from 'prop-types';

const fallbackCopy = (text) => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  const result = document.execCommand('copy');
  document.body.removeChild(textArea);
  if (!result) {
    throw new Error('execCommand failed');
  }
};

const copy = async (text) => {
  try {
    if (!navigator.clipboard) {
      throw new Error('Clipboard API not supported');
    }

    const permission = await navigator.permissions.query({ name: 'clipboard-write' });

    if (permission.state === 'granted' || permission.state === 'prompt') {
      await navigator.clipboard.writeText(text);
    } else {
      throw new Error('clipboard-write permission not granted');
    }
  } catch (error) {
    fallbackCopy(text);
  }
};

export default class CopyButton extends Component {
  static defaultProps = {
    children: 'Copy',
    confirmationLabel: 'Copied!',
    failureLabel: 'Failed to copy',
    temporaryLabelTimeout: 3000,
  };

  state = {
    copyState: null,
  }

  get label() {
    const { children, confirmationLabel, failureLabel } = this.props;
    const { copyState } = this.state;

    if (copyState === null) {
      return children;
    }

    return copyState ? confirmationLabel : failureLabel;
  }

  onClick = async () => {
    const { temporaryLabelTimeout, text } = this.props;

    const reset = () => setTimeout(() => this.setState({ copyState: null }), temporaryLabelTimeout);

    try {
      await copy(text);
      this.setState({ copyState: true }, reset);
    } catch (error) {
      this.setState({ copyState: false }, reset);
    }
  }

  render() {
    const { label } = this;
    const { copyState } = this.state;

    return (
      <button
        type="button"
        onClick={this.onClick}
        disabled={copyState === true}
      >
        {label}
      </button>
    );
  }
}

CopyButton.propTypes = {
  children: PropTypes.node,
  confirmationLabel: PropTypes.node,
  failureLabel: PropTypes.node,
  temporaryLabelTimeout: PropTypes.number,
  text: PropTypes.string.isRequired,
};
