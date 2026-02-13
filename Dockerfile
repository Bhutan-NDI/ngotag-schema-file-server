FROM denoland/deno:latest

WORKDIR /app
COPY . .

USER root

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["deno", "task", "docker-start"]
