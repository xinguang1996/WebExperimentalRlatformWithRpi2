# -*- coding: UTF-8 -*-

import urllib
import urllib2
import time

def send_request():
	url = "http://192.168.1.92:8080/get_node_exist"
	print "send http request:", url
	req = urllib2.Request(url)
	res_data = urllib2.urlopen(req, timeout = 5)
	res = res_data.read()
	print res
	return res

def main():
	count = 0
	while True:
		try:
			result = send_request()
			if result == 'ok':
				count = count + 1
			else:
				count = 0
			print count
			if count == 3:
				break
			time.sleep(10)
		except urllib2.URLError, e:
			count = 0
			print "There was a error:", e
			continue
	print "send end"
if __name__ == '__main__':
	main()
