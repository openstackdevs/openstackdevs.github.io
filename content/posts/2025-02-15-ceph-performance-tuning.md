---
title: "Ceph Performance Tuning for OpenStack Workloads"
description: "Optimizing Ceph storage for OpenStack Nova, Glance, and Cinder"
date: 2025-02-15T10:00:00+03:00
draft: false
categories: ["Ceph", "Performance", "OpenStack"]
tags: ["ceph", "storage", "performance", "optimization", "openstack"]
series: ["OpenStack Production Series"]
author: "OpenStack Devs"
weight: 2
---

Ceph performance directly impacts OpenStack VM performance. Here's how to optimize it.

## Bluestore Optimizations

Modern Ceph uses Bluestore by default. Tune these settings:

```ini
[osd]
osd_memory_target = 4G
osd_object_size = 1G
osd_max_backfills = 1
osd_recovery_max_active = 3

[osd.memory_target]
# Adjust based on your RAM
```

## PG Calculations

Placement groups need calculation based on your OSD count:

```bash
# Formula: (OSDs * 100) / replication_ratio
# For 100 OSDs with 3x replication: (100 * 100) / 3 ≈ 3333 PGs per pool

ceph osd pool set vms pg_num 3333
ceph osd pool set vms pgp_num 3333
```

## CRUSH Map Tuning

Separate SSD OSDs for journals:

```crush
root default {
    id -1
    alg straw2
    item hdd_ssd weight 2.00
}
```

## Client-Side Caching for OpenStack

Configure RBD cache in Cinder:

```ini
[rbd_client]
rbd_cache = true
rbd_cache_writethrough_until_flush = true
rbd_cache_max_dirty = 1073741824
```

## Monitoring Ceph

Key metrics to watch:

- OSD latency (p99 < 30ms for SSD)
- Recovery state (should be active+clean)
- PG states (avoid degraded states)
- Client IOPS and throughput

---

*Part 2 of the OpenStack Production Series*
