module.exports = function ({ types: t }) {
  // plugin contents

  return {
    visitor: {
      CallExpression: {
        exit(path) {
          const funcName = path.node.callee.name;
          if (funcName === 'vec2') {
            const args = path.node.arguments;
            if (args.length === 2) {
              path.node.callee.name = 'vec2.fromValues';
            }
          }
        },
      },
      BinaryExpression: {
        exit(path) {
          const { left, right } = path.node;
          if (t.isCallExpression(left) && left.callee.name === 'vec2') {
            if (t.isCallExpression(right) && right.callee.name === 'vec2') {
              const { operator } = path.node;
              if (operator === '+') {
                // https://babeljs.io/docs/en/babel-types
                const node = t.callExpression(
                  t.identifier(`${left.callee.name}.add`),
                  [
                    t.callExpression(
                      t.identifier(`${left.callee.name}.create`),
                      [],
                    ),
                    left.arguments[0],
                    right.arguments[0]],
                );
                path.replaceWith(node);
              }
            }
          }
        },
      },
    },
  };
};
