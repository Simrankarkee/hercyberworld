---
title: Your First CTF, A Beginner's Guide
summary: What Capture the Flag competitions are, which beginner-friendly platforms to start with, and a method for solving challenges.
type: blog
path: ctf
level: Beginner
date: 2026-09-17
tags: [ctf, practice, picoctf, beginners]
---
**Capture the Flag (CTF)** competitions are security puzzles. You solve a challenge, find a hidden string called a **flag** (for example `picoCTF{s0me_t3xt}`), submit it, and earn points. They are the most fun, and most legal, way to build hacking skills.

## Types of CTF

- **Jeopardy style**: a board of challenges in categories, each worth points. Best for beginners.
- **Attack-Defence**: teams defend their own servers while attacking others. Advanced.

## Common categories

| Category | You'll practise |
|---|---|
| **Web** | Finding flaws in websites (SQLi, XSS, cookies) |
| **Crypto** | Breaking weak ciphers and encodings |
| **Forensics** | Analysing files, images, memory and network captures |
| **Reverse engineering** | Understanding compiled programs |
| **Pwn / binary exploitation** | Exploiting memory bugs |
| **OSINT** | Finding information from public sources |
| **Misc** | Everything else, often logic puzzles |

## Where to start

- **picoCTF**: made for students and beginners, with a permanent practice gym
- **OverTheWire Bandit**: learn Linux by playing through levels over SSH
- **TryHackMe**: guided rooms that explain as you go
- **CTFtime.org**: a calendar of upcoming competitions worldwide

## A method for any challenge

1. **Read everything.** The title and description usually contain hints.
2. **Identify the category** and what you're given (file, website, text).
3. **Inspect the basics**: `file`, `strings`, view page source, check cookies.
4. **Search** unfamiliar terms. Searching is a core skill, not cheating.
5. **Take notes** on what you tried, even when it fails.
6. **Read write-ups** after the event to learn other approaches.

## Starter toolkit

- **CyberChef** (in your browser): decode, decrypt and convert almost anything
- `strings`, `file`, `exiftool`, `binwalk` for files and images
- Browser developer tools for web challenges
- **Wireshark** for network captures

## Exercises

**1.** Decode this flag (hint: it's a very common encoding): `ZmxhZ3toZWxsb19jdGZ9`

<details><summary>Show answer</summary>flag{hello_ctf}. It's Base64. Use CyberChef's "From Base64" or echo ZmxhZ3toZWxsb19jdGZ9 | base64 -d</details>

**2.** This message uses ROT13. Decode it: `synt{ebg13_vf_rnfl}`

<details><summary>Show answer</summary>flag{rot13_is_easy}. ROT13 shifts each letter by 13. CyberChef has a ROT13 operation.</details>

**3.** You're given `image.jpg` and nothing else. Name three things you would check first.

<details><summary>Show answer</summary>Metadata with exiftool, readable text with strings, and hidden embedded files with binwalk. Also try opening it in an image editor and checking file properties.</details>

**4.** Which category would a challenge called "Find the city where this photo was taken" belong to?

<details><summary>Show answer</summary>OSINT (Open-Source Intelligence).</details>

**5. Challenge:** Create a picoCTF account and solve three challenges in the "General Skills" category. Share which ones you solved in the Connect discussion "CTF team-up".

<details><summary>Show hint</summary>Start with the lowest-point challenges. Many only require reading carefully and using basic terminal commands.</details>
