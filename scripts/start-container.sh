#!/bin/sh
set -eu

pnpm prisma:migrate
pnpm prisma:seed
exec pnpm start:prod
