---
title: "Running Kubernetes on OpenStack with Magnum"
description: "Container Orchestration Engine management with OpenStack Magnum"
date: 2025-02-16T10:00:00+03:00
draft: false
categories: ["Magnum", "Kubernetes", "OpenStack"]
tags: ["magnum", "kubernetes", "coe", "containers", "openstack"]
series: ["Container Infrastructure"]
author: "OpenStack Devs"
weight: 1
---

Magnum provides a Container Orchestration Engine (COE) management service for OpenStack. Here's how to run production K8s clusters.

## Magnum Architecture

```
┌─────────────────────────────────────────┐
│           Magnum API                    │
├─────────────────────────────────────────┤
│           Heat (Orchestration)         │
├─────────────────────────────────────────┤
│    Nova │ Cinder │ Neutron │ Octavia   │
└─────────────────────────────────────────┘
```

## Installing Magnum

```bash
# Install Magnum controller
apt install magnum-api magnum-conductor

# Configure in /etc/magnum/magnum.conf
[api]
host = 0.0.0.0
port = 9511

[database]
connection = mysql+pymysql://magnum:password@controller/magnum
```

## Creating a Cluster Template

```bash
openstack coe cluster template create k8s-template \
  --coe kubernetes \
  --image fedora-coreos-38 \
  --external-network public \
  --dns-nameserver 8.8.8.8 \
  --master-flavor m1.large \
  --flavor m1.medium \
  --volume-driver cinder \
  --network-driver flannel \
  --docker-volume-size 50
```

## Launching a Kubernetes Cluster

```bash
openstack coe cluster create production-k8s \
  --cluster-template k8s-template \
  --master-count 3 \
  --node-count 5 \
  --keypair my-key
```

## Accessing the Cluster

```bash
# Get kubeconfig
openstack coe cluster config production-k8s > kubeconfig
export KUBECONFIG=kubeconfig

# Verify
kubectl get nodes
```

## Storage Integration

Use the **Cinder CSI driver** for persistent volumes:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/cloud-provider-openstack/master/manifests/cinder-csi-plugin/cinder-csi-controllerplugin.yaml
```

## Load Balancing with Octavia

Magnum integrates with Octavia for Kubernetes Services:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  type: LoadBalancer
  selector:
    app: web
  ports:
  - port: 80
```

---

*Part 1 of the Container Infrastructure series*
