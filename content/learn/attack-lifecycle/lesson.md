---
title: How Cyberattacks Unfold, Step by Step
summary: The Cyber Kill Chain explained with a real-world style example, and where defenders can break each link.
type: slides
path: fundamentals
level: Beginner
date: 2026-09-20
tags: [kill chain, attack lifecycle, threat modelling]
---
# The Cyber Kill Chain

How attacks unfold, and where to stop them

---

## Why study attacker steps?

- Attacks are a **sequence**, not one moment
- Breaking **any** link can stop the attack
- Developed by Lockheed Martin; widely used in security operations

---

## The 7 stages

1. **Reconnaissance**: research the target
2. **Weaponisation**: prepare the malware or exploit
3. **Delivery**: send it (email, USB, website)
4. **Exploitation**: the code runs
5. **Installation**: malware gains a foothold
6. **Command & Control (C2)**: attacker connects remotely
7. **Actions on Objectives**: steal, encrypt or destroy data

---

## Example: a ransomware attack

1. Attacker finds staff emails on LinkedIn
2. Builds a malicious Word document
3. Emails it as a fake "invoice"
4. Employee enables macros, so the code runs
5. Malware installs itself to survive reboots
6. Connects back to the attacker's server
7. Encrypts the file servers and demands payment

---

## Where defenders break the chain

| Stage | Defence |
|---|---|
| Reconnaissance | Limit public info about staff and systems |
| Delivery | Email filtering, awareness training |
| Exploitation | Patching, macros disabled by default |
| Installation | Endpoint protection (EDR) |
| C2 | Firewall and DNS filtering |
| Actions | Backups, network segmentation |

---

## Exercises

1. An attacker scans a company website and staff social profiles. Which stage?
2. Which stage do phishing-awareness programmes mainly target?
3. Name one control that still limits damage if every earlier stage succeeds.

<details><summary>Show answers</summary>1: Reconnaissance. 2: Delivery (and exploitation, by stopping people opening attachments). 3: Offline backups or network segmentation.</details>

---

## Go further

- **MITRE ATT&CK**: a detailed, free knowledge base of real attacker techniques
- Map a recent breach news story to the 7 stages as practice
