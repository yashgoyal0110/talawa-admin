const ALLOWED_PREFIXES = ['/admin', '/user', '/auth'];
const ALLOWED_EXACT = ['/', '/register', '/forgotPassword', '/verify-email'];
const ALLOWED_PATTERNS = ['^/event/invitation(?:/|$)'];

const allowedPatternRegexes = ALLOWED_PATTERNS.map(
  (pattern) => new RegExp(pattern),
);

const enforceAppRoute = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ensure all <Route path> values in src/App.tsx start with allowed prefixes',
    },
    schema: [],
  },

  create(context) {
    const filename = (context.filename ?? context.getFilename()).replace(
      /\\/g,
      '/',
    );

    if (!filename.endsWith('src/App.tsx')) {
      return {};
    }

    return {
      JSXOpeningElement(node) {
        if (node.name.name !== 'Route') return;

        const pathProp = node.attributes.find(
          (attr) =>
            attr.type === 'JSXAttribute' && attr.name.name === 'path',
        );

        if (!pathProp) return;

        const value = pathProp.value;
        if (!value || value.type !== 'Literal') return;

        const route = value.value;

        if (route === '*') return;

        if (ALLOWED_EXACT.includes(route)) return;

        const matchesPrefix = ALLOWED_PREFIXES.some(
          (prefix) => route === prefix || route.startsWith(prefix + '/'),
        );
        if (matchesPrefix) return;
        
        const matchesPattern = allowedPatternRegexes.some((regex) =>
          regex.test(route),
        );
        if (matchesPattern) return;

        context.report({
          node: value,
          message: `Route "${route}" is not allowed. Routes must: start with one of [${ALLOWED_PREFIXES.join(
            ', ',
          )}], exactly match one of [${ALLOWED_EXACT.join(
            ', ',
          )}], match an allowed pattern, or be the wildcard "*".`,
        });
      },
    };
  },
};

export const enforceAppRouteConfig = {
  plugins: {
    'enforce-app-route': {
      rules: {
        enforce: enforceAppRoute,
      },
    },
  },
  rules: {
    'enforce-app-route/enforce': 'error',
  },
};

export default enforceAppRoute;