---
title: TCP vs UDP and the Ports You Must Know
summary: How the two main transport protocols differ, what a port is, and the twelve port numbers every security learner should recognise.
type: blog
path: network
level: Beginner
date: 2026-10-07
tags: [tcp, udp, ports, networking]
---
Every time your browser loads a page or your phone sends a message, data travels using one of two transport protocols: **TCP** or **UDP**. Knowing the difference, and knowing which services live on which ports, is essential for reading firewall rules, scan results and logs.

## TCP: reliable and ordered

TCP (Transmission Control Protocol) sets up a connection before sending data, using the **three-way handshake**:

1. Client sends **SYN** ("I'd like to talk")
2. Server replies **SYN-ACK** ("Sure, I'm listening")
3. Client sends **ACK** ("Great, starting now")

TCP numbers every packet, resends anything lost and delivers data in order. That makes it ideal for web pages, email and file transfers, where every byte matters.

## UDP: fast and connectionless

UDP (User Datagram Protocol) just sends packets with no handshake and no delivery guarantee. It is faster and lighter, which suits video calls, online games, streaming and DNS lookups, where a dropped packet is better than a delay.

| | TCP | UDP |
|---|---|---|
| Connection | Handshake first | None |
| Reliability | Retransmits lost data | No guarantees |
| Order | Guaranteed | Not guaranteed |
| Speed | Slower | Faster |
| Typical use | Web, email, SSH | DNS, VoIP, gaming |

## What is a port?

An IP address identifies a device. A **port** (0–65535) identifies a specific service on that device. Think of the IP address as a building and the port as the apartment number.

Ports 0–1023 are **well-known ports**, reserved for common services.

## The ports to memorise

| Port | Protocol | Service | Security note |
|---|---|---|---|
| 20/21 | TCP | FTP | Sends credentials in plain text |
| 22 | TCP | SSH | Secure remote login; common brute-force target |
| 23 | TCP | Telnet | Plain text; should be disabled |
| 25 | TCP | SMTP | Email sending; abused for spam |
| 53 | UDP/TCP | DNS | Name resolution; used in tunnelling attacks |
| 80 | TCP | HTTP | Unencrypted web traffic |
| 110 | TCP | POP3 | Email retrieval |
| 143 | TCP | IMAP | Email retrieval |
| 443 | TCP | HTTPS | Encrypted web traffic |
| 445 | TCP | SMB | Windows file sharing; exploited by WannaCry |
| 3306 | TCP | MySQL | Databases should never face the internet |
| 3389 | TCP | RDP | Remote Desktop; frequent ransomware entry point |

> Security mindset: every open port is a door. Close what you don't need, and protect what you keep open.

## Exercises

**1.** A video-calling app keeps working even when a few packets are lost. Which transport protocol is it most likely using, and why?

<details><summary>Show answer</summary>UDP. Real-time audio and video prefer speed over perfect delivery. Resending a lost packet would arrive too late to be useful.</details>

**2.** Put the TCP handshake in order: ACK, SYN, SYN-ACK.

<details><summary>Show answer</summary>SYN → SYN-ACK → ACK.</details>

**3.** A scan of a company server shows ports 22, 23, 80 and 443 open. Which one would you recommend closing first, and why?

<details><summary>Show answer</summary>Port 23 (Telnet). It sends usernames and passwords in plain text. SSH on port 22 does the same job securely.</details>

**4.** Which port is associated with the WannaCry ransomware outbreak?

<details><summary>Show answer</summary>Port 445 (SMB). WannaCry spread using the EternalBlue exploit against unpatched Windows SMB.</details>

**5. Try it yourself:** On Windows run `netstat -an`, or on macOS/Linux run `ss -tuln` (Linux) or `netstat -an` (macOS). Which ports is your own computer listening on? Look up any you don't recognise.

<details><summary>Show hint</summary>Look for lines marked LISTEN. Common results include 135/445 on Windows or 631 (printing) on Linux and macOS.</details>
