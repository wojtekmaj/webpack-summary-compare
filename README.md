[![CI](https://github.com/wojtekmaj/webpack-summary-compare/workflows/CI/badge.svg)](https://github.com/wojtekmaj/webpack-summary-compare/actions)

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
another.bundle-2f168e1f7de11a759d50.js    1 MiB  another  [emitted]  another
removed.bundle-2f168e1f7de11a759d50.js  220 KiB  another  [emitted]  another
  index.bundle-2f168e1f7de11a759d50.js  550 KiB    index  [emitted]  index
  child.bundle-2f168e1f7de11a759d50.js  141 KiB    index  [emitted]  index
Entrypoint index = index.bundle.js
Entrypoint another = another.bundle.js
```

### Input B

```
Hash: c926516bc19d8d5e9e4a
Version: webpack 4.20.2
Time: 9870ms
Built at: 19.10.2018 13:24:53
                                 Asset      Size   Chunks             Chunk Names
another.bundle-c926516bc19d8d5e9e4a.js   440 KiB  another  [emitted]  another
 newone.bundle-c926516bc19d8d5e9e4a.js  90.1 KiB  another  [emitted]  another
  index.bundle-c926516bc19d8d5e9e4a.js   550 KiB    index  [emitted]  index
  child.bundle-c926516bc19d8d5e9e4a.js   140 KiB    index  [emitted]  index
Entrypoint index = index.bundle.js
Entrypoint another = another.bundle.js
```

### Output

```
## ✨ New assets
| Asset | Size |
| ----- | ---- |
| **newone.bundle-\[hash\].js** | 90.1 KiB |

## 🗑️ Removed assets
| Asset | Size |
| ----- | ---- |
| **removed.bundle-\[hash\].js** | 220 KiB |

## ✏️ Changed assets
| Asset | Size |
| ----- | ---- |
| **another.bundle-\[hash\].js** | 1 MiB → 440 KiB (-584 KiB; -57.03% ↘) |
| **child.bundle-\[hash\].js** | 141 KiB → 140 KiB (-1 KiB; -0.71% ↘) |

## Summary
**Total size**: 1.89 MiB → 1.19 MiB (-714.9 KiB; -36.95% ↘)

**Time**: 10000 ms → 9870 ms (-130 ms; -1.30% ↘)
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
