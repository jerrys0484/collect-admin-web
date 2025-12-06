pipeline {
    // Run on an agent where we want to use Go
    agent any

    // Ensure the desired Go version is installed for all stages,
    // using the name defined in the Global Tool Configuration
    tools { nodejs 'node25' }

    stages {
        stage('Build') {
            steps {
                nodejs() {
                    sh 'echo "开始构建..."'
                    sh 'ls -la'
                    sh 'npm -v'
                }
            }
        }
    }
}
