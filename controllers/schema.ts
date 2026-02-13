import { Request, Response as Res } from 'oak/mod.ts';
import { existsSync } from 'std/fs/mod.ts';
import { basename, join, normalize } from 'std/path/mod.ts';

export default {
  createSchema: async ({
    response,
    request,
  }: {
    response: Res;
    request: Request;
  }) => {
    const { value } = request.body({ type: 'json' });
    const data: { schemaId: string; schema: object } = await value;

    if (!data.schemaId || !data.schema) {
      response.status = 400;
      response.body = {
        success: false,
        message: 'Invalid schema data',
        data: null,
      };
      return;
    }

    const filePath = `schemas/${data?.schemaId}.json`;

    const pathFound = existsSync(filePath);

    if (pathFound) {
      console.log(
        `Schema already exists in the system with id: ${data?.schemaId}}`,
      );
      response.status = 400;
      response.body = {
        success: false,
        message: 'Schema already exists',
        data: null,
      };
      return;
    }

    console.log(`Creating schema with id: ${data?.schemaId} on system`);

    await Deno.writeTextFile(
      filePath,
      JSON.stringify(data.schema, null, 2),
      {},
    );

    response.body = {
      success: true,
      message: 'Schema created successfully',
      data,
    };
  },
  getSchemaById: async ({
    response,
    request,
  }: {
    response: Res;
    request: Request;
  }) => {
    try {
      const url = new URL(request.url);
      const schemaId = basename(decodeURIComponent(url.pathname));

      const basePath = join(Deno.cwd(), 'schemas');

      if (!/^[\w-]+$/.test(schemaId)) {
        response.status = 400;
        response.body = { message: 'Invalid schema id' };
        return;
      }

      const fullPath = normalize(join(basePath, `${schemaId}.json`));

      if (!fullPath.startsWith(basePath)) {
        response.status = 400;
        response.body = { message: 'Invalid schema path' };
        return;
      }

      const fileContent = await Deno.readTextFile(fullPath);
      const json = JSON.parse(fileContent);
      response.status = 200;
      response.body = json;
      // deno-lint-ignore no-explicit-any
    } catch (err: any) {
      if (err instanceof Deno.errors.NotFound) {
        response.status = 404;
        response.body = { message: 'Schema not found' };
      } else if (err instanceof SyntaxError) {
        response.status = 500;
        response.body = {
          message: 'Invalid schema file format',
          error: err.message,
        };
      } else {
        response.status = 500;
        response.body = {
          message: 'Failed to read schema file',
          error: err.message,
        };
      }
    }
  },
};
