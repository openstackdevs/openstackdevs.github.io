---
title: "Production-Grade OpenStack Deployment: A Practical Guide"
description: "Lessons learned from deploying OpenStack at scale in enterprise environments"
date: 2025-02-14T10:00:00+03:00
draft: false
categories: ["OpenStack", "Deployment"]
tags: ["openstack", "devops", "infrastructure", "best-practices", "kolla-ansible"]
series: ["OpenStack Production Series"]
author: "OpenStack Devs"
weight: 1
---

Deploying OpenStack in production requires careful planning and the right tooling. After running production clouds for years, here's what works.

## Choosing Your Deployment Tool

For new deployments, **Kolla-Ansible** is the recommended choice:

- Containerized services for consistency
- Active maintenance and community support
- Rolling upgrade capability
- Integrated with OpenStack components

```bash
# Clone Kolla-Ansible
git clone https://opendev.org/openstack/kolla-ansible.git
cd kolla-ansible

# Install dependencies
pip install -r requirements.txt
pip install -r test-requirements.txt

# Generate passwords
tools/kolla-ansible-genpwd
```

## Network Architecture

Production deployments should use **VXLAN** for tenant networks:

```ini
# /etc/kolla/neutron-server.conf
[ml2]
type_drivers = flat,vlan,vxlan
tenant_network_types = vxlan
mechanism_drivers = ovn,linuxbridge,l2population
extension_drivers = port_security,qos,dns

[ml2_type_vxlan]
vni_ranges = 1:1000
```

## Storage Considerations

Ceph RBD is the standard for production:

```yaml
# /etc/kolla/glance.conf
[glance_store]
default_store = rbd
stores = rbd,http

[rbd_store]
rbd_store_pool = images
rbd_store_user = glance
rbd_store_chunk_size = 8
```

## Monitoring Essentials

Deploy Prometheus + Grafana from day one:

- **Ceilometer** for metering data
- **Prometheus exporters** on all controllers
- **Grafana dashboards** for operations teams

## Next Up

In the next post, we'll cover Ceph performance tuning for OpenStack workloads.

---

*Part 1 of the OpenStack Production Series*
