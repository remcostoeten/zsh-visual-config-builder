#!/bin/bash
cd server
if command -v pnpm >/dev/null 2>&1; then
  pnpm install
  pnpm run dev
else
  npm install
  npm run dev
fi