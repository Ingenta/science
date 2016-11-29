#!/bin/bash
# Update local machine

echo “restarting docker container 正在重启服务器..”

docker restart meteor
docker restart meteor-2
docker restart meteor-3
docker restart meteor-4
docker restart meteor-5

echo “exiting， update complete 更新完成了”

exit