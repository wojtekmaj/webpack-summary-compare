import React, { Component } from 'react';

import './InputWrapper.less';

import getDebugValue from './__debug/getDebugValue';

import Comparison from './Comparison';
import InputWrapper from './InputWrapper';

export default class Root extends Component {
  state = {
    left: getDebugValue.next().value,
    right: getDebugValue.next().value,
  }

  onChangeLeft = value => this.setState({ left: value });

  onChangeRight = value => this.setState({ right: value });

  render() {
    const { left, right } = this.state;
    return (
      <>
        <h1>Webpack summary compare</h1>
        <main>
          <InputWrapper
            onChangeLeft={this.onChangeLeft}
            onChangeRight={this.onChangeRight}
            valueLeft={left}
            valueRight={right}
          />
          <Comparison
            left={left.trim()}
            right={right.trim()}
          />
        </main>
      </>
    );
  }
}
