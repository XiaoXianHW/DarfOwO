本文将简要介绍如何在 **CentOS7** 中安装 **OpenSSL1.1.1** 和 **Python3.9** ，并且设置Python安装的OpenSSL版本

**写本文的原因**
（因为很多文章杂乱且不详细，导致一些小白在安装后Python安装的OpenSSL版本没有变化，这里以 **Python3.9.7** 和 **OpenSSL1.1.1** 做演示，以下教程为实机一步步操作，部分内容由GPT-4编写）


----------


## 一、安装OpenSSL

首先，用户需要在 **CentOS7** 系统上安装 **OpenSSL1.1.1** ，可以从公共源码库中下载该版本，并通过在终端键入以下命令来编译它：

```shell
# 下载OpenSSL1.1.1
wget https://www.openssl.org/source/openssl-1.1.1.tar.gz

# 解压压缩包
tar -zxvf openssl-1.1.1.tar.gz

# 进入OpenSSL1.1.1目录
cd openssl-1.1.1

# 编译安装
./config shared zlib
make && make install

# 替换原OpenSSL（如果有旧版本OpenSSL需求请先备份！）
rm -rf /usr/lib64/libssl.so
rm -rf /usr/lib64/libcrypto.so
ln -s /usr/local/lib64/libssl.so.1.1 /usr/lib64/libssl.so
ln -s /usr/local/lib64/libcrypto.so.1.1 /usr/lib64/libcrypto.so
ln -s /usr/local/lib64/libssl.so.1.1 /usr/lib64/libssl.so.1.1
ln -s /usr/local/lib64/libcrypto.so.1.1 /usr/lib64/libcrypto.so.1.1
```

安装路径为 `/usr/local/bin/openssl`


----------


使用 `openssl version`
如果输出为 `OpenSSL 1.1.1  11 Sep 2018` 则代表安装成功
![2023-04-29T14:53:36.png][https://by.xiaoxian.org/usr/uploads/2023/04/222904209.png]


----------


## 二、安装Python

接下来，下载 **Python3.9.7** 并编辑相关配置指定OpenSSL进行编译安装，在控制台使用以下命令

```shell
# 下载Python 3.9.7
cd ..
wget https://www.python.org/ftp/python/3.9.7/Python-3.9.7.tgz

# 解压压缩包
tar -zxvf Python-3.9.7.tgz

# 进入Python-3.9.7目录
cd Python-3.9.7

# 编辑Setup文件
vim Modules/Setup
```

----------


找到第 214 行的 `#SSL=/usr/local/ssl`
![2023-04-29T14:58:28.png][https://by.xiaoxian.org/usr/uploads/2023/04/2646572676.png]

按 `i` 进入编辑模式，去掉后三行前面的 `#` 注释

    #SSL=/usr/local/ssl
    _ssl _ssl.c \
            -DUSE_SSL -I$(SSL)/include -I$(SSL)/include/openssl \
            -L$(SSL)/lib -lssl -lcrypto

编辑后按 `Esc` 键，随后输入 `:wq` 保存并退出


----------


随后执行以下命令
```shell
# 在/usr/local新建一个文件夹做安装目录（可自定义安装目录）
cd /usr/local
mkdir python3
cd [你刚刚下载的Python目录]# （如果是直接连接并安装的，应该是/root或/home下）

# 配置安装文件，指定安装目录和OpenSSL版本
./configure --prefix=/usr/local/python3 --with-openssl=/usr/local/bin/openssl --enable-optimizations

# 编译安装
make && make install
```


----------


出现![2023-04-29T15:24:33.png][https://by.xiaoxian.org/usr/uploads/2023/04/1246097756.png]
则代表安装成功


----------

创建软链接
```shell
ln -s /usr/local/python3/bin/python3.9 /usr/bin/
ln -s /usr/local/python3/bin/pip3.9 /usr/bin/

# 查看Python版本
python3.9 --version
```
如果输出 `Python 3.9.7` 则代表安装成功
![2023-04-29T16:04:30.png][https://by.xiaoxian.org/usr/uploads/2023/04/3110150040.png]
## 三、测试OpenSSL版本

测试Python内置的SSL版本

 ```shell
# 进入Python编辑
python3.9

# 键入以下内容
import ssl
print(ssl.OPENSSL_VERSION)
```
如果输出为 `OpenSSL 1.1.1  11 Sep 2018` 则代表安装成功
![2023-04-29T16:08:29.png][https://by.xiaoxian.org/usr/uploads/2023/04/4164012888.png]


----------


配置并引入安装成功，此前的我各种百度谷歌踩坑...废了3天时间才搞好
