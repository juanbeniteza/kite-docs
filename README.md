# Kite documentation

Public guides, API reference and examples for Kite.

Read the wiki at https://juanbeniteza.github.io/kite-docs/

GitHub Pages publishes `main` from the repository root using its built-in Jekyll engine. No app source or signing configuration is included.

The guides are maintained with the app. To update, run `python3 Tools/export_docs_site.py /path/to/kite-docs` from the Kite workspace after regenerating docs with `npm --prefix js run docs`, review the diff in this repository, then commit and push. Avoid editing generated pages without also updating their source.
