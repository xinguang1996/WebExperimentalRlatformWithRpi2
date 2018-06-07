# StartVNC.sh和StopVNC.sh的相关说明

## StartVNC.sh

StartVNC.sh是为了方便启动vncserver和noVNC服务自己写的一个脚本。该脚本中含有stopVNCServer和startNoVNC两个函数，stopVNCServer用于关闭vncserver服务，StartNoVNC用于开启noVNC服务。开启vncserver的脚本分别为```vncserver :1```和```vncserver -geometry $1 :1```。后者表示传入了一个vncserver启动时屏幕的分辨率大小。该脚本没有对参数进行验证（不严谨），考虑到该脚本是由自己写在程序中调用，用户不直接调用该脚本，因此出错的概率较小，但为了保险起见，还可以对此脚本进行改进。关闭vncserver服务的脚本为stopVNCServer函数中的```vncserver -kill :1```，启动noVNC服务的脚本为startNoVNC函数的```/home/pi/.experimental_platform/noVNC/utils/launch.sh --vnc localhost:5901 &```，其中```/home/pi/.experimental_platform/noVNC```是下载noVNC后的路径，可根据自己的实际情况进行修改。

## StopVNC.sh

该脚本用于关闭vncserver和noVNC服务脚本，没有分函数，写的较为凌乱，刚开始执行```vncserver -kill :1```来关闭vncserver服务，关闭成功后就开始准备关闭noVNC服务，关闭noVNC服务是通过杀死进程的方式进行关闭，由于noVNC服务为用户提供了连接，所以其进程可以再生，故使用循环不断杀死进程，直到没有相关进程。脚本```processID=`netstat -tunlp | grep 6080 | awk '{print $7}' | cut -d '/' -f 1` ```用于查询6080端口存在的进程ID，6080是noVNC服务运行的端口。如果noVNC服务关闭失败，则重新开启vncserver服务，保证其一致性。如果noVNC服务关闭成功（即在6080端口没有残余进程），则脚本执行结束。