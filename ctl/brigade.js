const KUBECTL_VERSION = "1.6.4"
  /* 
    1.6.4,
    1.6,
    1.5.3,
    1.5,
    1.3.6,
    1.3,
    1.2.4,
    1.2,
    1
  */

const CONTAINER = "wernight/kubectl:" + KUBECTL_VERSION

const { events, Job } = require("brigadier")
const util = require('util')

events.on("exec", (e, p) => {

  // env info
  console.log("==> Project " + p.name + " clones the repo at " + p.repo.cloneURL)
  console.log("==> Event " + e.type + " caused by " + e.provider)

  // create job with name and container image to use
  var kubectl_job = new Job("kubectl-job", CONTAINER) // runs kubectl_job 
  kubectl_job.storage.enabled = false
  
  // allow docker socket
  kubectl_job.docker.enabled = true

  //set up tasks
  kubectl_job.tasks = [] //init empty tasks
 

  kubectl_job.tasks.push("ls /src") // add first task
  kubectl_job.tasks.push("kubectl get pods") 
  kubectl_job.tasks.push("kubectl get pods --all-namespaces")
  kubectl_job.tasks.push("kubectl delete glance-rally-test -n openstack")


  //set up ENV
  // kubectl_job.env = kubectl_job.env = {
  //   "KUBECTL_HOST": ""
  // }


  console.log("==> Set up tasks, env, Job ")
  //debug only
  //console.log(kubectl_job)

  console.log("==> Running kubectl_job Job")

  // run Start Job, get Promise and print results
  kubectl_job.run().then( resultStart => {
    //debug only
    console.log("==> Start Job Results")
    console.log(resultStart.toString())
    console.log("==> Start Job Done")
    })

})


events.on("error", (e) => {
    console.log("Error event " + util.inspect(e, false, null) )
    console.log("==> Event " + e.type + " caused by " + e.provider + " cause class" + e.cause + e.cause.reason)
})

events.on("after", (e) => {  
    console.log("After event fired " + util.inspect(e, false, null) )
})
