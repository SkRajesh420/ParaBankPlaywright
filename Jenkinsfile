pipeline {
    // Run on any available agent
    agent any
    
    // Define tools to use
    tools {
        nodejs 'NodeJS-LTS'  // Must match the name in Global Tool Configuration
    }
    
    // Environment variables
    environment {
        // Set environment for headless browsers
        DISPLAY = ':99'
        PLAYWRIGHT_BROWSERS_PATH = '0'
        NODE_ENV = 'test'
        CI = 'true'
        // Add more specific paths
        PLAYWRIGHT_JUNIT_OUTPUT_NAME = 'test-results/junit-results.xml'
        PLAYWRIGHT_HTML_OUTPUT_DIR = 'playwright-report'
    }
    
    // Pipeline options
    options {
        // Keep builds for 30 days or last 10 builds
        buildDiscarder(logRotator(numToKeepStr: '10', daysToKeepStr: '30'))
        // Set global timeout
        timeout(time: 30, unit: 'MINUTES')
        // Skip default checkout
        skipDefaultCheckout(true)
        // Add timestamps to console output
        timestamps()
        // Prevent concurrent builds
        disableConcurrentBuilds()
    }
    
    // Define build parameters
    parameters {
        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit', 'all'],
            description: 'Browser to run tests on'
        )
        booleanParam(
            name: 'HEADED',
            defaultValue: false,
            description: 'Run tests in headed mode (useful for debugging)'
        )
        booleanParam(
            name: 'DEBUG',
            defaultValue: false,
            description: 'Run tests with debug output'
        )
        choice(
            name: 'TEST_LEVEL',
            choices: ['smoke', 'regression', 'all'],
            description: 'Test level to run'
        )
        string(
            name: 'TEST_GREP',
            defaultValue: '',
            description: 'Grep pattern to filter tests (optional)'
        )
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out source code...'
                // Clean checkout with submodules if needed
                checkout([$class: 'GitSCM', 
                    branches: scm.branches, 
                    extensions: [[$class: 'CloneOption', shallow: true, depth: 1]], 
                    userRemoteConfigs: scm.userRemoteConfigs
                ])
                
                // Display git information
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
                    // Create necessary directories
                    if (isUnix()) {
                        sh 'mkdir -p test-results playwright-report'
                        // Start virtual display for Linux
                        sh '''
                            if [ "$DISPLAY" = ":99" ]; then
                                Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
                                sleep 2
                            fi
                        '''
                    } else {
                        bat 'if not exist test-results mkdir test-results'
                        bat 'if not exist playwright-report mkdir playwright-report'
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
                        } else {
                            bat 'node --version'
                            bat 'npm --version' 
                            bat 'npm ci --prefer-offline --no-audit'
                            bat 'npx playwright install --with-deps'
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
            parallel {
                stage('Chromium Tests') {
                    when {
                        expression { params.BROWSER == 'chromium' || params.BROWSER == 'all' }
                    }
                    steps {
                        script {
                            runPlaywrightTests('chromium')
                        }
                    }
                }
                
                stage('Firefox Tests') {
                    when {
                        expression { params.BROWSER == 'firefox' || params.BROWSER == 'all' }
                    }
                    steps {
                        script {
                            runPlaywrightTests('firefox')
                        }
                    }
                }
                
                stage('WebKit Tests') {
                    when {
                        expression { params.BROWSER == 'webkit' || params.BROWSER == 'all' }
                    }
                    steps {
                        script {
                            runPlaywrightTests('webkit')
                        }
                    }
                }
            }
        }
        
        stage('Generate Reports') {
            when {
                anyOf {
                    expression { fileExists('playwright-report') }
                    expression { fileExists('test-results') }
                }
            }
            steps {
                echo 'Processing test reports...'
                script {
                    // Merge multiple test result files if running parallel tests
                    if (isUnix()) {
                        sh '''
                            if [ -d "test-results" ]; then
                                echo "Test results directory contents:"
                                ls -la test-results/
                            fi
                            
                            if [ -d "playwright-report" ]; then
                                echo "Playwright report directory contents:"
                                ls -la playwright-report/
                            fi
                        '''
                    } else {
                        bat '''
                            if exist test-results (
                                echo Test results directory contents:
                                dir test-results
                            )
                            
                            if exist playwright-report (
                                echo Playwright report directory contents:
                                dir playwright-report
                            )
                        '''
                    }
                }
            }
        }
    }
    
    // Post-build actions
    post {
        always {
            echo 'Processing build artifacts and reports...'
            
            script {
                try {
                    // Publish HTML reports
                    if (fileExists('playwright-report/index.html')) {
                        publishHTML([
                            allowMissing: false,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'playwright-report',
                            reportFiles: 'index.html',
                            reportName: 'Playwright Test Report',
                            reportTitles: ''
                        ])
                    }
                    
                    // Archive test artifacts
                    archiveArtifacts(
                        artifacts: 'playwright-report/**,test-results/**', 
                        allowEmptyArchive: true,
                        fingerprint: true
                    )
                    
                    // Publish JUnit test results
                    def junitFiles = []
                    if (fileExists('test-results/junit-results.xml')) {
                        junitFiles.add('test-results/junit-results.xml')
                    }
                    
                    // Check for multiple result files (from parallel execution)
                    if (isUnix()) {
                        def additionalResults = sh(
                            script: 'find test-results -name "*.xml" -type f',
                            returnStdout: true
                        ).trim()
                        if (additionalResults) {
                            junitFiles.addAll(additionalResults.split('\n'))
                        }
                    }
                    
                    if (junitFiles) {
                        junit(
                            testResults: junitFiles.join(','),
                            allowEmptyResults: true,
                            keepLongStdio: true
                        )
                    }
                    
                } catch (Exception e) {
                    echo "Error processing reports: ${e.getMessage()}"
                }
            }
        }
        
        success {
            echo '✅ All tests passed successfully!'
            script {
                // Send success notifications
                sendNotification(
                    'SUCCESS', 
                    "✅ Tests Passed: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                    "All Playwright tests passed successfully on ${params.BROWSER} browser(s)."
                )
            }
        }
        
        failure {
            echo '❌ Pipeline failed!'
            script {
                sendNotification(
                    'FAILURE',
                    "❌ Tests Failed: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                    "Pipeline failed. Check the build logs for details."
                )
            }
        }
        
        unstable {
            echo '⚠️ Some tests failed, but build completed.'
            script {
                sendNotification(
                    'UNSTABLE',
                    "⚠️ Tests Unstable: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                    "Some tests failed. Check the test report for details."
                )
            }
        }
        
        cleanup {
            // Only clean workspace on success to preserve debug info on failures
            script {
                if (currentBuild.result == 'SUCCESS') {
                    cleanWs(cleanWhenNotBuilt: false,
                           cleanWhenSuccess: true,
                           cleanWhenUnstable: false,
                           cleanWhenFailure: false,
                           cleanWhenAborted: false,
                           deleteDirs: true)
                } else {
                    echo "Preserving workspace for debugging. Result: ${currentBuild.result}"
                }
            }
        }
    }
}

// Helper function to run Playwright tests
def runPlaywrightTests(String browser) {
    echo "Running Playwright tests on ${browser}..."
    
    try {
        // Build test command
        def testCommand = 'npx playwright test'
        testCommand += " --project=${browser}"
        
        // Add conditional parameters
        if (params.HEADED) {
            testCommand += ' --headed'
        }
        
        if (params.DEBUG) {
            testCommand += ' --debug'
        }
        
        if (params.TEST_GREP) {
            testCommand += " --grep='${params.TEST_GREP}'"
        }
        
        // Configure reporters with proper output paths
        testCommand += " --reporter=html,junit"
        
        // Add retry for flaky tests
        testCommand += ' --retries=2'
        
        // Set output directories
        def htmlOutput = "playwright-report-${browser}"
        def junitOutput = "test-results/junit-${browser}.xml"
        
        // Set environment variables for this test run
        withEnv([
            "PLAYWRIGHT_HTML_OUTPUT_DIR=${htmlOutput}",
            "PLAYWRIGHT_JUNIT_OUTPUT_NAME=${junitOutput}"
        ]) {
            timeout(time: 20, unit: 'MINUTES') {
                if (isUnix()) {
                    sh testCommand
                } else {
                    bat testCommand
                }
            }
        }
        
    } catch (Exception e) {
        // Mark build as unstable but continue
        currentBuild.result = 'UNSTABLE'
        echo "Tests failed for ${browser}: ${e.getMessage()}"
    }
}

// Helper function to send notifications
def sendNotification(String status, String subject, String message) {
    // Email notification (uncomment and configure as needed)
    /*
    emailext (
        subject: subject,
        body: """
            <h3>${subject}</h3>
            <p>${message}</p>
            <p><strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
            <p><strong>Console Output:</strong> <a href="${env.BUILD_URL}console">${env.BUILD_URL}console</a></p>
            <p><strong>Test Report:</strong> <a href="${env.BUILD_URL}Playwright_Test_Report/">${env.BUILD_URL}Playwright_Test_Report/</a></p>
        """,
        mimeType: 'text/html',
        to: "${env.CHANGE_AUTHOR_EMAIL ?: 'team@example.com'}",
        replyTo: 'noreply@example.com'
    )
    */
    
    // Slack notification (configure webhook URL)
    /*
    slackSend(
        channel: '#ci-cd',
        color: status == 'SUCCESS' ? 'good' : (status == 'UNSTABLE' ? 'warning' : 'danger'),
        message: "${subject}\n${message}\nBuild: ${env.BUILD_URL}"
    )
    */
    
    echo "Notification sent: ${subject}"
}