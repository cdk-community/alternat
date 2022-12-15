const { off } = require('process');
const { awscdk } = require('projen');
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Ben Whaley',
  cdkVersion: '2.53.0',
  defaultReleaseBranch: 'main',
  license: 'MIT',
  gitignore: ['cdk.context.json', 'cdk.out'],
  name: 'alternat',
  repositoryUrl: 'git@github.com:cdk-community/alternat.git',
  tsconfig: {
    compilerOptions: {
      esModuleInterop: true,
    },
  },
  eslintOptions: {
    prettier: true,
  },
  license: 'MIT',
  licensed: true,
  jestOptions: {
    coverageText: false,
  },

  bundledDeps: ['loglevel@^1.8.1'],
  deps: ['loglevel@^1.8.1'],

  keywords: ['alternat', 'aws', 'aws-cdk', 'cdk', 'cdk-construct', 'nat'],

  description:
    'A high availability implementation of NAT instances designed to reduce NAT Gateway data processing costs',

  // Build dependencies for this module.
  devDeps: [
    'prettier@^2.5.1',
    'eslint@^8.7.0',
    '@typescript-eslint/parser@^5.0.1',
    'typescript@^4.4.4',
    'jest@^29.3.1',
  ],
});
project.eslint.addRules({
  'prettier/prettier': [
    'error',
    { singleQuote: true, semi: true, trailingComma: 'es5' },
  ],
});

project.synth();
