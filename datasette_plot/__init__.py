from datasette import hookimpl
import json


@hookimpl
def extra_body_script(
    template, database, table, columns, view_name, request, datasette
):
    url = datasette.urls.path("/-/static-plugins/datasette-plot/main.min.js")
    return f"import({json.dumps(url)}).then(d => d.main())"
