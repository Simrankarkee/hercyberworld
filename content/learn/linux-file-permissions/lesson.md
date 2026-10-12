---
title: Linux File Permissions, Decoded
summary: Read rwxr-x--- like a pro, understand chmod numbers, and see why misconfigured permissions lead to privilege escalation.
type: blog
path: linux
level: Beginner
date: 2026-10-03
tags: [linux, permissions, chmod, privilege escalation]
---
Run `ls -l` on a Linux system and you'll see lines like this:

```
-rwxr-x--- 1 simran staff 2048 Oct 3 10:15 backup.sh
```

That string at the start controls **who can do what** with the file. Misreading it is one of the most common causes of security holes on Linux servers.

## Breaking it down

```
-  rwx  r-x  ---
│   │    │    └── Others (everyone else)
│   │    └─────── Group (staff)
│   └──────────── Owner (simran)
└──────────────── File type (- file, d directory, l link)
```

| Letter | On a file | On a directory |
|---|---|---|
| `r` read | View contents | List files inside |
| `w` write | Change contents | Create or delete files inside |
| `x` execute | Run as a program | Enter the directory (`cd`) |

So `-rwxr-x---` means: the owner can read, write and run it; the group can read and run it; everyone else has no access.

## The number system

Each permission has a value: **r = 4, w = 2, x = 1**. Add them for each group.

| Permissions | Calculation | Number |
|---|---|---|
| `rwx` | 4+2+1 | 7 |
| `r-x` | 4+0+1 | 5 |
| `r--` | 4+0+0 | 4 |
| `---` | 0 | 0 |

`-rwxr-x---` = **750**.

Change permissions with `chmod`:

```
chmod 750 backup.sh     # owner rwx, group r-x, others none
chmod 600 id_rsa        # private keys: owner read/write only
chmod o-w report.txt    # remove write access for others
```

## Why this matters for security

- **World-writable files** (`chmod 777`) let any user modify them. If root runs that script, any user can make root run their code.
- **SSH private keys** must be `600`, or SSH refuses to use them.
- **SUID binaries** (an `s` instead of `x`, like `-rwsr-xr-x`) run with the owner's privileges. A SUID program owned by root that can be abused is a classic privilege-escalation path.

Find world-writable files and SUID binaries during an audit:

```
find / -type f -perm -o+w 2>/dev/null
find / -perm -4000 -type f 2>/dev/null
```

> Rule of thumb: grant the least permission needed. This is the principle of least privilege.

## Exercises

**1.** What number represents `rw-r--r--`?

<details><summary>Show answer</summary>644. Owner rw (4+2=6), group r (4), others r (4). This is the standard for ordinary files.</details>

**2.** Write `chmod 700` as letters.

<details><summary>Show answer</summary>rwx------. Only the owner can read, write and execute.</details>

**3.** A script `/opt/cleanup.sh` is run by root every hour and has permissions `-rwxrwxrwx`. What could an attacker with a normal account do?

<details><summary>Show answer</summary>Edit the script to add their own commands. Root would run them within the hour, giving the attacker full control. Fix it with chmod 700 and chown root:root.</details>

**4.** What does the `s` mean in `-rwsr-xr-x root root /usr/bin/passwd`?

<details><summary>Show answer</summary>SUID. The program runs with the owner's (root's) privileges. passwd needs this so normal users can update their own password in a root-owned file.</details>

**5. Try it yourself:** Create a file with `touch test.txt`, check it with `ls -l`, then try `chmod 600`, `chmod 755` and `chmod 000`. Can you still `cat` it after 000?

<details><summary>Show hint</summary>After chmod 000 you'll get "Permission denied" as a normal user, even though you own the file. Root can still read it.</details>
