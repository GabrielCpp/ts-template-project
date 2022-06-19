export default {
  verbose: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleDirectories: ['node_modules', 'bower_components', 'shared'],
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
      astTransformers: {
        before: [
          {
            path: 'typescript-transform-paths',
            options: {
              baseUrl: '.',
              afterDeclarations: true,
              paths: {
                '*': ['*'],
              },
            },
          },
        ],
      },
    },
  },
  rootDir: '',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  setupFiles: ['<rootDir>/test/setup.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
