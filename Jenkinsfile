#!groovy
@Library('autoalert')
import com.autoalert.CloudFrontBuild
import com.autoalert.JenkinsNotification

def cfBuild

node {
  try {
    ws(getWorkspaceDir()) {
      stage ('SCM Checkout') {
        checkout scm
      }

      stage ('Configure') {
        def config = readYaml file:'Jenkinsfile.yaml'
        cfBuild = new CloudFrontBuild(this, config, env.BRANCH_NAME, env.BUILD_NUMBER, env.WORKSPACE, env.JOB_NAME)
      }

      stage ('Build') {
        cfBuild.build()
      }

      stage ('Copy Artifacts') {
        cfBuild.copyArtifacts()
      }
    }

    currentBuild.result = "SUCCESS"
  }
  catch (Exception ex) {
    currentBuild.result = "FAILURE"
    throw ex
  }
  finally {
    def notification = new JenkinsNotification(currentBuild, this)
    notification.Notify()
  }
}

def getWorkspaceDir() {
  return "C:\\AutoAlert\\workspace\\" + env.JOB_NAME.replace('/', '_')
}

timeout (15) {
  milestone()
  if (!cfBuild.autoDeploy) {
    input message: "Deploy to " + cfBuild.srcTargetEnvironment + "?", ok: "Deploy!"
  }

  milestone()
}

node {
  try {
    ws(cfBuild.workspaceDir) {
      stage ('Deploy Artifacts') {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: "Jenkins AWS"]]) {
          cfBuild.deployArtifacts()
        }
      }
    }

    currentBuild.result = "SUCCESS"
  }
  catch (Exception ex) {
    currentBuild.result = "FAILURE"
    throw ex
  }
  finally {
    def notification = new JenkinsNotification(currentBuild, this)
    notification.SetBuildAction("deploy")
    notification.SetBuildChannel(cfBuild.deployChannel)
    notification.Notify()
  }
}

