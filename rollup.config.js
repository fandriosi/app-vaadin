import resolve from '@rollup/plugin-node-resolve';
 
export default {
  input: 'src/app.js',
  output: {
    file: '/home/andriosi/IdeaProjects/venda/src/main/resources/static/js/bundle.js',
    format: 'iife'
  },
  name: 'MyModule',
  plugins: [
    resolve({jsnext: true}),
  ]
};