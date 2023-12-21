# datasette-plot

[![PyPI](https://img.shields.io/pypi/v/datasette-plot.svg)](https://pypi.org/project/datasette-plot/)
[![Changelog](https://img.shields.io/github/v/release/datasette/datasette-plot?include_prereleases&label=changelog)](https://github.com/datasette/datasette-plot/releases)
[![Tests](https://github.com/datasette/datasette-plot/workflows/Test/badge.svg)](https://github.com/datasette/datasette-plot/actions?query=workflow%3ATest)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://github.com/datasette/datasette-plot/blob/main/LICENSE)

A Datasette plugin for making data visualizations with [Observable Plot](https://observablehq.com/plot/) .

<img width="600px" src="https://datasette-cloud-assets.s3.amazonaws.com/blog/2023/datasette-plot/hero.jpeg"/>

## Installation

Install this plugin in the same environment as Datasette.

```bash
datasette install datasette-plot
```

## Usage

Once installed, table pages and SQL query pages will have a new "Show plot" button that will open the `datasette-plot`.

<img width="600px" src="https://datasette-cloud-assets.s3.amazonaws.com/blog/2023/datasette-plot/table-2.jpeg"/>

Currently, `datasette-plot` only supports a few [visualization marks](https://observablehq.com/plot/features/marks) from Plot, including dot, line, area, bar, and more.

<video width=600 controls autoplay src="https://datasette-cloud-assets.s3.amazonaws.com/blog/2023/datasette-plot/dsc-plot-02.mp4" type="video/mp4" style="display: block; margin: 0 auto" >
</video>

Use the `Link to this plot` URL to share visualization with others. The link will have your plot options encoded in the URL.

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
