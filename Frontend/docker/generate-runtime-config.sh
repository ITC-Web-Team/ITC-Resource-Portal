#!/bin/sh
set -e

# Renders config.template.js -> config.js using whatever the container's
# actual runtime environment has for these two vars (set in Coolify as
# plain, non-"build" environment variables on the frontend service).
# Runs automatically because nginx's own docker-entrypoint.sh executes
# every *.sh file under /docker-entrypoint.d/ before starting nginx.
envsubst '${VITE_API_BASE_URL} ${VITE_API_ORIGIN}' \
    < /usr/share/nginx/html/config.template.js \
    > /usr/share/nginx/html/config.js
