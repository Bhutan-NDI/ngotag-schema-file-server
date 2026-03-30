import { Application, Middleware } from 'oak/mod.ts';
import { IgnorePattern, jwtMiddleware } from 'jwt-middleware/mod.ts';
import { oakCors } from 'cors/mod.ts';

import { APP_PORT } from './config.ts';
import { getAuthToken, secretKey } from './utils/utils.ts';
import schemaRouter from './routes/schema.ts';

const ignorePatterns: IgnorePattern[] = [
  {
    path: '/',
    methods: ['GET'],
  },
  {
    path: /^\/schemas\/[\w-]+$/,
    methods: ['GET'],
  },
];

const app = new Application();

app.use(oakCors({ origin: '*' }));

app.use(
  jwtMiddleware<Middleware>({
    key: secretKey,
    algorithm: 'HS256',
    ignorePatterns,
  }),
);

app.use(schemaRouter.routes());
app.use(schemaRouter.allowedMethods());

// 404 page
app.use(({ response }) => {
  response.status = 404;
  response.body = '404 Not Found';
});

app.listen({ port: Number(APP_PORT) });

console.log(`Listening on port: ${APP_PORT}...`);

// Get auth token
const { token } = await getAuthToken();
console.log('Auth Token:', token);
