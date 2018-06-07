# Socket通信服务端Python脚本的一些说明

该脚本通过接受web服务器发过来的socket通信，来决定是否开启或关闭vncserver服务和noVNC服务。其中startVNC函数负责执行startVNC.sh脚本，用于开启vncserver和noVNC服务。stopVNC函数负责执行stopVNC.sh脚本，用于关闭vncserver和noVNC服务（关于startVNC.sh和stopVNC.sh脚本说明见本项目vncserverAndNovnc/noVNC及vncserver开启关闭shell脚本/README.md）。

## 脚本说明

主流程代码，如下所示：

```python
s = socket.socket()

host = ''
port = 10001
s.bind((host, port))

s.listen(10)
while True:
	client, addr = s.accept()
	print 'Got connection from', addr
	data = client.recv(1024)
	
	if data.find(":") == -1:
		client.send('error:parameter is incorrect!')
	else:
		print '...'
		parameter = data.split(':')
		operation = parameter[0]
		print operation
		if operation == 'start':
			screenSize = parameter[1]
			print screenSize
			result = startVNC(screenSize)
			print result
			client.send(result)
		elif operation == 'stop':
			result = stopVNC()
			print result
			client.send(result)

	#client.send('Connection success!')
	client.close()
```

其中```port = 10001```表示服务监听的端口号，可以根据自己的实际情况进行修改，```s.listen(10)```表示最大连接数量，也可以手动更改，```while True:```里面的代码主要是接收socket客户端（即web服务器）发送的消息，根据消息的不同来执行不同的操作并给出相应，可自行更改。

在startVNC函数中，参数```screenSize```表示要开启vnc服务的屏幕分辨率大小，该参数主要是web服务前端根据用户屏幕分辨率的大小获得一个合理的大小，之后传递给socket服务器用于开启vnc服务，形式如```800x800```。<b>注意：x前后必须为整数。</b>在函数内部，```resultCode = os.system('/home/pi/.experimental_platform/starVNC.sh %s' % screenSize)```代码中的```/home/pi/.experimental_platform/starVNC.sh```表示startVNC.sh脚本的路径，可根据自己的部署情况进行修改。

在stopVNC函数中，```resultCode, resultText = commands.getstatusoutput('/home/pi/.experimental_platform/stopVNC.sh')```代码中的```/home/pi/.experimental_platform/stopVNC.sh```表示stopVNC.sh脚本所在的路径，可以根据自己的部署情况进行修改。