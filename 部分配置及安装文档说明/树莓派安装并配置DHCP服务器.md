# 树莓派安装并配置DHCP服务器

## DHCP简介

DHCP自动分配IP地址服务，全名是Dynamic Host Configuration Protocol，动态主机配置协议。他是一个企业局域网中有多台客户端或电脑为其分配IP地址的一个 UDP类型的协议。他能作为网络的中心管理的一种方式，在组织域控的时候会要用到。还有就是在局域网中为了方式IP分配上的冲突，通过DHCP自动协商进行IP的分配 。当然DHCP也是基于TCP/UDP协议的端口的，我们常见的DHCP就是基于UDP协议的67和68服务端口，所以作为防火墙一定要允许这两个端口访问。客户端方面采用的是 546端口来获取DHCPv6 Client提供的IP分配地址。

## 树莓派安装DHCP服务

为了顺利安装最新版本的DHCP服务到树莓派，我们要注意修改apt-get安装源到最新的版本。这里我们在用安装的命令是：
```shell
sudo apt-get update
sudo apt-get install isc-dhcp-server
```

## 配置DHCP服务器

在```/etc/defalut/isc-dhcp-server```中让添加dhcp server监听端口：```INTERFACES="eth0"```（根据自己的情况修改，本系统使用eth0）

编辑```/etc/dhcp/dhcpd.conf```，直接在文件最后添加我们需要的配置，其他参数暂时不需考虑，在文件后追加如下内容：

```
subnet 192.168.1.0 netmask 255.255.255.0 {
	range 192.168.1.2 192.168.1.254;
    option routers 192.168.1.1;
    option subnet-mask 255.255.255.0;
    option broadcast-address 192.168.1.255;
}
```

下面对上述配置进行说明：

```
range 192.168.1.2 192.168.1.254        #动态分配IP地址的范围
option routers 192.168.1.1             #设置客户端默认网关
option subnet-mask 255.255.255.0       #设置客户端子网掩码
```

配置完毕后，可以使用```sudo service isc-dhcp-server start```来启动DHCP服务器，使用```sudo service isc-dhcp-server restart```来重启DHCP服务器，使用```sudo servic isc-dhcp-server stop```来停止DHCP服务器。

## 将DHCP设为树莓派开机自启动

一般DHCP服务器随树莓派的启动自行启动，所以我们需要配置DHCP服务器为自启动。编辑```/etc/rc.local```文件，在```eixt 0```之前，加入```service isc-dhcp-server start```脚本，保存之后，重启树莓派，DHCP就会随树莓派开机自启。