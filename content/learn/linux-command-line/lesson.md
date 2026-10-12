---
title: Linux Command Line for Security Beginners
summary: The fifteen commands you will use in almost every lab, CTF and security job, with practice tasks.
type: slides
path: linux
level: Beginner
date: 2026-10-05
tags: [linux, terminal, bash, commands]
---
# Linux Command Line

The essential toolkit for security work

---

## Why Linux?

- Most servers on the internet run Linux
- Security tools (Nmap, Wireshark, Burp, Metasploit) run best on it
- Distributions like **Kali** and **Parrot** are built for security testing
- CTFs and labs expect you to be comfortable in a terminal

---

## Moving around

| Command | What it does |
|---|---|
| `pwd` | Print the current directory |
| `ls -la` | List all files, including hidden ones |
| `cd /etc` | Change directory |
| `cd ..` | Go up one level |
| `cd ~` | Go to your home folder |

---

## Reading files

| Command | What it does |
|---|---|
| `cat file.txt` | Print the whole file |
| `less file.txt` | Scroll through a long file (q to quit) |
| `head -n 20 file` | First 20 lines |
| `tail -f /var/log/auth.log` | Watch a log update live |

---

## Finding things

```
find / -name "*.conf" 2>/dev/null
grep -i "failed password" /var/log/auth.log
grep -r "password" /var/www/
```

`grep` searches inside files. `find` searches for files. `2>/dev/null` hides "permission denied" errors.

---

## Users and processes

| Command | What it does |
|---|---|
| `whoami` | Which user am I? |
| `id` | My user ID and groups |
| `sudo command` | Run as administrator |
| `ps aux` | All running processes |
| `ss -tuln` | Listening ports |

---

## Pipes: combine commands

```
cat /var/log/auth.log | grep "Failed" | wc -l
```

Count how many failed logins appear in the log. The `|` sends one command's output into the next.

---

## Exercises

1. Show the hidden files in your home folder.
2. Find every file ending in `.log` under `/var/log`.
3. Count the lines in `/etc/passwd`. What does that number tell you?

<details><summary>Show answers</summary>1: cd ~ then ls -la. 2: find /var/log -name "*.log" 2>/dev/null. 3: wc -l /etc/passwd. Each line is one account, including system accounts.</details>

---

## Practise safely

- **OverTheWire Bandit**: a free game that teaches Linux through levels
- **TryHackMe** "Linux Fundamentals" rooms
- A free virtual machine with VirtualBox and Ubuntu or Kali

Next lesson: Linux file permissions
