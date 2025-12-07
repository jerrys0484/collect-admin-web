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
                    [configFile(fileId: 'collect-admin-web-env', targetLocation: '.env')]
                ) {
                    sh '''
                        echo "配置文件已生成："
                        cat .env
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
                                    sourceFiles: 'dist/**,restart.sh',
                                    // 远程目录（相对于系统配置中的“Remote Directory”）
                                    remoteDirectory: 'collect-admin-web',
                                    // 传输完成后在远程执行的命令
                                    execCommand: '''
                                        chmod +x restart.sh >> test.log
                                        sh restart.sh 2>&1 || exit 1
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
