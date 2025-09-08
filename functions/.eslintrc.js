module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    "ecmaVersion": 2018,
  },
  extends: [
    "eslint:recommended",
  ],
  rules: {
    "no-restricted-globals": "off",
    "prefer-arrow-callback": "off",
    "quotes": "off",
    "no-extra-boolean-cast": "off",
    "no-constant-condition": "off",
    "no-func-assign": "off",
    "no-sequences": "off",
    "no-useless-constructor": "off",
    "no-undef": "off",
    "no-unused-expressions": "off",
    "eqeqeq": "off",
    "no-unused-vars": "off",
    "no-mixed-operators": "off",
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
