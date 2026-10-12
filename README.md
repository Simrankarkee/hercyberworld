# HerCyberWorld 💗

**Learn · Connect · Defend**, a cybersecurity learning site by Simran Karki.

- **Learn**: slide decks and blogs about cybersecurity skills
- **Connect**: discussion threads where people reply, react and upvote (powered by GitHub Discussions + giscus)
- **Defend**: cyber awareness only: safety guides, a Security Checkup and a "Spot the Phish" quiz

---

## Part 1: Put the site online (one time, ~15 minutes)

### Step 1: Create a GitHub account
Go to **github.com**, sign up (free) and verify your email.

### Step 2: Create the repository
1. Click **+** (top right) → **New repository**
2. Repository name: `hercyberworld`
3. Choose **Public**
4. Tick **Add a README file**
5. Click **Create repository**

### Step 3: Upload the website files
1. Unzip `hercyberworld-site.zip` on your computer
2. In your repository click **Add file → Upload files**
3. Open the unzipped folder, select **everything inside it** and drag it onto the page
4. Scroll down and click **Commit changes**

> ⚠️ The `.github` folder is hidden on most computers, so it often doesn't upload by dragging.
> Add it by hand: click **Add file → Create new file**, type the name
> `.github/workflows/deploy.yml` (the slashes create the folders), open the
> `deploy-workflow-COPY-ME.txt` file from the zip in Notepad/TextEdit, copy everything, paste it in and click **Commit changes**.

### Step 4: Turn on the website
1. Go to **Settings → Pages**
2. Under **Build and deployment → Source** choose **GitHub Actions**
3. Click the **Actions** tab. You'll see "Publish HerCyberWorld" running. When it shows a green ✓, your site is live at
   **https://YOUR-USERNAME.github.io/hercyberworld/**

(If it didn't run, open Actions → Publish HerCyberWorld → **Run workflow**.)

### Step 5: Edit config.js
Click `config.js` → the ✏️ pencil icon → replace `YOUR-GITHUB-USERNAME` (in two places) with your username → **Commit changes**.

### Step 6: Turn on Connect (discussions)
1. Repository **Settings → General → Features** → tick **Discussions**
2. Open the **Discussions** tab → ✏️ next to Categories → **New category**
   - Name: `Connect`, Format: **Announcement** (so only you and giscus create threads; everyone can reply)
3. Install the giscus app: **https://github.com/apps/giscus** → Install → choose only the `hercyberworld` repository
4. Go to **https://giscus.app**, type `YOUR-USERNAME/hercyberworld` in the Repository box and pick the **Connect** category
5. Scroll to "Enable giscus". Copy the values of `data-repo-id` and `data-category-id`
6. Paste them into `config.js` (`repoId` and `categoryId`) → **Commit changes**

Done! Every lesson, guide and thread now has its own comment section. Visitors sign in with GitHub to post, can reply to each other, and can react with 👍 ❤️ 🎉 (upvotes).

---

## Part 2: Add content (every time)

Every post is a **folder** with one text file inside. The site updates itself about 1 minute after you upload.

| Section | Put the folder in | Text file name |
|---|---|---|
| Learn | `content/learn/` | `lesson.md` |
| Defend | `content/defend/` | `lesson.md` |
| Connect | `content/connect/` | `topic.md` |

Folder names become the web address, so use lowercase-with-dashes, like `sql-injection-basics`.
Folders starting with `_` (the templates) are ignored.

### Add a blog
1. Open `content/learn/_template-blog/lesson.md` and copy its text
2. **Add file → Create new file**, name it `content/learn/my-new-post/lesson.md`
3. Paste, change the details at the top, write your post, **Commit changes**

### Add a slide deck (from PowerPoint / Canva / Google Slides)
1. Export your slides as **PNG or JPG images** (PowerPoint: File → Export → PNG; Canva: Share → Download → PNG; Google Slides: download each slide, or export PDF)
2. Rename them `01.png`, `02.png`, `03.png`… so they stay in order
3. Create `content/learn/my-deck/lesson.md` from `_template-slides` (keep `type: slides`)
4. Open the new `my-deck` folder → **Add file → Upload files** → drop in your images (and a PDF if you want a download button) → **Commit**
5. Optional: add `cover.png` to use as the card picture

You can also write text slides in `lesson.md`. Put a line with only `---` between slides.

### The details at the top of each file

```
---
title: SQL Injection for Beginners
summary: What it is, how it works and how to prevent it.
type: blog            # blog or slides
path: web             # Learn only (see list below)
topic: phishing       # Defend only (see list below)
level: Beginner       # Beginner, Intermediate or Advanced
date: 2026-10-12
tags: [sql, owasp, web]
draft: true           # optional: hides the post until you remove this line
---
```

**Learn paths:** `fundamentals`, `network`, `web`, `ethical-hacking`, `linux`, `crypto`, `ctf`, `career`
**Defend topics:** `phishing`, `passwords`, `social`, `mobile`, `money`, `harassment`, `family`
**Connect boards:** `community`, `beginners`, `careers`, `ctf`, `scam-alerts`, `resources` (add `pinned: true` to pin)

### Edit or delete a post
Open the file on GitHub → ✏️ to edit, or **⋯ → Delete file**. To remove a whole post, delete every file in its folder.

### Remove the starter posts
The posts marked "Starter" are examples. Edit them or delete their folders whenever you like.

---

## Optional: your own domain (e.g. hercyberworld.com)
Buy the domain (Namecheap, Cloudflare, GoDaddy…), then in **Settings → Pages → Custom domain** type it and follow GitHub's DNS instructions.

## File map
```
index.html               the page shell
config.js                your settings (username, giscus, social links)
assets/style.css         colours and design (pink #ffc6ed, hot pink #ff66c4)
assets/app.js            how the site works
content/                 ALL your posts live here
scripts/build-manifest.mjs   builds the content list automatically
.github/workflows/deploy.yml publishes the site on every change
```
