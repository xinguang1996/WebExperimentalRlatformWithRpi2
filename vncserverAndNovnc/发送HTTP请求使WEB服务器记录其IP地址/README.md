# 对sendNodeExist.py的说明

该脚本向web服务器发送HTTP请求。web服务器接收到该请求后，解析其IP地址并记录，表明该节点可用。默认当连续接收到web服务器响应的已经存在该IP后，结束运行。
修改下列代码：
```python
def send_request():
	url = "http://192.168.1.92:8080/get_node_exist"
	print "send http request:", url
	req = urllib2.Request(url)
	res_data = urllib2.urlopen(req, timeout = 5)
	res = res_data.read()
	print res
	return res
```
其中url表示web服务器处理的url，可根据部署进行修改。```res_data = urllib2.urlopen(req, timeout = 5)```中timeout用于设置超时时间。
修改下列代码：
```python
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
```
其中```if count == 3:```表示连续3次收到web服务器响应已经存在该IP地址后停止，可根据部署实际情况进行修改。