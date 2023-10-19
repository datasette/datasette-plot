# datasette-plot

[![PyPI](https://img.shields.io/pypi/v/datasette-plot.svg)](https://pypi.org/project/datasette-plot/)
[![Changelog](https://img.shields.io/github/v/release/datasette/datasette-plot?include_prereleases&label=changelog)](https://github.com/datasette/datasette-plot/releases)
[![Tests](https://github.com/datasette/datasette-plot/workflows/Test/badge.svg)](https://github.com/datasette/datasette-plot/actions?query=workflow%3ATest)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://github.com/datasette/datasette-plot/blob/main/LICENSE)

An experimental [Observable Plot](https://observablehq.com/plot/) Datasette plugin.

## Installation

Install this plugin in the same environment as Datasette.

```bash
datasette install datasette-plot
```

## Usage

TODO

## Development

To set up this plugin locally, first checkout the code. Then create a new virtual environment:

```bash
cd datasette-plot
python3 -m venv venv
source venv/bin/activate
```

Now install the dependencies and test dependencies:

```bash
pip install -e '.[test]'
```

To run the tests:

```bash
pytest
```
