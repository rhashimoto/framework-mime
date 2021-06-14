// import { getJasmineFramework } from 'web-test-runner-jasmine';

export default {
  files: ['test/*.test.js'],
  nodeResolve: true,

  testFramework: {
    path: 'custom-framework.js',
  }
}