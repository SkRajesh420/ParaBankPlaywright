pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS-LTS'
    }
    
    environment {
        // Environment for headless browsers
        DISPLAY = ':99'
        PLAYWRIGHT_BROWSERS_PATH = '0'
        NODE_ENV = 'test'
        CI = 'true'
        // Base URL from your config
        BASE_URL = 'https://parabank.parasoft.com/parabank'
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10', daysToKeepStr: '30'))
        timeout(time: 60, unit: 'MINUTES') // Increased for sequential execution
        skipDefaultCheckout(true)
        timestamps()
        disableConcurrentBuilds()
    }
    
    parameters {
        choice(
            name: 'PROJECT',
            choices: [
                'all',
                'UI - Chromium',
                'UI - Firefox',
                'UI - WebKit',
                'UI - Mobile Chrome',
                'UI - Mobile Safari',
                'UI - iPad',
                'UI - Galaxy S9+',
                'UI - iPhone 12',
                'API Tests'
            ],
            description: 'Select which project(s) to run'
        )
        booleanParam(
            name: 'HEADED',
            defaultValue: false,
            description: 'Run tests in headed mode (overrides config headless: false)'
        )
        booleanParam(
            name: 'DEBUG',
            defaultValue: false,
            description: 'Run tests with debug output'
        )
        string(
            name: 'TEST_GREP',
            defaultValue: '',
            description: 'Grep pattern to filter tests (optional)'
        )
        booleanParam(
            name: 'SKIP_ALLURE_REPORT',
            defaultValue: false,
            description: 'Skip Allure report generation'
        )
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out source code...'
                checkout([$class: 'GitSCM', 
                    branches: scm.branches, 
                    extensions: [[$class: 'CloneOption', shallow: true, depth: 1]], 
                    userRemoteConfigs: scm.userRemoteConfigs
                ])
                
                script {
                    if (isUnix()) {
                        sh 'git log --oneline -n 5'
                        sh 'git branch -a'
                    } else {
                        bat 'git log --oneline -n 5'
                        bat 'git branch -a'
                    }
                }
            }
        }
        
        stage('Setup Environment') {
            steps {
                echo 'Setting up test environment...'
                
                script {
                    // Create necessary directories matching your config
                    if (isUnix()) {
                        sh '''
                            mkdir -p test-results
                            mkdir -p playwright-report
                            mkdir -p allure-results
                        '''
                        // Start virtual display for Linux
                        sh '''
                            if [ "$DISPLAY" = ":99" ]; then
                                Xvfb :99 -screen 0 1280x768x24 > /dev/null 2>&1 &
                                sleep 2
                            fi
                        '''
                    } else {
                        bat '''
                            if not exist test-results mkdir test-results
                            if not exist playwright-report mkdir playwright-report
                            if not exist allure-results mkdir allure-results
                        '''
                    }
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                
                script {
                    try {
                        if (isUnix()) {
                            sh 'node --version'
                            sh 'npm --version'
                            sh 'npm ci --prefer-offline --no-audit'
                            sh 'npx playwright install --with-deps'
                            
                            // Verify allure-playwright is installed
                            sh 'npm list @playwright/test allure-playwright || true'
                        } else {
                            bat 'node --version'
                            bat 'npm --version' 
                            bat 'npm ci --prefer-offline --no-audit'
                            bat 'npx playwright install --with-deps'
                            
                            bat 'npm list @playwright/test allure-playwright || exit 0'
                        }
                    } catch (Exception e) {
                        error "Failed to install dependencies: ${e.getMessage()}"
                    }
                }
            }
            post {
                failure {
                    echo 'Dependency installation failed. Check Node.js and npm versions.'
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                script {
                    echo "Running Playwright tests for project: ${params.PROJECT}"
                    
                    // Build test command based on your config
                    def testCommand = 'npx playwright test'
                    
                    // Add project selection
                    if (params.PROJECT != 'all') {
                        testCommand += " --project='${params.PROJECT}'"
                    }
                    
                    // Add headed mode if requested (overrides config)
                    if (params.HEADED) {
                        testCommand += ' --headed'
                    }
                    
                    // Add debug mode
                    if (params.DEBUG) {
                        testCommand += ' --debug'
                    }
                    
                    // Add grep filter
                    if (params.TEST_GREP) {
                        testCommand += " --grep='${params.TEST_GREP}'"
                    }
                    
                    // Execute tests
                    try {
                        timeout(time: 50, unit: 'MINUTES') {
                            if (isUnix()) {
                                sh testCommand
                            } else {
                                bat testCommand
                            }
                        }
                    } catch (Exception e) {
                        currentBuild.result = 'UNSTABLE'
                        echo "Tests failed: ${e.getMessage()}"
                    }
                }
            }
        }
        
        stage('Generate Allure Report') {
            when {
                expression { !params.SKIP_ALLURE_REPORT }
            }
            steps {
                echo 'Generating Allure report...'
                script {
                    try {
                        // Check if allure-results exists and has files
                        def hasResults = false
                        if (isUnix()) {
                            hasResults = sh(
                                script: 'test -d allure-results && [ "$(ls -A allure-results)" ]',
                                returnStatus: true
                            ) == 0
                        } else {
                            hasResults = bat(
                                script: 'if exist allure-results\\* (exit 0) else (exit 1)',
                                returnStatus: true
                            ) == 0
                        }
                        
                        if (hasResults) {
                            // Install Allure commandline if not available
                            if (isUnix()) {
                                sh '''
                                    if ! command -v allure &> /dev/null; then
                                        echo "Installing Allure commandline..."
                                        npm install -g allure-commandline --save-dev
                                    fi
                                '''
                                sh 'allure generate allure-results --clean -o allure-report'
                            } else {
                                bat '''
                                    where allure >nul 2>&1 || npm install -g allure-commandline --save-dev
                                '''
                                bat 'allure generate allure-results --clean -o allure-report'
                            }
                        } else {
                            echo 'No Allure results found, skipping report generation'
                        }
                    } catch (Exception e) {
                        echo "Allure report generation failed: ${e.getMessage()}"
                        echo "Continuing pipeline execution..."
                    }
                }
            }
        }
        
        stage('Process Reports') {
            steps {
                echo 'Processing test reports...'
                script {
                    if (isUnix()) {
                        sh '''
                            echo "=== Test Results Directory ==="
                            if [ -d "test-results" ]; then
                                ls -la test-results/
                            fi
                            
                            echo "=== Playwright HTML Report ==="
                            if [ -d "playwright-report" ]; then
                                ls -la playwright-report/
                            fi
                            
                            echo "=== Allure Results ==="
                            if [ -d "allure-results" ]; then
                                ls -la allure-results/ | head -20
                            fi
                        '''
                    } else {
                        bat '''
                            echo === Test Results Directory ===
                            if exist test-results dir test-results
                            
                            echo === Playwright HTML Report ===
                            if exist playwright-report dir playwright-report
                            
                            echo === Allure Results ===
                            if exist allure-results dir allure-results
                        '''
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo 'Processing build artifacts and reports...'
            
            script {
                try {
                    // Publish Playwright HTML Report
                    if (fileExists('playwright-report/index.html')) {
                        publishHTML([
                            allowMissing: false,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'playwright-report',
                            reportFiles: 'index.html',
                            reportName: 'Playwright HTML Report',
                            reportTitles: ''
                        ])
                        echo '✅ Playwright HTML report published'
                    }
                    
                    // Publish Allure Report
                    if (fileExists('allure-report/index.html')) {
                        publishHTML([
                            allowMissing: true,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'allure-report',
                            reportFiles: 'index.html',
                            reportName: 'Allure Report',
                            reportTitles: ''
                        ])
                        echo '✅ Allure report published'
                    }
                    
                    // Archive all artifacts
                    archiveArtifacts(
                        artifacts: 'playwright-report/**,test-results/**,allure-results/**,allure-report/**', 
                        allowEmptyArchive: true,
                        fingerprint: true
                    )
                    
                    // Publish JUnit test results
                    if (fileExists('test-results/junit.xml')) {
                        junit(
                            testResults: 'test-results/junit.xml',
                            allowEmptyResults: true,
                            keepLongStdio: true
                        )
                        echo '✅ JUnit results published'
                    }
                    
                    // Publish JSON results as artifact (optional)
                    if (fileExists('test-results/results.json')) {
                        echo '✅ JSON results available in artifacts'
                    }
                    
                } catch (Exception e) {
                    echo "Error processing reports: ${e.getMessage()}"
                }
            }
        }
        
        success {
            echo '✅ All tests passed successfully!'
            script {
                sendNotification(
                    'SUCCESS', 
                    "✅ Tests Passed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    "All Playwright tests passed for project: ${params.PROJECT}"
                )
            }
        }
        
        failure {
            echo '❌ Pipeline failed!'
            script {
                sendNotification(
                    'FAILURE',
                    "❌ Tests Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    "Pipeline failed for project: ${params.PROJECT}. Check logs for details."
                )
            }
        }
        
        unstable {
            echo '⚠️ Some tests failed, but build completed.'
            script {
                sendNotification(
                    'UNSTABLE',
                    "⚠️ Tests Unstable: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    "Some tests failed for project: ${params.PROJECT}. Check reports for details."
                )
            }
        }
        
        cleanup {
            script {
                if (currentBuild.result == 'SUCCESS') {
                    // Clean workspace but preserve reports
                    echo 'Cleaning workspace (preserving reports)...'
                    cleanWs(
                        cleanWhenNotBuilt: false,
                        cleanWhenSuccess: true,
                        cleanWhenUnstable: false,
                        cleanWhenFailure: false,
                        cleanWhenAborted: false,
                        deleteDirs: true,
                        patterns: [
                            [pattern: 'playwright-report/**', type: 'EXCLUDE'],
                            [pattern: 'test-results/**', type: 'EXCLUDE'],
                            [pattern: 'allure-report/**', type: 'EXCLUDE'],
                            [pattern: 'allure-results/**', type: 'EXCLUDE']
                        ]
                    )
                } else {
                    echo "Preserving workspace for debugging. Result: ${currentBuild.result}"
                }
            }
        }
    }
}

// Helper function to send notifications
// def sendNotification(String status, String subject, String message) {
//     // Configure these based on your needs
    
//     // Email notification (uncomment and configure)
    
//     // emailext (
//     //     subject: subject,
//     //     body: """
//     //         <html>
//     //         <body>
//     //             <h3>${subject}</h3>
//     //             <p>${message}</p>
//     //             <hr>
//     //             <h4>Build Information:</h4>
//     //             <ul>
//     //                 <li><strong>Project:</strong> ${params.PROJECT}</li>
//     //                 <li><strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></li>
//     //                 <li><strong>Console Output:</strong> <a href="${env.BUILD_URL}console">${env.BUILD_URL}console</a></li>
//     //                 <li><strong>Playwright Report:</strong> <a href="${env.BUILD_URL}Playwright_HTML_Report/">${env.BUILD_URL}Playwright_HTML_Report/</a></li>
//     //                 <li><strong>Allure Report:</strong> <a href="${env.BUILD_URL}Allure_Report/">${env.BUILD_URL}Allure_Report/</a></li>
//     //             </ul>
//     //         </body>
//     //         </html>
//     //     """,
//     //     mimeType: 'text/html',
//     //     to: "${env.CHANGE_AUTHOR_EMAIL ?: '81srajesh@gmail.com'}",
//     //     replyTo: 'noreply@example.com'
//     // )
    
    
//     // Slack notification (configure webhook URL in Jenkins)
    
//     // slackSend(
//     //     channel: '#qa-automation',
//     //     color: status == 'SUCCESS' ? 'good' : (status == 'UNSTABLE' ? 'warning' : 'danger'),
//     //     message: "${subject}\n${message}\n<${env.BUILD_URL}|View Build> | <${env.BUILD_URL}Playwright_HTML_Report/|Test Report>"
//     // )
    
    
//     // echo "Notification: ${subject}"
// }