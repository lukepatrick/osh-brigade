const KOLLA_VERSION = "4.0.2"
const CONTAINER = "quay.io/charter-os/kolla-brigade:" + KOLLA_VERSION

const { events, Job } = require("brigadier")

events.on("exec", (e, p) => {

  // env info
  console.log("==> Project " + p.name + " clones the repo at " + p.repo.cloneURL)
  console.log("==> Event " + e.type + " caused by " + e.provider)

  // create job with name and container image to use
  var kb_start_job = new Job("kb-job-start", CONTAINER) // runs start job
  var kb_push_job = new Job("kb-job-push", CONTAINER) // following start job finish, run a push job
  var kb_deploy_job = new Job("kb-job-deploy", "ubuntu-with-demozip-dir:v1") // following the push job, run a deployment job

  // allow docker socket
  kb_start_job.docker.enabled = true
  kb_push_job.docker.enabled = true
  kb_deploy_job.docker.enabled = true

  // for long-running jobs like Nova
  kb_start_job.timeout = 7200000
  kb_deploy_job.timeout = 3600000

  //set up tasks
  kb_start_job.tasks = [] //init empty tasks
  kb_push_job.tasks = []
  kb_deploy_job.tasks = []

  kb_start_job.tasks.push("source /src/start.sh") // add first task - build kolla container

  //kb_push_job.tasks.push("source /src/push.sh") // add next task - push image to registry

  kb_deploy_job.tasks.push(
    "cd /opt/demo",
    // TODO: update with new image tags in values.yaml for KOLLA_PROJECT before deploying
    "bash /opt/demo/cluster-deploy.sh "
    // Run rally tests on the cluster
    "helm test keystone"
    "helm test glance"
    "helm test nova"
    "helm test neutron"
    "helm test heat"
  ) // add next task - deploy cluster


  // TODO: Clean up created containers
  //kb_job.tasks.push("./src/cleanup.sh") // add final task - clean up image

  //set up ENV
  kb_start_job.env = kb_push_job.env = kb_deploy_job.env = {
    "KOLLA_BASE": "ubuntu",
    "KOLLA_TYPE": "source",
    "KOLLA_TAG": "4.0.2-kb",
    "KOLLA_PROJECT": "keystone",
    "KOLLA_NAMESPACE": "charter-os",
    "KOLLA_VERSION": KOLLA_VERSION,
    "DOCKER_USER": p.secrets.docker_user,
    "DOCKER_PASS": p.secrets.docker_pass,
    "DOCKER_REGISTRY": "quay.io",
    "REPO_BASE": "https://github.com/openstack",
    "PROJECT_REFERENCE": "stable/ocata",
    "PROJECT_GIT_COMMIT": "e1a94f39edb6cf777c71c7a511476b1e60436ab9",
    "RELEASE": "stable-ocata"
  }


  console.log("==> Set up tasks, env, Job ")
  //debug only
  //console.log(kb_start_job)
  //console.log(kb_push_job)
  //console.log(kb_deploy_job)

  console.log("==> Running Start Job")

  // run Start Job, get Promise and print results
  kb_start_job.run().then( resultStart => {
    //debug only
    //console.log("==> Start Job Results")
    //console.log(resultStart.toString())
    console.log("==> Start Job Done")
    console.log("==> Running Push Job")
    // After start job finished, run push job
    kb_push_job.run().then( resultPush => {
      //debug only
      //console.log("==> Push Job Results")
      console.log(resultPush.toString())
      console.log("==> Push Job Done")
      console.log("==> Running Deploy Job")
      kb_deploy_job.run().then( resultDeploy => {
        //debug only
        //console.log("==> Deploy Job Results")
        console.log(resultDeploy.toString())
        console.log("==> Deploy Job Done")
      })
    })
  })



})