#!/usr/bin/env python
#
# Aspiring Apps Web Site
# Ramu Ramamurthy
#
#

#import commands
import logging
import os.path
import re
import tornado.auth
#import tornado.database
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
from tornado.options import define, options
import tornado.escape

import models.user

define("port", default=8888, help="run on the given port", type=int)

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            #(r"/(.*)", WebHomeHandler),
            (r"/web/home/(.*)", WebHomeHandler)
        ]
        settings = dict(
            app_title=u"Aspiring Apps",
            template_path=os.path.join(os.path.dirname(__file__), "../templates/mb-aspiring"),
            static_path=os.path.join(os.path.dirname(__file__), "../public"),
            static_url_prefix="/web/static/",
            xsrf_cookies=False,
            cookie_secret=os.environ.get("COOKIE_SECRET"),
            login_url="/"            
        )
        tornado.web.Application.__init__(self, handlers, **settings)
        
class BaseHandler(tornado.web.RequestHandler):
    @property
    def db(self):
        return self.application.db

    def get_current_user(self):
        user_json = self.get_secure_cookie("user")
        if not user_json: return None
        return tornado.escape.json_decode(user_json)

class WebHomeHandler(BaseHandler):
    def get(self, slug):
        logging.info("slug is: %r" % slug)
        # does slug file exist
        self.render(slug)        

        

