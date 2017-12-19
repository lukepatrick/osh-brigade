FROM ubuntu:16.04

ARG USER
ARG PASS
ENV USER ${USER:-username}
ENV PASS ${PASS:-password}

RUN apt-get update && apt-get install -y \
    git \
    sudo \
    wget \
    sysvbanner \
    dialog \
    apt-utils \
    vim \
    systemd

RUN useradd -m -s /bin/bash ubuntu && \
    echo "ubuntu ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

RUN git clone https://${USER}:${PASS}@github.com/v1k0d3n/demo /opt/demo && \
    chmod 777 /opt/demo

COPY deploy-cluster.sh /opt/demo/deploy-cluster.sh

WORKDIR /opt/demo
USER ubuntu