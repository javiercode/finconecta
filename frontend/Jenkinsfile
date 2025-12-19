pipeline {
    environment {
            imagename = "bancoganadero/micliente"
            registryCredential = 'docker_hub'
            dockerImage = ''
    }

    agent {
        node {
            label 'linux-builder'
        }
    }

    options {
        buildDiscarder logRotator(
                    daysToKeepStr: '16',
                    numToKeepStr: '10'
            )
    }

    stages {

        stage('Cleanup Workspace') {
            steps {
                cleanWs()
                sh """
                echo "Cleaned Up Workspace For Project"
                """
            }
        }

        stage('Code Checkout') {
            steps {
             script{
                checkout([$class: 'GitSCM', branches: [[name: '${BRANCH_NAME}']],
                         userRemoteConfigs: [[credentialsId: 'gitlab',
                         url: 'git@gitlab.bg.com.bo:desarrollo/bga/app-web/micliente.git']]])
                }
             }
        }

        stage('Building image') {
            steps{
                script {
                    dockerImage = docker.build("$imagename:${BUILD_ID}.${BUILD_TIMESTAMP_SHORT}.${BRANCH_NAME}")
                }
            }
        }

        stage('Push Image') {
            steps{
                script {
                    docker.withRegistry( '', registryCredential ) {
                        dockerImage.push()
                        dockerImage.push('latest')
                    }
                }
            }
        }

        stage('Remove Unused docker image') {
            steps{
                sh "docker rmi $imagename:${BUILD_ID}.${BUILD_TIMESTAMP_SHORT}.${BRANCH_NAME}"
                sh "docker rmi $imagename:latest"
            }
        }

        stage('Variable replace') {
             when {
                        expression { BRANCH_NAME ==~ /(master|staging|develop)/ }
             }
             steps{
                script {
                    contentReplace(
                        configs: [
                            variablesReplaceConfig(
                                configs: [
                                    variablesReplaceItemConfig(
                                        name: 'ServiceCfgmap',
                                        value: 'wp-micliente-cfgmap'
                                    ),
                                    variablesReplaceItemConfig(
                                        name: 'Namespace',
                                        value: 'wp'
                                    ),
                                    variablesReplaceItemConfig(
                                        name: 'REACT_APP_API_BACKEND',
                                        value: 'https://apis.dev.bg.com.bo/micliente/api/v3'
                                    ),
                                    variablesReplaceItemConfig(
                                        name: 'REACT_APP_PATH',
                                        value: 'micliente'
                                    ),
                                    variablesReplaceItemConfig(
                                        name: 'REACT_APP_KEY',
                                        value: 'yzR64p2_MMHOrpSbZaoAIzaSyBqcIlr5p3rDL3o'
                                    )
                                ],
                                fileEncoding: 'UTF-8',
                                filePath: './k8s/configmap.yml',
                                variablesPrefix: '{{',
                                variablesSuffix: '}}'
                        )]
                    )
                }
                script {
                    contentReplace(
                        configs: [
                            variablesReplaceConfig(
                                configs: [
                                    variablesReplaceItemConfig(
                                        name: 'ServiceCfgmap',
                                        value: 'wp-micliente-cfgmap'
                                    ),
                                    variablesReplaceItemConfig(
                                        name: 'Namespace',
                                        value: 'wp'
                                    ),
                                    variablesReplaceItemConfig(
                                        name: 'ServiceName',
                                        value: 'wp-micliente'
                                    ),
                                    variablesReplaceItemConfig(
                                        name: 'BaseImage',
                                        value: 'bancoganadero/micliente:${BUILD_ID}.${BUILD_TIMESTAMP_SHORT}.${BRANCH_NAME}'
                                    ),
                                    variablesReplaceItemConfig(
                                        name: 'ContainerPort',
                                        value: '80'
                                    ),
                                    variablesReplaceItemConfig(
                                        name: 'Port',
                                        value: '80'
                                    )

                                ],
                                fileEncoding: 'UTF-8',
                                filePath: './k8s/deployment.yml',
                                variablesPrefix: '{{',
                                variablesSuffix: '}}'
                        )]
                    )
                }
                script {
                    contentReplace(
                        configs: [
                            variablesReplaceConfig(
                                configs: [
                                    variablesReplaceItemConfig(
                                        name: 'Namespace',
                                        value: 'wp'
                                    )

                                ],
                                fileEncoding: 'UTF-8',
                                filePath: './k8s/namespace.yml',
                                variablesPrefix: '{{',
                                variablesSuffix: '}}'
                        )]
                    )
                }
             }
        }


        stage('Build Deploy Code DEV') {
            when {
                branch 'develop'
            }
            steps {
              script{
                kubernetesDeploy (configs: '**/k8s/*.yml',kubeconfigId: 'kubeconfigdev')
              }
            }
        }

        stage('Build Deploy Code STG') {
            when {
                branch 'staging'
            }
            steps {
              script{
                kubernetesDeploy (configs: '**/k8s/*.yml',kubeconfigId: 'kubeconfigtest')
              }
            }
        }

        stage('Build Deploy Code PRD') {
            when {
                branch 'master'
            }
            steps {
              script{
                kubernetesDeploy (configs: '**/k8s/*.yml',kubeconfigId: 'kubeconfigprod')
              }
            }
        }
    }
}
