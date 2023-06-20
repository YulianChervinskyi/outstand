from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import random

direction = None

class S(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

    def do_GET(self):
        self._set_headers()
        self.wfile.write("Hello World!".encode("utf-8"))

    def do_HEAD(self):
        self._set_headers()

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)

        global direction
        if direction is None or 0 < data[direction] < 5:
            variants = []
            for key in data:
                if data[key] != 2:
                    variants.append(key)

            direction = variants[random.randint(0, len(variants) - 1)]

        response = {"left": 0, "right": 0, "up": 0, "down": 0, "place": 0, direction: 1}

        self._set_headers()
        self.wfile.write(json.dumps(response).encode("utf-8"))


def run(server_class=HTTPServer, handler_class=S, port=8080):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print('Starting httpd on port %d...' % port)
    httpd.serve_forever()


if __name__ == "__main__":
    from sys import argv

    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run()
