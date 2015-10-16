#!/bin/bash
# Update local machine

echo “Starting meteor build to local machine 正在更新本地服务器..”

echo “getting latest code 正在更新代码..”
git pull 

echo “building meteor bundle 正在建设代码..”
meteor build --architecture=os.linux.x86_64 ./

echo “copying bundle to remote 正在推代码包，密码是ingenta”
scp science.tar.gz root@192.168.1.10:~/science/scienceproject/

echo “ssh to remote 正在连SSH到本地服务器，密码是ingenta”
ssh root@192.168.1.10

echo “restarting docker container 正在重启服务器..”
docker restart meteor
