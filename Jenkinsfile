pipeline {
    // Run on an agent where we want to use Go
    agent any

    // Ensure the desired Go version is installed for all stages,
    // using the name defined in the Global Tool Configuration
    tools { nodejs 'node22' }

    stages {
        stage('Load Config') {
            steps {
                configFileProvider(
                    [configFile(fileId: 'collect-admin-web-env', targetLocation: '.env.production')]
                ) {
                    sh '''
                        echo "配置文件已生成："
                        cat .env.production
                    '''
                }
            }
        }
        stage('Build') {
            steps {
                sh 'echo "开始构建..."'
                sh 'rm -rf dist'
                sh 'ls -la'
                sh 'npm install --legacy-peer-deps'
                sh 'npm run build'
                sh 'ls -la dist'
            }
        }
        stage('Deploy via SSH') {
            steps {
                sshPublisher(
                    publishers: [
                        sshPublisherDesc(
                            configName: 'Developer', // 在系统设置中配置的名称
                            transfers: [
                                sshTransfer(
                                    sourceFiles: 'dist/**',
                                    // 远程目录（相对于系统配置中的“Remote Directory”）
                                    remoteDirectory: 'collect-admin-web',
                                    // 传输完成后在远程执行的命令
                                    execCommand: '''
                                        # 目标目录
                                        TARGET_DIR="collect-admin-web/prod"
                                        # 判断目录是否存在
                                        if [ -d "$TARGET_DIR" ]; then
                                            # 生成时间戳
                                            TIMESTAMP=$(date +%Y%m%d%H%M%S)
                                            # 执行备份（重命名）
                                            mv "$TARGET_DIR" "${TARGET_DIR}-${TIMESTAMP}"
                                            echo "备份完成：${TARGET_DIR}-${TIMESTAMP}"
                                        fi
                                        mv collect-admin-web/dist collect-admin-web/prod
                                        echo "部署完成于 $(date)" >> collect-admin-web/deploy.log
                                    ''',
                                    // 可选：是否在传输前清空远程目录
                                    cleanRemote: false
                                )
                            ],
                            // 可选：全局执行命令（在所有传输完成后执行一次）
                            execCommand: 'echo 所有文件传输完毕',
                            // 可选：是否使用sudo
                            useSftpForExec: false
                        )
                    ]
                )
            }
        }
    }
}
