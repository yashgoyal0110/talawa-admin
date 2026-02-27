import { RuleTester } from 'eslint';
import enforceAppRoute from './enforce-app-route.js';

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

const FILENAME = '/project/src/App.tsx';
const OTHER_FILE = '/project/src/components/Other.tsx';

ruleTester.run('enforce-app-route', enforceAppRoute, {

  valid: [
    // Prefix: /admin
    {
      filename: FILENAME,
      code: `<Route path="/admin" />`,
    },
    {
      filename: FILENAME,
      code: `<Route path="/admin/dashboard" />`,
    },
    {
      filename: FILENAME,
      code: `<Route path="/admin/users/:id/settings" />`,
    },

    // Prefix: /user
    {
      filename: FILENAME,
      code: `<Route path="/user/profile" />`,
    },
    {
      filename: FILENAME,
      code: `<Route path="/user/settings" />`,
    },

    // Prefix: /auth
    {
      filename: FILENAME,
      code: `<Route path="/auth/login" />`,
    },
    {
      filename: FILENAME,
      code: `<Route path="/auth/callback" />`,
    },

    // Exact matches (previously failing routes)
    {
      filename: FILENAME,
      code: `<Route path="/" element={<LoginPage />} />`,          // line 205
    },
    {
      filename: FILENAME,
      code: `<Route path="/register" element={<LoginPage />} />`,  // line 206
    },
    {
      filename: FILENAME,
      code: `<Route path="/forgotPassword" element={<ForgotPassword />} />`, // line 319
    },
    {
      filename: FILENAME,
      code: `<Route path="/verify-email" element={<VerifyEmail />} />`,      // line 320
    },

    // Pattern match: /event/invitation/*
    {
      filename: FILENAME,
      code: `<Route path="/event/invitation/:token" element={<AcceptInvitation />} />`, // line 324
    },
    {
      filename: FILENAME,
      code: `<Route path="/event/invitation" element={<AcceptInvitation />} />`,
    },
    {
      filename: FILENAME,
      code: `<Route path="/event/invitation/" element={<AcceptInvitation />} />`,
    },

    // Wildcard catch-all
    {
      filename: FILENAME,
      code: `<Route path="*" element={<PageNotFound />} />`,
    },

    // Non-App.tsx files are always ignored — no matter the path
    {
      filename: OTHER_FILE,
      code: `<Route path="/totally-random" />`,
    },
    {
      filename: OTHER_FILE,
      code: `<Route path="/event/whatever" />`,
    },

    // Route with no path attribute is ignored
    {
      filename: FILENAME,
      code: `<Route element={<Layout />} />`,
    },
  ],

  invalid: [
    // Bare unknown top-level segments
    {
      filename: FILENAME,
      code: `<Route path="/dashboard" />`,
      errors: [{ message: /Route "\/dashboard" is not allowed/ }],
    },
    {
      filename: FILENAME,
      code: `<Route path="/settings" />`,
      errors: [{ message: /Route "\/settings" is not allowed/ }],
    },
    {
      filename: FILENAME,
      code: `<Route path="/profile" />`,
      errors: [{ message: /Route "\/profile" is not allowed/ }],
    },

    {
      filename: FILENAME,
      code: `<Route path="/administrator" />`,
      errors: [{ message: /Route "\/administrator" is not allowed/ }],
    },
    {
      filename: FILENAME,
      code: `<Route path="/users/profile" />`,
      errors: [{ message: /Route "\/users\/profile" is not allowed/ }],
    },
    {
      filename: FILENAME,
      code: `<Route path="/authentication/sso" />`,
      errors: [{ message: /Route "\/authentication\/sso" is not allowed/ }],
    },

    // Exact-match routes that are almost-but-not-quite right
    {
      filename: FILENAME,
      code: `<Route path="/register/confirm" />`, 
      errors: [{ message: /Route "\/register\/confirm" is not allowed/ }],
    },
    {
      filename: FILENAME,
      code: `<Route path="/verify-email/resend" />`,
      errors: [{ message: /Route "\/verify-email\/resend" is not allowed/ }],
    },

    // Pattern: /event/invitation must NOT match other /event/* routes
    {
      filename: FILENAME,
      code: `<Route path="/event/details" />`,
      errors: [{ message: /Route "\/event\/details" is not allowed/ }],
    },
    {
      filename: FILENAME,
      code: `<Route path="/event" />`,
      errors: [{ message: /Route "\/event" is not allowed/ }],
    },

    // Completely arbitrary routes
    {
      filename: FILENAME,
      code: `<Route path="/forgot-password" />`,
      errors: [{ message: /Route "\/forgot-password" is not allowed/ }],
    },
    {
      filename: FILENAME,
      code: `<Route path="/api/data" />`,
      errors: [{ message: /Route "\/api\/data" is not allowed/ }],
    },
  ],
});