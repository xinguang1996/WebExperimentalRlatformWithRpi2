#!/bin/bash
#startVNC.sh
echo "Starting VNCServer......"
stopVNCServer()
{
	echo "Stopping VNCServer......"
	vncserver -kill :1
	if [ $? -eq 0 ]
	then
		echo "Stop VNCServer success"
	else
		echo "Stop VNCServer error"
		exit 5
	fi
}
startNoVNC()
{
        /home/pi/.experimental_platform/noVNC/utils/launch.sh --vnc localhost:5901 &
        if [ $? -eq 0 ]
        then
                echo "Start noVNC success"
		exit 0
        else
                echo "Start noVNC error"
		stopVNCServer
                exit 4
        fi
}
case "$#" in
	0)
		vncserver :1
		if [ $? -eq 0 ]
		then
			echo "Start VNCServer success"
			echo "Starting noVNC......"
			startNoVNC
		else
			echo "VNCServer start error"
			exit 1
		fi
		;;
	1 | 2)
		vncserver -geometry $1 :1
		if [ $? -eq 0 ]
		then
			echo "Start VNCServer success"
			echo "Starting noVNC..."
			startNoVNC
		else
			echo "VNCServer start error"
			exit 2
		fi
		;;
	*)
		echo "You have entered $# parameters, and we need 1 parameters"
		exit 3
		;;
esac
exit 0
