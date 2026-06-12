import coreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...coreWebVitals,
  {
    ignores: [".next/**", "node_modules/**", "out/**", "next-env.d.ts"],
  },
  {
    rules: {
      // New rule in eslint-plugin-react-hooks v7; existing code syncs filter
      // state from the URL in an effect, so keep this advisory for now.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default eslintConfig;
