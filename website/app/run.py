#!/usr/bin/env python
#
# Aspiring Apps Web Site
# Ramu Ramamurthy
#
#

import tornado.options
import tornado.httpserver
import tornado.ioloop
import controllers.main

def main():
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(controllers.main.Application())
    http_server.listen(controllers.main.options.port)
    tornado.ioloop.IOLoop.current().start()

if __name__ == "__main__":
    main()
