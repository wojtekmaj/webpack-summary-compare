import React, { Component } from 'react';

import './InputWrapper.less';

import Input from './Input';
import Comparison from './Comparison';

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
          <div className="InputWrapper">
            <div>
              <h3>Input</h3>
              <p>Paste Webpack outputs here.</p>
            </div>
            <Input id="left" label="Left" onChange={this.onChangeLeft} />
            <Input id="right" label="Right" onChange={this.onChangeRight} />
          </div>
          <Comparison left={left} right={right} />
        </main>
      </>
    );
  }
}
