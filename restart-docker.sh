#!/bin/bash
# Update local machine

echo “restarting docker container 正在重启服务器..”
docker restart meteor
docker restart meteorTasks

echo “exiting， update complete 更新完成了”
exit