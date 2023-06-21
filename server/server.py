from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import random

direction = None
change_direction = False


class S(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

    def do_GET(self):
        self._set_headers()
        self.wfile.write("Status: OK".encode("utf-8"))

    def do_HEAD(self):
        self._set_headers()

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)

        variants = []
        for key in ["left", "right", "up", "down"]:
            if data[key] == 0 or data[key] == 5:
                variants.append(key)

        global direction
        global change_direction

        place = 0
        if data["center"] != 3 and data["bombs"] == 0:
            for key in ["left", "right", "up", "down"]:
                if data[key] == 1:
                    place = 1
                    break

        if change_direction:
            change_direction = False
            if direction == "up":
                direction = "down"
            elif direction == "down":
                direction = "up"
            elif direction == "left":
                direction = "right"
            elif direction == "right":
                direction = "left"

        elif not place:
            if direction is None or 0 < data[direction] < 5:
                direction = variants[random.randint(0, len(variants) - 1)]
            else:
                # variants.remove(direction)
                if direction == "up" and "down" in variants:
                    variants.remove("down")
                elif direction == "down" and "up" in variants:
                    variants.remove("up")
                elif direction == "left" and "right" in variants:
                    variants.remove("right")
                elif direction == "right" and "left" in variants:
                    variants.remove("left")

                for i in range(20):
                    variants.append(direction)

                direction = variants[random.randint(0, len(variants) - 1)]

        if place == 1:
            change_direction = True

        response = {"left": 0, "right": 0, "up": 0, "down": 0, "place": place, direction: 1}

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
