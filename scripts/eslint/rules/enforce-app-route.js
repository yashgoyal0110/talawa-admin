const ALLOWED_PREFIXES = ['/admin', '/user', '/auth'];

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

        const isValid = ALLOWED_PREFIXES.some(
          (prefix) =>
            route === prefix || route.startsWith(prefix + '/'),
        );

        if (!isValid) {
          context.report({
            node: value,
            message: `Route must start with one of: ${ALLOWED_PREFIXES.join(
              ', ',
            )}`,
          });
        }
      },
    };
  },
};

export default enforceAppRoute;