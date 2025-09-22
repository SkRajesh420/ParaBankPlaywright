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
    }
    
    // Define build parameters (optional)
    parameters {
        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit', 'all'],
            description: 'Browser to run tests on'
        )
        booleanParam(
            name: 'HEADED',
            defaultValue: false,
            description: 'Run tests in headed mode'
        )
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out source code...'
                // Git checkout happens automatically with SCM pipeline
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                
                // Use bat for Windows, sh for Linux/Mac
                script {
                    if (isUnix()) {
                        sh 'npm ci'
                        sh 'npx playwright install'
                        sh 'npx playwright install-deps'
                    } else {
                        bat 'npm ci'
                        bat 'npx playwright install'
                        bat 'npx playwright install-deps'
                    }
                }
            }
        }
        
        stage('Lint Code') {
            steps {
                echo 'Running code linting...'
                script {
                    try {
                        if (isUnix()) {
                            sh 'npm run lint || true'  // || true prevents failure
                        } else {
                            bat 'npm run lint || exit 0'
                        }
                    } catch (Exception e) {
                        echo "Linting failed: ${e.getMessage()}"
                    }
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                echo "Running Playwright tests on ${params.BROWSER}..."
                
                script {
                    try {
                        // Build test command based on parameters
                        def testCommand = 'npx playwright test'
                        
                        if (params.BROWSER != 'all') {
                            testCommand += " --project=${params.BROWSER}"
                        }
                        
                        if (params.HEADED) {
                            testCommand += ' --headed'
                        }
                        
                        // Add reporter for CI
                        testCommand += ' --reporter=html,junit'
                        
                        // Run tests
                        if (isUnix()) {
                            sh testCommand
                        } else {
                            bat testCommand
                        }
                        
                    } catch (Exception e) {
                        // Don't fail the build immediately - let post actions run
                        currentBuild.result = 'UNSTABLE'
                        echo "Tests failed: ${e.getMessage()}"
                    }
                }
            }
        }
        
        stage('Generate Reports') {
            when {
                // Only generate reports if we have test results
                expression { fileExists('playwright-report') }
            }
            steps {
                echo 'Generating test reports...'
                script {
                    if (isUnix()) {
                        sh 'npx playwright show-report --reporter=html'
                    } else {
                        bat 'npx playwright show-report --reporter=html'
                    }
                }
            }
        }
    }
    
    // Post-build actions
    post {
        always {
            echo 'Cleaning up and archiving artifacts...'
            
            // Archive test reports
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Test Report'
            ])
            
            // Archive artifacts
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
            
            // Publish test results if JUnit reporter was used
            script {
                if (fileExists('test-results/results.xml')) {
                    junit 'test-results/results.xml'
                }
            }
            
            // Clean workspace
            cleanWs()
        }
        
        success {
            echo '✅ Pipeline completed successfully!'
            // You can add notifications here
            // emailext (
            //     subject: "✅ Tests Passed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
            //     body: "All tests passed successfully!",
            //     to: "your-email@example.com"
            // )
        }
        
        failure {
            echo '❌ Pipeline failed!'
            // Send failure notifications
        }
        
        unstable {
            echo '⚠️ Some tests failed, but build completed.'
            // Send unstable notifications
        }
    }
}