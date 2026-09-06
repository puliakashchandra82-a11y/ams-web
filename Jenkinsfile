pipeline {
    agent any
    parameters {
        choice(name: 'TARGET_SITE', choices: ['Cloudflare', 'GitSite'], description: 'Which site to release to')
        gitParameter name: 'VERSION_TAG',
                     type: 'PT_TAG',
                     tagFilter: 'v*',
                     sortMode: 'DESCENDING_SMART',
                     description: 'Which version tag to release'
    }
    stages {
        stage('Checkout selected tag') {
            steps {
                checkout scmGit(
                    branches: [[name: params.VERSION_TAG]],
                    userRemoteConfigs: [[url: 'https://github.com/puliakashchandra82-a11y/branching.git']]
                )
            }
        }
        stage('Release') {
            steps {
                script {
                    if (params.TARGET_SITE == 'Cloudflare') {
                        sh "echo Deploying ${params.VERSION_TAG} to Cloudflare"
                        // real command later, e.g.: sh 'wrangler pages deploy .'
                    } else {
                        sh "echo Deploying ${params.VERSION_TAG} to Git-hosted site"
                        // real command later, e.g.: sh 'ssh user@server git pull'
                    }
                }
            }
        }
    }
}