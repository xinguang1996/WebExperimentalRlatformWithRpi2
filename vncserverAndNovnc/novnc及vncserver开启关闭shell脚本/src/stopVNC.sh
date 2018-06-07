#!/bin/bash
#stopVNC.sh
echo "Stopping vncserver..."
vncserver -kill :1
if [ $? -eq 0 ]
then
	echo "Stop vncserver success..."
	processID=`netstat -tunlp | grep 6080 | awk '{print $7}' | cut -d '/' -f 1`
	echo "noVNC is running in $processID"
	echo "Stopping noVNC..."
	kill -9 $processID
	if [ $? -eq 0 ]
	then
		echo "Stop noVNC in $processID success...But there may be a follow-up connection..."
		while [ 1 -eq 1 ]
		do
			sleep 1
			processID=`netstat -tunlp | grep 6080 | awk '{print $7}' | cut -d '/' -f 1`
			if [ "$processID" ]
			then
				echo "noVNC is running in $processID"
                                echo "Stopping noVNC..."
                                kill -9 $processID
                                if [ $? -eq 0 ]
                                then
                                         echo "Stop noVNC in $processID success...But there may be a follow-up connection..."
                                else
                                        echo "Stop noVNC fail..."
                                        echo "In order to restore the style before the exit. It is restarting vncserver..."
                                        vncserver :1
                                        if [ $? -eq 0 ]
                                        then
                                                echo "Restart vncserver success..."
                                                echo "ERROR:Stop noVNC fail...The state has been restored to the prior exit."
						exit 1
                                        else
                                                echo "Restart vncserver fail..."
                                                echo "ERROR:Stop noVNC fail...But vncserver has been closed and restarted the failure."
                                                exit 2
                                        fi
                                fi
			else
				echo "Stop noVNC success..."
                                exit 0
			fi
		done
		#echo "Stop noVNC success..."
		#exit 0
	else
		echo "Stop noVNC fail..."
		echo "In order to restore the style before the exit. It is restarting vncserver..."
		vncserver :1
		if [ $? -eq 0 ]
		then
			echo "Restart vncserver success..."
			echo "ERROR:Stop noVNC fail...The state has been restored to the prior exit."
			exit 1
		else
			echo "Restart vncserver fail..."
			echo "ERROR:Stop noVNC fail...But vncserver has been closed and restarted the failure."
			exit 2
		fi
	fi
else
	echo "Stop vncserver fail..."
	echo "ERROR:Stop vncserver fail...The environment has not been changed."
	exit 3
fi
