import { RuleTester } from 'eslint';
import rule from './enforce-app-route.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run('enforce-app-route', rule, {
  valid: [
    // Valid admin route
    {
      filename: 'src/App.tsx',
      code: `
        function App() {
          return <Route path="/admin" />;
        }
      `,
    },

    // Valid nested admin route
    {
      filename: 'src/App.tsx',
      code: `
        function App() {
          return <Route path="/admin/dashboard" />;
        }
      `,
    },

    // Valid user route
    {
      filename: 'src/App.tsx',
      code: `
        function App() {
          return <Route path="/user/profile" />;
        }
      `,
    },

    // Valid auth route
    {
      filename: 'src/App.tsx',
      code: `
        function App() {
          return <Route path="/auth/login" />;
        }
      `,
    },

    // Non-literal path (dynamic) → skipped
    {
      filename: 'src/App.tsx',
      code: `
        const pathValue = "/admin";
        function App() {
          return <Route path={pathValue} />;
        }
      `,
    },

    // Rule should not apply outside src/App.tsx
    {
      filename: 'src/screens/AdminPortal/Dashboard.tsx',
      code: `
        function Component() {
          return <Route path="/random" />;
        }
      `,
    },
  ],

  invalid: [
    // Invalid root route
    {
      filename: 'src/App.tsx',
      code: `
        function App() {
          return <Route path="/dashboard" />;
        }
      `,
      errors: [
        {
          message:
            'Route must start with one of: /admin, /user, /auth',
        },
      ],
    },

    // Completely random route
    {
      filename: 'src/App.tsx',
      code: `
        function App() {
          return <Route path="/something-else" />;
        }
      `,
      errors: [
        {
          message:
            'Route must start with one of: /admin, /user, /auth',
        },
      ],
    },
  ],
});