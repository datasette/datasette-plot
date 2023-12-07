from datasette import hookimpl


@hookimpl
def extra_js_urls(template, database, table, columns, view_name, request, datasette):
    return [datasette.urls.path("/-/static-plugins/datasette-plot/main.min.js")]
