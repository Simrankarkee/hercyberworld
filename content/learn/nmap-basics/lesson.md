---
title: "Nmap Basics: Scanning Ethically"
summary: Learn the most-used network scanner, read its results, and practise on targets where scanning is allowed.
type: blog
path: ethical-hacking
level: Intermediate
date: 2026-09-23
tags: [nmap, scanning, reconnaissance, ethical hacking]
---
**Nmap** (Network Mapper) is the first tool most penetration testers run. It discovers which hosts are online, which ports are open, and what software is running behind them.

> **Legal first.** Scanning networks you don't own or have written permission to test can be illegal. Practise on your own home lab, on `scanme.nmap.org` (which the Nmap project provides for light test scans), or on platforms like TryHackMe and Hack The Box.

## Install

- **Linux:** `sudo apt install nmap`
- **macOS:** `brew install nmap`
- **Windows:** installer from nmap.org (includes the Zenmap GUI)
- **Kali Linux:** already installed

## Your first scans

```
nmap scanme.nmap.org              # top 1000 TCP ports
nmap -p 22,80,443 scanme.nmap.org # specific ports
nmap -p- 192.168.1.10             # all 65535 ports (your own lab)
nmap -sV scanme.nmap.org          # detect service versions
nmap -O 192.168.1.10              # guess the operating system (needs sudo)
nmap -sn 192.168.1.0/24           # find live hosts, no port scan
```

## Reading the output

Example output (yours may differ):

```
PORT     STATE    SERVICE  VERSION
22/tcp   open     ssh      OpenSSH 6.6.1p1 Ubuntu
80/tcp   open     http     Apache httpd 2.4.7
9929/tcp open     nping-echo
31337/tcp filtered Elite
```

| State | Meaning |
|---|---|
| **open** | A service is accepting connections |
| **closed** | Reachable, but nothing is listening |
| **filtered** | A firewall is blocking the probe; Nmap can't tell |

Version numbers matter. An old version (like the 2014-era Apache above) may have known vulnerabilities you can look up in the CVE database.

## Common scan types

| Flag | Name | Notes |
|---|---|---|
| `-sS` | SYN scan | Default with sudo. Fast, doesn't complete the handshake |
| `-sT` | Connect scan | Full handshake. Default without sudo |
| `-sU` | UDP scan | Slow but finds DNS, SNMP and others |
| `-A` | Aggressive | Version, OS, scripts and traceroute together |

Save results for your report: `nmap -sV -oN results.txt target`

## Defender's view

Defenders run Nmap too. Scanning your own network regularly shows you exactly what an attacker would see, so you can close unnecessary ports first.

## Exercises

**1.** What's the difference between a **closed** and a **filtered** port?

<details><summary>Show answer</summary>Closed: the host answered, but no service is listening. Filtered: something (usually a firewall) blocked the probe, so Nmap can't determine the state.</details>

**2.** Which command finds every live device on your home network `192.168.1.0/24` without port scanning?

<details><summary>Show answer</summary>nmap -sn 192.168.1.0/24</details>

**3.** Why is `-sV` important during an assessment?

<details><summary>Show answer</summary>It identifies the software and version on each port. Versions can be matched against known vulnerabilities (CVEs).</details>

**4.** A SYN scan is sometimes called a "half-open" scan. Why?

<details><summary>Show answer</summary>Nmap sends SYN, receives SYN-ACK, then sends RST instead of completing the handshake with ACK.</details>

**5. Lab:** Run `nmap -sV scanme.nmap.org`. List the open ports and the software versions you find.

<details><summary>Show hint</summary>You should see SSH on 22 and HTTP on 80, among others. Keep scans light; this host is shared by learners worldwide.</details>
