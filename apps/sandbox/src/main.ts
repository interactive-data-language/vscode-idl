import { TransformCase } from '@idl/assembling/shared';

const samples = [
  'url_password_2',
  'TEST_VALUE',
  'test$_value',
  'testValue',
  '_testValue',
  'IDLRoutine',
  'ENVIRoutine',
];

for (let i = 0; i < samples.length; i++) {
  console.log(
    TransformCase(samples[i], 'camel'),
    TransformCase(samples[i], 'pascal')
  );
}
