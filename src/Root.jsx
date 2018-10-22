import React, { Component } from 'react';

import './InputWrapper.less';

import Comparison from './Comparison';
import InputWrapper from './InputWrapper';

export default class Root extends Component {
  state = {
    left: null,
    right: null,
  }

  onChangeLeft = value => this.setState({ left: value });

  onChangeRight = value => this.setState({ right: value });

  render() {
    const { left, right } = this.state;
    return (
      <>
        <h1>Webpack summary compare</h1>
        <main>
          <InputWrapper onChangeLeft={this.onChangeLeft} onChangeRight={this.onChangeRight} />
          <Comparison left={left} right={right} />
        </main>
      </>
    );
  }
}
