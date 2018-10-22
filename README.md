# webpack-summary-compare

Generates a summary of differences between two Webpack summaries. Can come in handy when we'd like to give a quick summary of the impact of our changes in Pull Request description.

## Sample input & output

### Input A

```
Hash: 2f168e1f7de11a759d50
Version: webpack 4.20.2
Time: 10000ms
Built at: 19.10.2018 13:24:53
            Asset     Size   Chunks             Chunk Names
another.bundle.js    1 MiB  another  [emitted]  another
removed.bundle.js  220 KiB  another  [emitted]  another
  index.bundle.js  550 KiB    index  [emitted]  index
  child.bundle.js  141 KiB    index  [emitted]  index
Entrypoint index = index.bundle.js
Entrypoint another = another.bundle.js
```

### Input B

```
Hash: 73ef49f087689d980c7e
Version: webpack 4.20.2
Time: 10000ms
Built at: 19.10.2018 13:24:53
            Asset      Size   Chunks             Chunk Names
another.bundle.js   440 KiB  another  [emitted]  another
 newone.bundle.js  90.1 KiB  another  [emitted]  another
  index.bundle.js   550 KiB    index  [emitted]  index
  child.bundle.js   140 KiB    index  [emitted]  index
Entrypoint index = index.bundle.js
Entrypoint another = another.bundle.js
```

### Output

```
## ✨ New assets
* **newone.bundle.js**: 90.10 KiB

## 🗑️ Removed assets
* **removed.bundle.js**: 220.00 KiB

## ✏️ Changed assets
* **another.bundle.js**: 1.00 MiB → 440.00 KiB (-584.00 KiB; -57.03% ⬊)
* **child.bundle.js**: 141.00 KiB → 140.00 KiB (-1.00 KiB; -0.71% ⬊)

## Summary
**Total size**: 1.89 MiB → 1.19 MiB (-714.90 KiB; -36.95% ⬊)
```

## License

The MIT License.

## Author

<table>
  <tr>
    <td>
      <img src="https://github.com/wojtekmaj.png?s=100" width="100">
    </td>
    <td>
      Wojciech Maj<br />
      <a href="mailto:kontakt@wojtekmaj.pl">kontakt@wojtekmaj.pl</a><br />
      <a href="http://wojtekmaj.pl">http://wojtekmaj.pl</a>
    </td>
  </tr>
</table>