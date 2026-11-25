// .eslintrc.cjs (CommonJS, compatible ESLint v8)
module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    // 2022 : nécessaire pour le top-level await de src/app.js
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  // Ne jamais linter le rapport de couverture généré
  ignorePatterns: ['coverage/', 'node_modules/'],
  rules: {}
}
