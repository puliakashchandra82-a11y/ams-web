pipeline {
    agent any
    parameters {
        choice(name: 'TARGET_SITE', choices: ['Cloudflare', 'GitHubPages'], description: 'Which site to release to')
        gitParameter name: 'VERSION_TAG',
                     type: 'PT_TAG',
                     tagFilter: 'v*',
                     sortMode: 'DESCENDING_SMART',
                     defaultValue: 'v1.0.0',
                     description: 'Which version tag to release'
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
        stage('Deploy') {
            steps {
                script {
                    if (params.TARGET_SITE == 'Cloudflare') {
                        withCredentials([
                            string(credentialsId: 'cloudflare-api-token', variable: 'CLOUDFLARE_API_TOKEN'),
                            string(credentialsId: 'cloudflare-account-id', variable: 'CLOUDFLARE_ACCOUNT_ID')
                        ]) {
                            sh 'npx wrangler deploy'
                        }
                    } else {
                        withCredentials([usernamePassword(credentialsId: 'github-credentials', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                            sh """
                                git config user.email "jenkins@local"
                                git config user.name "Jenkins"
                                git checkout -B gh-pages
                                git add -A
                                git commit -m "Deploy ${params.VERSION_TAG} to GitHub Pages" --allow-empty
                                git push -f https://\$GIT_USER:\$GIT_TOKEN@github.com/puliakashchandra82-a11y/ams-web.git HEAD:gh-pages
                            """
                        }
                    }
                }
            }
        }
    }
}