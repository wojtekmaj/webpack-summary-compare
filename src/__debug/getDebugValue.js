function* getDebugValue() {
  yield `Hash: 2f168e1f7de11a759d50
Version: webpack 4.20.2
Time: 10000ms
Built at: 19.10.2018 13:24:53
            Asset     Size   Chunks             Chunk Names
another.bundle.js    1 MiB  another  [emitted]  another
removed.bundle.js  220 KiB  another  [emitted]  another
  index.bundle.js  550 KiB    index  [emitted]  index
  child.bundle.js  141 KiB    index  [emitted]  index
Entrypoint index = index.bundle.js
Entrypoint another = another.bundle.js`;

  yield `Hash: 73ef49f087689d980c7e
Version: webpack 4.20.2
Time: 10000ms
Built at: 19.10.2018 13:24:53
            Asset     Size   Chunks             Chunk Names
another.bundle.js  440 KiB  another  [emitted]  another
 newone.bundle.js   90 KiB  another  [emitted]  another
  index.bundle.js  550 KiB    index  [emitted]  index
  child.bundle.js  140 KiB    index  [emitted]  index
Entrypoint index = index.bundle.js
Entrypoint another = another.bundle.js`;
}

export default getDebugValue();
