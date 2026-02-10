import {
  Response as Res,
  Request,
} from "https://deno.land/x/oak@v12.6.1/mod.ts"
import { existsSync } from "https://deno.land/std@0.209.0/fs/mod.ts"

export default {
  createSchema: async ({
    response,
    request,
  }: {
    response: Res
    request: Request
  }) => {
    const { value } = request.body({ type: "json" })
    const data: { schemaId: string; schema: object } = await value

    if (!data.schemaId || !data.schema) {
      response.status = 400
      response.body = {
        success: false,
        message: "Invalid schema data",
        data: null,
      }
      return
    }

    const filePath = `schemas/${data?.schemaId}.json`

    const pathFound = existsSync(filePath)

    if (pathFound) {
      console.log(
        `Schema already exists in the system with id: ${data?.schemaId}}`
      )
      response.status = 400
      response.body = {
        success: false,
        message: "Schema already exists",
        data: null,
      }
      return
    }

    console.log(`Creating schema with id: ${data?.schemaId} on system`)

    await Deno.writeTextFile(filePath, JSON.stringify(data.schema, null, 2), {})

    response.body = {
      success: true,
      message: "Schema created successfully",
      data,
    }
  },
  getSchemaById: async ({
    response,
    request,
  }: {
    response: Res
    request: Request
  }) => {
    const url = new URL(request.url)
    const filepath = decodeURIComponent(url.pathname)
    const fullPath = "." + filepath + ".json"

    try {
      const file = await Deno.open(fullPath, { read: true })

      try {
        const json = await new Response(file.readable).json()
        response.status = 200
        response.body = json
      } catch (error) {
        response.status = 500
        response.body = { message: "Invalid schema file format", error: error.message }
      }
    } catch (err) {
      if (err instanceof Deno.errors.NotFound) {
        response.status = 404
        response.body = { message: "Schema not found" }
      } else {
        response.status = 500
        response.body = { message: "Failed to read schema file", error: err.message }
      }
    }
  },
}
