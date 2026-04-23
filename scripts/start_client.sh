#!/bin/bash
npm run dev -w client

# #!/bin/bash

# PORT=3000

# if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null; then
#   kill $(lsof -t -i:$PORT)
# fi

# while ! nc -z localhost $PORT; do
#   sleep 1
# done

# npm run dev -w client