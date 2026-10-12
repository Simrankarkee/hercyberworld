---
title: The OSI Model, Layer by Layer
summary: The seven layers of networking, what lives at each one, and which attacks target them.
type: slides
path: network
level: Beginner
date: 2026-10-08
tags: [osi, networking, layers]
starter: true
---
# The OSI Model

How data travels from your app to the wire, and back

---

## Why learn it?

- Every network tool, log and attack maps to a **layer**
- It gives you a shared language with other engineers
- Troubleshooting becomes: *which layer is broken?*

---

## The 7 layers (top → bottom)

7. **Application** — HTTP, DNS, SMTP
6. **Presentation** — encryption, encoding (TLS, JPEG)
5. **Session** — keeping conversations open
4. **Transport** — TCP / UDP, ports
3. **Network** — IP addresses, routing
2. **Data Link** — MAC addresses, switches
1. **Physical** — cables, Wi-Fi radio

---

## Memory trick

> **A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing

(Layer 7 down to Layer 1)

---

## Attacks by layer

- **L7:** SQL injection, phishing sites
- **L4:** SYN flood, port scanning
- **L3:** IP spoofing, ICMP floods
- **L2:** ARP spoofing, MAC flooding
- **L1:** cutting cables, Wi-Fi jamming

---

## Try it: see the layers

```
nslookup example.com   # L7 DNS
ping example.com       # L3 ICMP
arp -a                 # L2 MAC table
```

---

## Exercises

1. At which layer do IP addresses live?
2. ARP spoofing targets which layer?
3. HTTPS encryption is usually associated with which layer?

<details><summary>Show answers</summary>1: Layer 3, Network. 2: Layer 2, Data Link. 3: Layer 6, Presentation (TLS), though in practice TLS sits between the transport and application layers.</details>

---

## Key takeaway

Security is **defense in depth**: protect every layer, not just one.

Next up: TCP vs UDP
