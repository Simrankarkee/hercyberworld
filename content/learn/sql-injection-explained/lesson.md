---
title: SQL Injection Explained (and How to Stop It)
summary: How attackers trick a database into running their commands, why it still happens, and the one coding habit that prevents it.
type: blog
path: web
level: Intermediate
date: 2026-09-29
tags: [sql injection, owasp, web, databases]
---
SQL injection (SQLi) has been around for more than 25 years and still appears in real breaches. It happens when an application puts user input **directly into a database query**, letting an attacker change what the query does.

## How a login query works

A simple login form might build this query:

```sql
SELECT * FROM users WHERE username = 'simran' AND password = 'secret123';
```

If the database finds a matching row, you're logged in.

## The vulnerable code

```python
# DON'T DO THIS
query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'"
```

The application trusts whatever the user types.

## The attack

An attacker types this into the username field:

```
admin' --
```

The query becomes:

```sql
SELECT * FROM users WHERE username = 'admin' -- ' AND password = '...';
```

In SQL, `--` starts a comment. Everything after it, including the password check, is ignored. The attacker logs in as admin without knowing the password.

Another classic payload is `' OR '1'='1`, which makes the condition always true.

## What attackers can do with SQLi

- Bypass logins
- Read entire tables: usernames, emails, password hashes, card data
- Modify or delete data
- In some configurations, run commands on the server

## The fix: parameterised queries

Never build queries by joining strings. Use **parameterised queries** (also called prepared statements). The database treats input strictly as data, never as code.

```python
# DO THIS
cursor.execute(
    "SELECT * FROM users WHERE username = %s AND password_hash = %s",
    (username, password_hash)
)
```

```php
// PHP (PDO)
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);
```

## Defence in depth

1. **Parameterised queries** everywhere (the main fix)
2. **Least privilege**: the app's database account shouldn't be able to drop tables
3. **Input validation**: an age field should only accept numbers
4. **Generic error messages**: don't show raw database errors to users
5. **Web Application Firewall (WAF)** as an extra layer, not a replacement

> Only test for SQL injection on applications you own or are explicitly authorised to test. Use legal practice labs such as PortSwigger Web Security Academy or OWASP Juice Shop.

## Exercises

**1.** What does `--` do in the payload `admin' --`?

<details><summary>Show answer</summary>It starts a SQL comment, so the rest of the query (the password check) is ignored.</details>

**2.** Why does `' OR '1'='1` often bypass a login?

<details><summary>Show answer</summary>It turns the WHERE clause into a condition that is always true, so the database returns rows (often the first user, frequently an admin) regardless of the real password.</details>

**3.** A developer says, "We block the word SELECT, so we're safe." Why isn't that enough?

<details><summary>Show answer</summary>Blocklists are easy to bypass (different case, encoding, comments, other keywords) and SQLi doesn't always need SELECT. Parameterised queries fix the root cause.</details>

**4.** Rewrite this safely (any language): `"SELECT * FROM products WHERE id = " + productId`

<details><summary>Show answer</summary>Use a placeholder and pass the value separately, e.g. cursor.execute("SELECT * FROM products WHERE id = %s", (product_id,)). Validating that productId is an integer adds another layer.</details>

**5. Lab:** Create a free account on PortSwigger Web Security Academy and complete the lab "SQL injection vulnerability allowing login bypass".

<details><summary>Show hint</summary>Try the admin' -- idea from this lesson in the username field. The lab's username is administrator.</details>
