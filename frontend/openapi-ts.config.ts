import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  // 실제 Backend API의 주소 추가
  input: "http://localhost:8000/docs-json",
  output: "generated/openapi-client",
  plugins: [
    {
      name: "@hey-api/client-next",
      runtimeConfigPath: "./config/openapi-runtime.ts",
    },
  ],
});
