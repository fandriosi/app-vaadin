import resolve from 'rollup-plugin-node-resolve';
 
export default {
  input: 'src/app.js',
  output: {
    file: 'src/bundle.js',
    format: 'iife'
  },
  name: 'MyModule',
  plugins: [
    resolve({jsnext: true}),
  ]
};