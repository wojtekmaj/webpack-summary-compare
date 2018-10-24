function* getDebugValue() {
  while (true) {
    yield `Hash: 2f168e1f7de11a759d50
Version: webpack 4.20.2
Time: 10000ms
Built at: 19.10.2018 13:24:53
                                 Asset     Size   Chunks             Chunk Names
another.bundle-2f168e1f7de11a759d50.js    1 MiB  another  [emitted]  another
removed.bundle-2f168e1f7de11a759d50.js  220 KiB  another  [emitted]  another
  index.bundle-2f168e1f7de11a759d50.js  550 KiB    index  [emitted]  index
  child.bundle-2f168e1f7de11a759d50.js  141 KiB    index  [emitted]  index
Entrypoint index = index.bundle.js
Entrypoint another = another.bundle.js`;

    yield `Hash: c926516bc19d8d5e9e4a
Version: webpack 4.20.2
Time: 10000ms
Built at: 19.10.2018 13:24:53
                                 Asset      Size   Chunks             Chunk Names
another.bundle-c926516bc19d8d5e9e4a.js   440 KiB  another  [emitted]  another
 newone.bundle-c926516bc19d8d5e9e4a.js  90.1 KiB  another  [emitted]  another
  index.bundle-c926516bc19d8d5e9e4a.js   550 KiB    index  [emitted]  index
  child.bundle-c926516bc19d8d5e9e4a.js   140 KiB    index  [emitted]  index
Entrypoint index = index.bundle.js
Entrypoint another = another.bundle.js`;
  }
}

export default getDebugValue();
