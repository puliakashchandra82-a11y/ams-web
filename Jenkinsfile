pipeline {
    agent any
    parameters {
        gitParameter name: 'VERSION_TAG',
                     type: 'PT_TAG',
                     tagFilter: 'v*',
                     sortMode: 'DESCENDING_SMART',
                     defaultValue: 'v1.0.0',
                     description: 'Which version tag to release to the live site'
    }
    stages {
        stage('Checkout selected tag') {
            steps {
                checkout scmGit(
                    branches: [[name: params.VERSION_TAG]],
                    userRemoteConfigs: [[url: 'https://github.com/puliakashchandra82-a11y/ams-web.git']]
                )
            }
        }
        stage('Inject version') {
            steps {
                sh "sed -i 's/{{VERSION}}/${params.VERSION_TAG}/' index.html"
            }
        }
        stage('Deploy to Cloudflare') {
            steps {
                withCredentials([
                    string(credentialsId: 'cloudflare-api-token', variable: 'CLOUDFLARE_API_TOKEN'),
                    string(credentialsId: 'cloudflare-account-id', variable: 'CLOUDFLARE_ACCOUNT_ID')
                ]) {
                    sh 'npx wrangler deploy'
                }
            }
        }
    }
}