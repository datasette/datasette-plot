flags := ""

js:
  ./node_modules/.bin/esbuild \
    --bundle --format=esm  --jsx-factory=h --jsx-fragment=Fragment {{flags}} \
    --out-extension:.js=.min.js \
    datasette_plot/frontend/targets/* \
    --outdir=datasette_plot/static

dev:
  DATASETTE_SECRET=abc123 watchexec --signal SIGKILL --restart --clear -e py,ts,js,html,css,sql -- \
    python3 -m datasette -p 8999 \
      --root test.db

test:
  pytest

format:
  black .
