---
title: Cross-Site Scripting (XSS) in 9 Slides
summary: How attackers inject JavaScript into trusted websites, the three types of XSS, and how developers prevent it.
type: slides
path: web
level: Intermediate
date: 2026-09-26
tags: [xss, javascript, owasp, web]
---
# Cross-Site Scripting

When a website runs an attacker's JavaScript

---

## What is XSS?

A website includes user input in a page **without making it safe**, so the browser runs it as code.

```html
<p>Search results for: <script>alert('XSS')</script></p>
```

The script runs with the **victim's session** on that trusted site.

---

## What attackers do with it

- Steal session cookies and hijack accounts
- Capture keystrokes and form data
- Show fake login forms on a real site
- Perform actions as the victim (change email, transfer money)

---

## Type 1: Reflected XSS

- Payload is in the **URL** or request
- Server reflects it straight back in the response
- Victim must click a crafted link

`https://shop.example/search?q=<script>...</script>`

---

## Type 2: Stored XSS

- Payload is **saved** in the database (comment, profile, review)
- Runs for **every visitor** who views that page
- Most dangerous: no click on a special link needed

---

## Type 3: DOM-based XSS

- Happens entirely in the browser
- Page JavaScript takes input (e.g. `location.hash`) and writes it unsafely

```js
// Vulnerable
element.innerHTML = location.hash.slice(1);
```

---

## How developers prevent XSS

1. **Output encoding**: turn `<` into `&lt;` before showing user input
2. Use safe APIs: `textContent` instead of `innerHTML`
3. Sanitise rich HTML with a library like **DOMPurify**
4. Add a **Content Security Policy** (CSP) header
5. Set cookies as **HttpOnly** so scripts can't read them

---

## Exercises

1. A comment box saves `<img src=x onerror=alert(1)>` and every visitor sees a popup. Which XSS type is this?
2. Why does `HttpOnly` reduce the damage of XSS?
3. Which is safer for showing a username: `innerHTML` or `textContent`?

<details><summary>Show answers</summary>1: Stored XSS, because it's saved and served to everyone. 2: Scripts can't read HttpOnly cookies, so the session cookie can't be stolen directly. 3: textContent, because it never interprets the text as HTML.</details>

---

## Practise legally

- PortSwigger Web Security Academy: free XSS labs
- OWASP Juice Shop: a deliberately vulnerable shop
- Google's XSS Game

Only test sites you own or are authorised to test.
