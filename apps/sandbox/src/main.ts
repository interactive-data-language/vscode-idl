import { camelCase, pascalCase } from 'case-anything';

const samples = ['TEST_VALUE', 'test_value', 'testValue', '_testValue'];

for (let i = 0; i < samples.length; i++) {
  console.log(
    camelCase(samples[i], { keep: ['_'] }),
    pascalCase(samples[i], { keep: ['_'] })
  );
}
