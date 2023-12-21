flags := ""

js:
  ./node_modules/.bin/esbuild \
    --bundle --minify --format=esm  --jsx-factory=h --jsx-fragment=Fragment {{flags}} \
    --out-extension:.js=.min.js \
    --out-extension:.css=.min.css \
    datasette_plot/frontend/targets/*.tsx \
    --target=safari12 \
    --outdir=datasette_plot/static

dev:
  DATASETTE_SECRET=abc123 watchexec --signal SIGKILL --restart --clear -e py,ts,js,html,css,sql -- \
    python3 -m datasette -p 8999 \
      --setting max_returned_rows 10000 \
      --root test.db

test:
  pytest

format:
  black .
