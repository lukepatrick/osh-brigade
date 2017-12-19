# KubectlBrigade


KubectlBrigade is a [Brigade](https://github.com/Azure/brigade) Project that utilizes  
[Kubectl](https://github.com/kubernetes/kubectl) [containers](https://hub.docker.com/r/wernight/kubectl/). 

## Prerequisites

1. Have a running [Kubernetes](https://kubernetes.io/docs/setup/) environment
2. Setup [Kubectl](https://github.com/kubernetes/kubectl)

## Install

### Set up Brigade

Follow the [quick-start guide](https://github.com/Azure/brigade#quickstart):

Install Brigade into your Kubernetes cluster is to install it using Kubectl.

```bash
$ helm repo add brigade https://azure.github.io/brigade
$ helm install -n brigade brigade/brigade
```

To manually run Brigade Projects the **brig** binary is required. Follow the
[Developers Guide](https://github.com/Azure/brigade/blob/master/docs/topics/developers.md)
to build the binary. Assuming Brigade is cloned and prerequisites met, simply run:
```bash
$ make brig
```
Test **brig** with `brig version`

### Install KubectlBrigade

Clone KubectlBrigade and change directory
```bash
$ git clone https://github.com/lukepatrick/KubectlBrigade
$ cd KubectlBrigade
```
Helm install KubectlBrigade
> note the name and namespace can be customized
```bash
$ helm install --name helmbrigade brigade/brigade-project -f helmbrigade.yaml
```


## Usage

Manually run the project. The project name is the same as the project value in
the *helmbrigade.yaml*
```bash
$ brig run lukepatrick/KubectlBrigade
```

If *brigade.js* is customized then running the Project will need to have source *brigade.js* overriden

Run with override:
```bash
$ brig run lukepatrick/KubectlBrigade -f brigade.js
```


## Contribute

PRs accepted.

## License

MIT
