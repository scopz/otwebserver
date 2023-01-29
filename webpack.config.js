const path = require('path');
const fs = require('fs');

const jsFilesConfiguration = [
  // POLYFILLS
  {
    in: [
      'core-js',
      './private/js/_dom/dom-modifications.js',
      'regenerator-runtime/runtime',
    ],
    out: "polyfill.min.js"
  }
];


const tsFilesConfiguration = [
  ...fs.readdirSync('private/js', { withFileTypes:true })
    .filter(element => element.isFile())
    .map(file => file.name.replace(/\.ts$/, ''))
    .map(file => ({
      in: `./private/js/${file}.ts`,
      out: `${file}.min.js`
    }))
];

module.exports = jsFilesConfiguration.map(entry => ({
  entry: entry.in,
  output: {
    path: path.join(__dirname, 'public/js'),
    publicPath: '/',
    filename: entry.out
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}))
.concat(
  tsFilesConfiguration.map(entry => ({
    entry: entry.in,
    output: {
      path: path.join(__dirname, 'public/js'),
      publicPath: '/',
      filename: entry.out,
    },
    module: {
      rules: [
        {
          test: /\.[tj]sx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            },
            'ts-loader',
          ]
        }
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
  }))
);