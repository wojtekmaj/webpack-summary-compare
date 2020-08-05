import React, { useState } from 'react';

import './InputWrapper.less';

import getDebugValue from './__debug/getDebugValue';

import Comparison from './Comparison';
import InputWrapper from './InputWrapper';

export default function Root() {
  const [left, setLeft] = useState(getDebugValue.next().value);
  const [right, setRight] = useState(getDebugValue.next().value);

  return (
    <>
      <h1>Webpack summary compare</h1>
      <main>
        <InputWrapper
          onChangeLeft={setLeft}
          onChangeRight={setRight}
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
