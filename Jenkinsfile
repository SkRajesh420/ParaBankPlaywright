pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS-LTS'  // Match your Global Tool Configuration name
    }
    
    stages {
        stage('Install Dependencies') {
            steps {
                // For Windows
                bat 'npm install'
                bat 'npx playwright install'
            }
        }
        
        stage('Run Tests') {
            steps {
                // For Windows
                bat 'npx playwright test'
            }
        }
    }
    
    post {
        always {
            // Archive the HTML report
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Test Report'
            ])
        }
    }
}