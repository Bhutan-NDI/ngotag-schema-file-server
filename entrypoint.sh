#!/bin/sh
set -e

echo "Initializing schema storage..."
mkdir -p /app/schemas
chown -R deno:deno /app/schemas

exec su deno -c "$*"
