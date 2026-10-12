---
title: The CIA Triad, Explained Like You're New Here
summary: Confidentiality, Integrity and Availability, the three ideas every part of cybersecurity is built on.
type: blog
path: fundamentals
level: Beginner
date: 2026-10-10
tags: [cia triad, basics, security principles]
starter: true
---
When I started learning cybersecurity, every course opened with three letters: **CIA**. Not the agency. The *triad*. Once it clicked, everything else made more sense, so let's start here.

## C is for Confidentiality

Only the right people can see the data.

- Your bank balance should be visible to you, not your neighbour.
- Tools that protect it: **encryption**, passwords, **access control**, 2FA.

> Attack example: someone steals a database of passwords and leaks it online.

## I is for Integrity

The data is accurate and hasn't been secretly changed.

- If you send Rs. 500, nobody should be able to turn it into Rs. 50,000 on the way.
- Tools that protect it: **hashing** (like `SHA-256`), digital signatures, version control.

> Attack example: malware quietly edits the account number on an invoice.

## A is for Availability

The system works when people need it.

- Exam results websites should load on results day.
- Tools that protect it: backups, redundancy, **DDoS protection**.

> Attack example: ransomware locks every file in a hospital.

## Quick cheat sheet

| Pillar | Question it asks | Example control |
|---|---|---|
| Confidentiality | Who can see it? | Encryption |
| Integrity | Can I trust it? | Hashing |
| Availability | Can I reach it? | Backups |

## Try it yourself

Pick any app you use daily (WhatsApp, a wallet app, Instagram) and ask: *how does it protect each pillar?* Write your answers down. That's your first threat model!

## Exercises

**1.** Ransomware encrypts a hospital's patient records so staff can't open them. Which pillar is mainly affected?

<details><summary>Show answer</summary>Availability. The data still exists but can't be used. If the attackers also leak the records, confidentiality is affected too.</details>

**2.** An attacker changes the amount on a payment request from Rs. 500 to Rs. 50,000. Which pillar is broken?

<details><summary>Show answer</summary>Integrity. The data was altered without authorisation.</details>

**3.** Match each control to a pillar: backups, encryption, hashing.

<details><summary>Show answer</summary>Backups → Availability. Encryption → Confidentiality. Hashing → Integrity.</details>
