FROM denoland/deno:latest

WORKDIR /app
COPY . .

USER root

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read=/app/schemas", "--allow-write=/app/schemas", "server.ts"]
