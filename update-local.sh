#!/bin/bash
# Update local machine

echo “Starting meteor build to local machine 正在更新本地服务器..”
git pull 
meteor build --architecture=os.linux.x86_64 ./
scp ~/apps/science/science.tar.gz root@192.168.1.10:~/app/
ssh root@192.168.1.10
docker restart meteor
