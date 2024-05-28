pipeline {
    agent any
    parameters {
        gitParameter branchFilter: 'origin/(.*)', defaultValue: 'dev', name: 'BRANCH', type: 'PT_BRANCH', sortMode: 'ASCENDING_SMART'
        choice(name: 'ENV', choices: ['STAGE','PRODUCTION'], description: 'Choose a deployment environment')
        choice(name: 'NODE_ENV', choices: ['development', 'stage','production'], description: 'Choose a NODE_ENV variable')
        string(name: 'APP_VERSION', description: 'Choose an App Version (Git Tag)')
    }
    environment{
        NODE_PATH = './src'
    }
    stages {
        stage('Checkout') {
            steps {
                cleanWs(cleanWhenFailure: true)
                echo "Checking out branch ${params.BRANCH}"
                git branch: "${params.BRANCH}", url: "${env.GIT_URL}", credentialsId: 'gitlab-key'
            }
        }
        stage('Build') {
            steps{
                echo "Creating an optimized build for ${params.NODE_ENV}..."
                withCredentials([file(credentialsId: "YBIT_FRONT_ENV_${params.ENV}", variable: "DOTENV_VARS")]){
                    sh "./build.sh ${params.NODE_ENV}"
                    sh "echo '\n' >> .env"
                    sh "cat $DOTENV_VARS >> .env"
                    sh "echo '\n' >> .env"
                    sh "echo REACT_APP_APP_VERSION=\\\"${params.APP_VERSION}\\\" >> .env"
                    sh "cat .env"
                }
                script {
                    docker.image("node:10.15.2-alpine").inside{
                        sh "npm ci"
                        sh "NODE_ENV=${params.NODE_ENV} npm run build"
                    }
                }
            }
        }
        stage('Upload Sourcemap to Bugsnag') {
            when{
                expression {params.NODE_ENV == 'stage' || params.NODE_ENV == 'production'}
            }
            steps{
                echo "APP_VERSION=${params.APP_VERSION}"
                echo "Uploading to Bugsnag..."
                script {
                    docker.image("node:10.15.2-alpine").inside{
                        sh "npm run sourcemap"
                    }
                }
            }
        }
        stage('Deploy to Stage') {
            when{
                expression {params.ENV == 'STAGE'}
            }
            steps{
                echo "Deploying to stage..."
                sshPublisher(
                    failOnError: true,
                    publishers: [
                        sshPublisherDesc(
                            configName: 'staging',
                            transfers: [
                                sshTransfer(
                                    sourceFiles: 'build/**',
                                    removePrefix: 'build',
                                    remoteDirectory: 'webthatmatters/ybit/front'
                                )
                            ]
                        )
                    ]
                )
            }
        }
        stage('Deploy to Production') {
            when{
                expression {params.ENV == 'PRODUCTION'}
            }
            steps{
                echo "Deploying to Production..."
                sshPublisher(
                    failOnError: true,
                    publishers: [
                        sshPublisherDesc(
                            configName: 'ybit-prod',
                            transfers: [
                                sshTransfer(
                                    sourceFiles: 'build/**',
                                    removePrefix: 'build',
                                    remoteDirectory: 'ybit/front'
                                )
                            ]
                        )
                    ]
                )
            }
        }
    }
}