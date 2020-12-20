#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Python - BrowserMob - WebDriver"""
from browsermobproxy import Server
from selenium import webdriver
import json
import time

bernielinks = ['http://berniesanders.com/','http://twitter.com/', 'http://thehill.com/', 'http://edition.cnn.com/',
               'http://www.nytimes.com', 'http://www.donaldjtrump.com/', 'http://www.antixforum.com',
               'http://www.4chan.org', 'http://www.crunchyroll.com']

class CreateHar(object):
    """create HTTP archive file"""

    def __init__(self, mob_path):
        """initial setup"""
        self.browser_mob = mob_path
        self.server = self.driver = self.proxy = None

    @staticmethod
    def __store_into_file(title, result):
        """store result"""
        har_file = open(title + '.har', 'w')
        har_file.write(str(result))
        har_file.close()

    def __start_server(self):
        """prepare and start server"""
        self.server = Server(self.browser_mob)
        self.server.start()
        self.proxy = self.server.create_proxy()

    def __start_driver(self):
        """prepare and start driver"""
        # Configure the browser proxy in chrome options
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument('ignore-certificate-errors')
        chrome_options.add_argument("--proxy-server={0}".format(self.proxy.proxy))
        self.driver = webdriver.Chrome(chrome_options=chrome_options)

    def start_all(self):
        """start server and driver"""
        self.__start_server()
        self.__start_driver()

    def create_har(self, title, linklist, num_req):
        """start request and parse response"""
        self.proxy.new_har(title)
        for i in range(num_req):
            for url in linklist:
                self.driver.get(url)
                time.sleep(1)

        result = json.dumps(self.proxy.har, ensure_ascii=False)
        self.__store_into_file(title, result)

    def stop_all(self):
        """stop server and driver"""
        self.server.stop()
        self.driver.quit()


if __name__ == '__main__':
    path = r"C:\Utility\browsermob-proxy-2.1.4\bin\browsermob-proxy"
    RUN = CreateHar(path)
    RUN.start_all()
    RUN.create_har('bernie', bernielinks, 10)
    # RUN.create_har('bernie', bernielinks, 10000)
    # RUN.create_har('appleseed', appleseedlinks, 10000)
    RUN.stop_all()