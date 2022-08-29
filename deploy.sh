#sh ./deploy.sh 

# 拉取最新代码
echo "执行命令: 拉取远程代码"
git pull origin r1.0.0

# 更新依赖
echo "更新依赖"
yarn

# 编译为静态文件
echo "编译为静态文件"
npm run build

# 将编译代码移动到网站目录
echo '将编译代码移动到网站目录'
cp -r ./dist/* ../dist/

echo 'success'