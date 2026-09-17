pipeline {

    agent any

    environment {
        GIT_HOME = 'C:/Users/charan.hg/AppData/Local/Programs/Git/cmd'
        DOCKER_HOME = 'C:/Users/charan.hg/AppData/Local/Programs/DockerDesktop/resources/bin'
        PATH = "${GIT_HOME};${DOCKER_HOME};${env.PATH}"
    }

    stages {

        stage('Environment Check') {
            steps {
                echo 'Checking required tools...'

                bat '''
                    echo ===== Git =====
                    git --version

                    echo ===== Docker =====
                    docker --version

                    echo ===== Docker Compose =====
                    docker-compose version

                    echo ===== Node =====
                    node --version

                    echo ===== NPM =====
                    npm --version
                '''
            }
        }

        stage('Backend Build') {
            steps {
                echo 'Building Spring Boot backend...'

                bat '''
                    cd backend
                    mvnw.cmd clean package -DskipTests
                '''
            }
        }

        stage('Frontend Build') {
            steps {
                echo 'Building React frontend...'

                bat '''
                    cd frontend
                    call npm ci
                    call npm run build
                '''
            }
        }

        stage('Install Playwright Dependencies') {
            steps {
                echo 'Installing Playwright dependencies and Chromium...'

                bat '''
                    cd playright

                    echo ===== NPM CI =====
                    // FIX: Prepended "call" so windows doesn't terminate the script here
                    call npm ci

                    echo ===== PLAYWRIGHT VERSION =====
                    call npx playwright --version

                    echo ===== INSTALLING CHROMIUM LOCAL CACHE =====
                    set PLAYWRIGHT_BROWSERS_PATH=C:/ProgramData/Jenkins/.jenkins/workspace/Teacher_Student_App/playright/.cache
                    call npx playwright install chromium

                    echo ===== VERIFYING BROWSER INSTALLATION =====
                    call npx playwright install --list

                    echo ===== CHROMIUM INSTALLATION COMPLETE =====
                '''
            }
        }

        stage('Start Application') {
            steps {
                echo 'Starting application using Docker Compose...'

                bat '''
                    docker-compose down || exit /b 0
                    docker-compose up -d --build
                '''
            }
        }

        stage('Wait for Application') {
            steps {
                echo 'Waiting for application to become ready...'

                bat '''
                    echo Checking frontend...

                    for /L %%i in (1,1,12) do (
                        curl --fail http://localhost:5173/login >nul 2>&1

                        if not errorlevel 1 (
                            echo Frontend is ready.
                            goto frontend_ready
                        )

                        echo Frontend not ready yet. Waiting 5 seconds...
                        ping 127.0.0.1 -n 6 >nul
                    )

                    echo Frontend failed to start.
                    exit /b 1

                    :frontend_ready
                    echo Checking backend...

                    for /L %%i in (1,1,24) do (
                        curl --fail http://localhost:8081/api/students >nul 2>&1

                        if not errorlevel 1 (
                            echo Backend is ready.
                            goto backend_ready
                        )

                        echo Backend not ready yet. Waiting 5 seconds...
                        ping 127.0.0.1 -n 6 >nul
                    )

                    echo Backend failed to start.
                    exit /b 1

                    :backend_ready
                    echo =====================================
                    echo APPLICATION IS READY
                    echo =====================================
                '''
            }
        }

        stage('Run Playwright Tests') {
            steps {
                echo 'Running Playwright tests...'

                bat '''
                    cd playright
                    set PLAYWRIGHT_BROWSERS_PATH=C:/ProgramData/Jenkins/.jenkins/workspace/Teacher_Student_App/playright/.cache
                    call npx playwright test --workers=1 --grep-invert "Debug artifacts demo"
                '''
            }
        }

        stage('Docker Images') {
            steps {
                echo 'Building Docker images...'

                bat '''
                    docker-compose build
                '''
            }
        }
    }

    post {

        always {
            echo 'Collecting Docker logs...'

            bat '''
                docker-compose logs || exit /b 0
            '''
        }

        success {
            echo '========================================='
            echo 'BUILD SUCCESSFUL'
            echo 'All stages completed successfully.'
            echo '========================================='
        }

        failure {
            echo '========================================='
            echo 'BUILD FAILED'
            echo 'Check the failed stage in Console Output.'
            echo '========================================='
        }

        cleanup {
            echo 'Stopping Docker containers...'

            bat '''
                docker-compose down || exit /b 0
            '''
        }
    }
}
