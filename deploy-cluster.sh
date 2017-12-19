#!/bin/bash

#helm_ver - helm version
#host_cidr - host subnet cidr
#multinode - is it multinode deployment or not
#release - openstack release version

echo "Usage: "
echo "helm_vir=<helm_version> host_cidr=<host_subnet_cidr> multinode=<true/false> release=<openstack_release_version> ./deploy-cluster.sh"
echo "Ex: ./deploy-cluster.sh host_cidr='44.128.124.0/22' helm_ver=v2.6.2 multinode=false release=newton

# Example 
# $ host_cidr='44.128.124.0/22' helm_ver=v2.6.2 multinode=false release=newton ./deploy-cluster.sh

host_cidr=${host_cidr:-'44.128.124.0/22'}
helm_ver=${helm_ver:-v2.6.2}
multinode=${multinode:-false}
release=${release:=newton}


#switch to demo directory
cd /opt/demo

ERROR='echo "step-1 execution failed." ; exit 1;'

# Edit environment variables
sed -i "s/\(export HELM_VERSION=\)\(.*\)/\1$helm_ver/" .bootkube_env
sed -i "s#\(export HOST_SUB_CIDR=\)\(.*\)#\1$host_cidr#" .bootkube_env

#Run steps and exit if there is an error

echo "*********************executing step-1 *********************"

./01-bootkube-gen-up || { echo "step-1 execution failed." ; exit 1; }


echo "*********************executing step-2 *********************"
./02-bootkube-addons  || { echo "step-2 execution failed." ; exit 1; }


if [ "$multinode" == "true" ] ; then
    echo "*********************executing step-3*********************"
    ./03-bootkube-node-add || { echo "step-3 execution failed." ; exit 1; }
fi

echo "*********************executing step-4 *********************"
./04-helm-up || { echo "step-4 execution failed." ; exit 1; }

echo "*********************executing step-5 *********************"
./05-osh-repo-prep || { echo "step-5 execution failed." ; exit 1; }

echo "*********************executing step-6 *********************"
./06-storage-up || { echo "step-6 execution failed." ; exit 1; }

echo "*********************executing step-7 *********************"
./07-infrastructure-up || { echo "step-7 execution failed."  ; exit 1; }

echo "*********************executing step-8 *********************"
./08-armada-up || { echo "step-8 execution failed." ; exit 1; }

echo "*********************executing step-9 *********************"
./09-armada-launch-monitoring || { echo "step-9 execution failed." ; exit 1; }

if [ "$release" == "newton" ] ; then
    echo "*********************executing step-10*********************"
    ./10-armada-launch-newton || { echo "step-10 execution failed."  ; exit 1; }

    echo "*********************executing step-11*********************"
    ./11-boot-vm-newton || { echo "step-11 execution failed." ; exit 1; }

elif [ "$release" == "ocata" ] ; then
    echo "*********************executing step-12*********************"
    ./12-armada-launch-ocata || { echo "step-12 execution failed." ; exit 1; }
fi

echo "*********************executing step-13 *********************"
./13-post-upgrade || { echo "step-13 execution failed." ; exit 1; }

echo "*********************executing step-14 *********************"
./14-container-registry || { echo "step-14 execution failed." ; exit 1; }


echo "************************** Successful*********************************"
