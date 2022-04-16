pipeline {
    environment {
      registry = "harbor.medsoft.su/quasar_farm"
      registryCredential = 'docker-harbor'
      telegaNotify = false
      // dockerImage = ''
  }
  agent {label 'master_node'}
  
  parameters{
    choice(name: 'GIT_BRANCH', choices: ['develop', 'cicd'], description: 'из какой ветки билдить')
    choice(name: 'DO_DEPLOY', choices: [false, 'direct', 'proxy-jump', 'vipnet-win-agent'], 
    description: '''
        Как деплоить сборку: 
            false - не деплоить, только собрать,
            direct - у Jenkins есть прямой доступ к продакшн серверу по ssh (deploy_url),
            proxy-jump - у Jenkins есть доступ к продакшн серверу по shh, через другой сервер,
            vipnet-win-agent - использовать, агент Jenkins на windows с доступом в закрытые сети .. (10.3.100.4)
        ''')
    choice(name: 'DEPLOY_URL', choices: ['medsoft@10.3.3.12:22/home/medsoft/_deploy/'], description: 'user@host:port/path')
    string(name: 'PROXY_JUMP_URL', defaultValue: 'farm@10.11.148.22:1022', description: 'user@host:port')
  }

  options {
    buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '10'))
    timestamps()
	ansiColor('xterm')
  }

  stages {
    stage('Init & Workspace Cleanup') {
     steps {
        script {
            echo "I got params from main job: DO_DEPLOY: ${params.DO_DEPLOY}, DEPLOY_URL: ${params.DEPLOY_URL}, PROXY_JUMP_URL: ${params.PROXY_JUMP_URL}"
            env.setProperty('returnData', "node-report artifacts url: , ${env.RUN_ARTIFACTS_DISPLAY_URL}" ) // вернется в майн job
            if (params.DO_DEPLOY != 'false') {
                env.url_no_protocol = params.DEPLOY_URL //'farm@10.11.148.22:1022/opt/farm_deploy/'
                env.DEPLOY_USER = sh(script:'echo "$url_no_protocol" | grep "@" | cut -d"/" -f1 | rev | cut -d"@" -f2- | rev', returnStdout: true).trim()
                env.DEPLOY_HOSTPORT = sh(script:'echo "${url_no_protocol/$DEPLOY_USER@/}" | cut -d"/" -f1', returnStdout: true).trim()
                env.DEPLOY_HOST = sh(script:'echo "$DEPLOY_HOSTPORT" | cut -d":" -f1', returnStdout: true).trim()
                env.DEPLOY_PORT = sh(script:'echo "$DEPLOY_HOSTPORT" | grep ":" | cut -d":" -f2', returnStdout: true).trim()
                env.DEPLOY_PATH = sh(script:'echo "$url_no_protocol" | grep "/" | cut -d"/" -f2-', returnStdout: true).trim()
                echo "*********** DEPLOY PARAMS ******************"
                echo "DEPLOY_USER: $DEPLOY_USER"
                echo "DEPLOY_HOSTPORT: $DEPLOY_HOSTPORT"
                echo "DEPLOY_HOST: $DEPLOY_HOST"
                echo "DEPLOY_PORT: $DEPLOY_PORT"
                echo "DEPLOY_PATH: $DEPLOY_PATH"
                echo "*******************************************"
            }
            if (params.DO_DEPLOY == 'proxy-jump') { 
                env.url_no_protocol = params.PROXY_JUMP_URL //'farm@10.11.148.22:1022'
                env.PROXY_USER = sh(script:'echo "$url_no_protocol" | grep "@" | cut -d"/" -f1 | rev | cut -d"@" -f2- | rev', returnStdout: true).trim()
                env.PROXY_HOSTPORT = sh(script:'echo "${url_no_protocol/$PROXY_USER@/}" | cut -d"/" -f1', returnStdout: true).trim()
                env.PROXY_HOST = sh(script:'echo "$PROXY_HOSTPORT" | cut -d":" -f1', returnStdout: true).trim()
                env.PROXY_PORT = sh(script:'echo "$PROXY_HOSTPORT" | grep ":" | cut -d":" -f2', returnStdout: true).trim()
                echo "*********** PROXY PARAMS ******************"
                echo "PROXY_USER: $PROXY_USER"
                echo "PROXY_HOSTPORT: $PROXY_HOSTPORT"
                echo "PROXY_HOST: $PROXY_HOST"
                echo "PROXY_PORT: $PROXY_PORT"
                echo "*******************************************"
            }
            sh 'env'
        }
         step([$class: 'WsCleanup'])
     }
    }
    stage('Build') {
		steps {
		    //   sh "printenv"
            script {
                git branch: '${GIT_BRANCH}', credentialsId: 'jenkins-ssh-hippo', url: 'ssh://git@hippo.medsoft.su:2001/farm/stat-app.git', poll: true
                env.STAT_APP_VERSION = sh(script:'cat ./front/package.json | grep \"version\" | awk -F: \'{ print $2 }\' | sed \'s/[\",]//g\'', returnStdout: true).trim()
                env.STAT_APP_COMMIT_NUMBER = sh(script: 'git rev-list --count HEAD', returnStdout: true).trim()
                env.STAT_APP_COMMIT_HASH = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
                env.STAT_APP_COMMIT_MESSAGE = sh(returnStdout: true, script: 'git log -1 --pretty=%B').trim()
                // GIT_TAG_COMMIT = sh(script: 'git describe --tags --always', returnStdout: true).trim()
                echo "----- stat-app -------"
                echo "\033[35mversion:\033[0m $STAT_APP_VERSION"
                echo "\033[35mcommit #:\033[0m $STAT_APP_COMMIT_NUMBER"
                echo "\033[35mcommit message:\033[0m $STAT_APP_COMMIT_MESSAGE"
                echo "-------------------------"
                
                // dockerImage = docker.build("quasar_farm/stat-app", ".")
                sh '''
                    docker build . --tag quasar_farm/stat-app:latest
                    docker run --name temp-container -d quasar_farm/stat-app:latest "bash"
                    docker cp temp-container:/app ./deploy
                    docker rm -f temp-container
                    cd deploy
                    tar -czf stat-app.tar.gz *
                '''
                if (telegaNotify == true) { telegramSend(message: 'Начало сборки stat-app (no_docker_server)', chatId: -1001206841025) }


                if (params.DO_DEPLOY == 'vipnet-win-agent') {
                    sh 'cp -r deploy/stat-app.tar.gz ./stat-appt.tar.gz'
                    stash name: "tar", includes: "stat-app.tar.gz" // relative to $WORKSPACE    
                }
                if (telegaNotify == true) { telegramSend(message: 'Сборка проекта stat-app завершена', chatId: -1001206841025) }
            }
		}

		post {
            always {
	          archiveArtifacts artifacts: 'deploy/*.tar.gz', onlyIfSuccessful: true
		  }
	    }
    }
    stage('Deploy (if use win10_vipnet_agent)') {
        when {
            expression { params.DO_DEPLOY == 'vipnet-win-agent' }
        }
         agent {label 'win10_vipnet_agent'}
      steps {
        script {
            unstash name: "tar"  // runs in $WORKSPACE, creates $WORKSPACE/myfile.txt
            bat encoding: 'UTF-8', script: "dir"
            bat encoding: 'UTF-8', script: "scp -r -P ${DEPLOY_PORT} deploy/stat-app.tar.gz ${DEPLOY_USER}@${DEPLOY_HOST}:/${DEPLOY_PATH}"
            bat encoding: 'UTF-8', script: "dir"
        }
      }
    }
    stage('Deploy (if use direct access)') {
        when {
            expression { params.DO_DEPLOY == 'direct' }
        }
      steps {
        script {
             echo "DEPLOY_URL: ${params.DEPLOY_URL}"
             sh '''
              echo "----- DEPLOY  stat-app to ${DEPLOY_URL} -------"
              scp -r -P ${DEPLOY_PORT} deploy/stat-app.tar.gz ${DEPLOY_USER}@${DEPLOY_HOST}:/${DEPLOY_PATH}
             '''
        }
      }
    }
    stage('Deploy (if use proxy-jump)') {
        when {
            expression { params.DO_DEPLOY == 'proxy-jump' }
        }
      steps {
        script {
            echo "DEPLOY_URL: ${params.DEPLOY_URL}"
            echo "PROXY_JUMP_URL: ${params.PROXY_JUMP_URL}"
            sh '''
                echo "----- DEPLOY stat-app / use proxy-jump ${PROXY_JUMP_URL} -------"
                scp -r -P ${DEPLOY_PORT} -o "ProxyJump ${PROXY_USER}@${PROXY_HOST}:${PROXY_PORT}" deploy/stat-app.tar.gz ${DEPLOY_USER}@${DEPLOY_HOST}:/${DEPLOY_PATH}
            '''
        }
      }
    }
  }
}