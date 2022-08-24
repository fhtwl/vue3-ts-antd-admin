#sh ./deploy.sh 

# 拉取最新代码
echo "执行命令：git pull origin master"
git pull origin master

su root

# 更新依赖
echo "sudo npm i"
npm i

# 编译为静态文件
echo "npm run build"
npm run build