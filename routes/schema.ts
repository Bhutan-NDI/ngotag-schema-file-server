import { Router } from 'oak/mod.ts';
import schemaController from '../controllers/schema.ts';

const router = new Router();

router
  .get('/', (ctx) => {
    ctx.response.body = 'Schema List';
  })
  .get('/schemas/:id', schemaController.getSchemaById)
  .post('/schemas', schemaController.createSchema);

export default router;
