import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: process.env.OPENAPI_INPUT ?? './openapi.yaml',
  output: 'src/shared/api/generated',
  plugins: ['@hey-api/client-fetch'],
});
