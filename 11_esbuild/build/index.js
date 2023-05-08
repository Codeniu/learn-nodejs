const esbuild = require('esbuild');

const options = {
  entryPoints: ['src/index.js'],
  outfile: 'dist/logger.js',
  bundle: true,
};

// esbuild.buildSync(options);

// esbuild.context( {
//   ...options,
//   outfile: 'example/dist/logger.js',
// }).then((ctx) => {
//   ctx.serve({
//     servedir:'./example',
//     host:'localhost',
//     port:8080
//   }).then(server => {
//     console.log(`Server is running at ${server.host}:${server.port}`);
//   })
// });
// esbuild.buildSync(options);

console.log('process.env.mode: ', process.env.mode);
if(process.env.mode === 'production') {
  esbuild.buildSync(options);
} else {
  esbuild.context( {
    ...options,
    outfile: 'example/dist/logger.js',
  }).then((ctx) => {
    ctx.serve({
      servedir:'./example',
      host:'localhost',
      port:8080
    }).then(server => {
      console.log(`Server is running at ${server.host}:${server.port}`);
    })
  });
}