---
title: Hashing vs Encryption vs Encoding
summary: Three terms that beginners mix up constantly. Learn what each one does, when to use it, and how to tell them apart at a glance.
type: blog
path: crypto
level: Beginner
date: 2026-10-01
tags: [hashing, encryption, encoding, cryptography]
---
"The passwords were encrypted with Base64." If that sentence makes you wince, you're in the right place. Hashing, encryption and encoding all transform data, but they have completely different purposes.

## Encoding: changing the format

Encoding converts data into another format so systems can handle it. **It provides no security.** Anyone can reverse it, no key needed.

```
Text:    hello
Base64:  aGVsbG8=
Hex:     68656c6c6f
```

Used for: sending binary data in emails, URLs (`%20` for a space), embedding images in web pages.

## Encryption: keeping secrets

Encryption scrambles data with a **key**. Only someone with the right key can reverse it. It is **two-way** by design.

- **Symmetric** encryption uses one shared key for both locking and unlocking (e.g. **AES**). Fast, used for files and disks.
- **Asymmetric** encryption uses a key pair: a public key to encrypt and a private key to decrypt (e.g. **RSA**, elliptic-curve cryptography). Used for HTTPS, email signing and key exchange.

Used for: HTTPS, Wi-Fi (WPA2/WPA3), disk encryption, messaging apps.

## Hashing: proving integrity

A hash function turns any input into a fixed-length fingerprint. It is **one-way**: you cannot turn the hash back into the original.

```
SHA-256("hello")  = 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
SHA-256("hello!") = ce06092fb948d9ffac7d1a376e404b26b7575bcc11ee05a4615fef4fec3a308b
```

One character changed and the whole hash changed. That's called the **avalanche effect**.

Used for: storing passwords, checking file downloads haven't been tampered with, digital signatures.

> Passwords should be **hashed** with a slow, salted algorithm such as bcrypt, scrypt or Argon2. Never encoded, and never stored with fast hashes like MD5 or plain SHA-1.

## Quick comparison

| | Encoding | Encryption | Hashing |
|---|---|---|---|
| Purpose | Format | Confidentiality | Integrity |
| Reversible? | Yes, by anyone | Yes, with the key | No |
| Needs a key? | No | Yes | No |
| Example | Base64 | AES, RSA | SHA-256, bcrypt |

## How to spot them

- Ends in `=` or `==`, letters and numbers only? Probably **Base64**.
- Exactly 32 hex characters? Likely **MD5**. 64 hex characters? Likely **SHA-256**.
- Starts with `$2b$`? A **bcrypt** password hash.

## Exercises

**1.** A developer says, "Our passwords are safe, they're Base64-encoded." What's wrong with this?

<details><summary>Show answer</summary>Base64 is encoding, not security. Anyone can decode it instantly. Passwords should be hashed with bcrypt, scrypt or Argon2.</details>

**2.** Decode this Base64 string: `Y3liZXI=`

<details><summary>Show answer</summary>"cyber". On Linux or macOS: echo Y3liZXI= | base64 -d</details>

**3.** You download a Linux ISO and the website lists its SHA-256 value. Why, and what do you do with it?

<details><summary>Show answer</summary>To verify integrity. Run sha256sum (Linux), shasum -a 256 (macOS) or Get-FileHash (Windows PowerShell) on the file and compare. A different value means the file is corrupted or tampered with.</details>

**4.** Which type of encryption lets a stranger send you a secret message without first sharing a key?

<details><summary>Show answer</summary>Asymmetric encryption. They encrypt with your public key and only your private key can decrypt it.</details>

**5.** Identify each: (a) `5d41402abc4b2a76b9719d911017c592` (b) `$2b$12$KIX...` (c) `SGVsbG8gV29ybGQ=`

<details><summary>Show answer</summary>(a) MD5 hash, 32 hex characters (it's MD5 of "hello"). (b) bcrypt hash. (c) Base64 encoding of "Hello World".</details>
