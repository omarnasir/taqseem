#! /bin/bash

set -e

PUID=${PUID:-0}
PGID=${PGID:-0}

echo "
User uid: $PUID
User gid: $PGID
"

# Start gunicorn without forking
cmd="uvicorn app.main:app \
     --host 0.0.0.0 \
     --port ${PORT:-8000}"

# Check if stage is dev
if [ "$STAGE" = "dev" ]; then
     echo "Running Development Server"
     cmd+=" --reload --log-level debug"
elif [ "$STAGE" = "test" ]; then
     echo "Running Test Server"
     cmd+=" --workers 1 --log-level info"
else
     echo "Running Production Server"
     cmd+=" --workers 1 --log-level info"
fi

if [ "$PGID" -ne 0 -a "$PUID" -ne 0 ]; then
     groupmod -o -g "$PGID" abc
     usermod -o -u "$PUID" abc
     cmd="su - abc -c '$cmd'"
fi

eval "$cmd"
