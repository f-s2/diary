@echo off
:: 设置 UTF-8 编码模式
chcp 65001 >nul

:: ========== 用户交互输入 ==========
set "DEPLOY_ANSWER="
echo.
echo 🤔 是否上传并部署到远程服务器？(y/N^)
set /p DEPLOY_ANSWER=请输入 (默认 N):

if /i "%DEPLOY_ANSWER%"=="y" (
    set "DO_DEPLOY=true"
) else (
    set "DO_DEPLOY=false"
)

:: ========== 配置区域 ==========
set "BUILD_DIR=dist"
set "OUTPUT_ZIP=dist.zip"
set "REMOTE_HOST=root@47.98.201.147"
set "SSH_KEY_PATH=C:\keys\deploy.pem"
set "REMOTE_PATH=/app/vcs-mobile"
set "SEVEN_ZIP=C:\Program Files\7-Zip\7z.exe"

:: ========== 清理旧文件 ==========
echo 🧹 正在清理旧的构建文件...
if exist "%BUILD_DIR%" rmdir /s /q "%BUILD_DIR%"
if exist "%OUTPUT_ZIP%" del /q "%OUTPUT_ZIP%"

:: ========== 执行打包命令 ==========
echo 🏗️ 正在执行 npm 构建命令...
call npm run build || (
    echo ❌ 构建失败，未找到 %BUILD_DIR%
    exit /b 1
)
if not exist "%SEVEN_ZIP%" (
    echo ❌ 找不到 7z.exe，请检查路径: "%SEVEN_ZIP%"
    exit /b 1
)

:: 使用 7-Zip 打包，并设置最大压缩率（-mx=9）
"%SEVEN_ZIP%" a -tzip "%OUTPUT_ZIP%" "%BUILD_DIR%\*" -r -mx=9

if %ERRORLEVEL% NEQ 0 (
    echo ❌ 7-Zip 压缩失败
    exit /b 1
)

:: ========== 如果 DO_DEPLOY 是 false，则退出 ==========
if /i "%DO_DEPLOY%"=="false" (
    echo ✅ 已完成：仅生成压缩包 %OUTPUT_ZIP%
    pause
    exit /b 0
)

:: ========== 检查 ssh 和 scp 是否可用 ==========
where ssh >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 未找到 ssh 命令，请确保已安装 OpenSSH 客户端
    exit /b 1
)

where scp >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 未找到 scp 命令，请确保已安装 OpenSSH 客户端
    exit /b 1
)


:: ========== 远程命令定义 ==========
:: ========== 远程命令定义 ==========
set CMD1="rm -rf %REMOTE_PATH%/dist %REMOTE_PATH%/tmp.zip; [ -f '%REMOTE_PATH%/dist.zip' ] && mv %REMOTE_PATH%/dist.zip %REMOTE_PATH%/tmp.zip"
set CMD2="unzip %REMOTE_PATH%/dist.zip -d %REMOTE_PATH%/"

:: ========== 执行远程命令1 ==========
echo 💻 正在执行远程命令1: %CMD1%
ssh -i "%SSH_KEY_PATH%" %REMOTE_HOST% %CMD1%
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 远程命令1执行失败
    exit /b 1
)

:: ========== 上传文件 ==========
echo 📡 正在上传 %OUTPUT_ZIP% 到远程服务器...
scp -i "%SSH_KEY_PATH%" "%OUTPUT_ZIP%" "%REMOTE_HOST%:%REMOTE_PATH%"
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 文件上传失败
    exit /b 1
)

:: ========== 执行远程命令2 ==========
echo 💻 正在执行远程命令2: %CMD2%
ssh -i "%SSH_KEY_PATH%" %REMOTE_HOST% %CMD2%
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 远程命令2执行失败
    exit /b 1
)


echo ✅ 部署已完成！
pause
exit /b 0
