#!/usr/bin/env python3
"""Static dev server for the JAI Home Care site.

Plain `python -m http.server` lets the browser cache index.html, CSS and JS,
so edits look like they had no effect until a hard refresh. This sends
no-store on everything and serves the right MIME type for .svg and .js.

    python serve.py [port]
"""
import os
import sys
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

HERE = os.path.dirname(os.path.abspath(__file__))


class NoCacheHandler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        '.svg': 'image/svg+xml',
        '.js': 'text/javascript',
        '.mjs': 'text/javascript',
    }

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
    handler = partial(NoCacheHandler, directory=HERE)
    print(f'JAI Home Care — serving {HERE}')
    print(f'  http://127.0.0.1:{port}   (Ctrl+C to stop)', flush=True)
    ThreadingHTTPServer(('127.0.0.1', port), handler).serve_forever()
