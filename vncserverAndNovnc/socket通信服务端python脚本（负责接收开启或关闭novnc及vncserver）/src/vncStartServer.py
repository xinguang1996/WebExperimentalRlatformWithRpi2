# This script is used to obtain a request for a VNC connection
import socket
import commands
import os

def startVNC(screenSize):
	print 'into startVNC...'
	
	resultCode = os.system('/home/pi/.experimental_platform/starVNC.sh %s' % screenSize)
	#resultCode, resultText = commands.getstatusoutput('/home/pi/.experimental_platform/starVNC.sh %s &' % screenSize)
		
	#print resultCode
	#print resultText
	#print result[1]
	if resultCode == 0:
		return 'ok'
	else:
		return 'error:Start VNC error'


def stopVNC():
	resultCode, resultText = commands.getstatusoutput('/home/pi/.experimental_platform/stopVNC.sh')

	print resultCode
	print resultText
	if resultCode == 0:
		return 'ok'
	else:
		return 'error:%s' % resultText
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
