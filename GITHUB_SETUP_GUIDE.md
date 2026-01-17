# 📦 Push VitalOps to GitHub - Step by Step Guide

Your app is **NOT** currently on GitHub. Follow these steps to upload it.

---

## Step 1: Install Git (If Not Installed)

### Option A: Download Git for Windows

1. Go to https://git-scm.com/download/win
2. Download the installer
3. Run the installer with default settings
4. **Restart your terminal/PowerShell** after installation

### Option B: Install via Winget (Windows 11)

```powershell
winget install --id Git.Git -e --source winget
```

### Verify Installation

Open a **new** PowerShell window and run:
```powershell
git --version
```

You should see something like: `git version 2.xx.x`

---

## Step 2: Initialize Git Repository

1. Open PowerShell in your project directory:
   ```powershell
   cd F:\developments\VitalOps
   ```

2. Initialize Git:
   ```powershell
   git init
   ```

3. Add all files:
   ```powershell
   git add .
   ```

4. Create first commit:
   ```powershell
   git commit -m "Initial commit: VitalOps application"
   ```

---

## Step 3: Create GitHub Repository

### 3.1 Create GitHub Account (If Needed)

1. Go to https://github.com
2. Click **"Sign up"**
3. Create your account

### 3.2 Create New Repository

1. Log in to GitHub
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in:
   - **Repository name**: `VitalOps` (or your preferred name)
   - **Description**: `Medical equipment rental management system`
   - **Visibility**: 
     - ✅ **Public** (free, anyone can see code)
     - ⚠️ **Private** (requires paid plan or GitHub Pro)
   - **DO NOT** check "Initialize with README" (we already have files)
   - **DO NOT** add .gitignore or license (we already have them)
4. Click **"Create repository"**

### 3.3 Copy Repository URL

After creating, GitHub will show you commands. **Copy the repository URL**:
- HTTPS: `https://github.com/yourusername/VitalOps.git`
- Or SSH: `git@github.com:yourusername/VitalOps.git`

---

## Step 4: Connect Local Repository to GitHub

1. In your PowerShell (still in `F:\developments\VitalOps`), run:

   **For HTTPS:**
   ```powershell
   git remote add origin https://github.com/yourusername/VitalOps.git
   ```

   **For SSH (if you have SSH keys set up):**
   ```powershell
   git remote add origin git@github.com:yourusername/VitalOps.git
   ```

2. Rename branch to `main` (if needed):
   ```powershell
   git branch -M main
   ```

3. Push to GitHub:
   ```powershell
   git push -u origin main
   ```

4. **If using HTTPS**, GitHub will prompt for credentials:
   - **Username**: Your GitHub username
   - **Password**: Use a **Personal Access Token** (not your GitHub password)
     - See "Create Personal Access Token" section below

---

## Step 5: Create Personal Access Token (For HTTPS)

GitHub requires a token instead of password for HTTPS.

### 5.1 Generate Token

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Fill in:
   - **Note**: `VitalOps Development`
   - **Expiration**: Choose duration (90 days recommended)
   - **Scopes**: Check **`repo`** (full control of private repositories)
4. Click **"Generate token"**
5. **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)
   - It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 5.2 Use Token When Pushing

When `git push` asks for password, paste the **token** (not your GitHub password).

---

## Step 6: Verify Upload

1. Go to your GitHub repository page:
   ```
   https://github.com/yourusername/VitalOps
   ```

2. You should see all your files:
   - ✅ `apps/` folder
   - ✅ `packages/` folder
   - ✅ `README.md`
   - ✅ `package.json`
   - ✅ All other files

---

## 🎉 Success!

Your code is now on GitHub! You can now proceed with hosting:

1. ✅ Code is on GitHub
2. ✅ Ready for Render deployment (backend)
3. ✅ Ready for Vercel deployment (frontend)

---

## 🔄 Future Updates

Whenever you make changes, push them with:

```powershell
git add .
git commit -m "Description of changes"
git push
```

---

## 🆘 Troubleshooting

### "git: command not found"
- Git is not installed or not in PATH
- Install Git (Step 1) and restart terminal

### "fatal: not a git repository"
- You're not in the project directory
- Run: `cd F:\developments\VitalOps`

### "remote origin already exists"
- Repository is already connected
- Check with: `git remote -v`
- To change URL: `git remote set-url origin NEW_URL`

### "Authentication failed"
- Use Personal Access Token instead of password
- See Step 5 for token creation

### "Permission denied"
- Check repository is accessible
- Verify token has `repo` scope
- Try SSH instead of HTTPS

### Large files won't upload
- Check `.gitignore` is excluding `node_modules/`
- If needed, add to `.gitignore`:
  ```
  node_modules/
  dist/
  .next/
  ```

---

## 📝 Quick Reference Commands

```powershell
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message here"

# Push to GitHub
git push

# Check remote connection
git remote -v

# View commit history
git log --oneline
```

---

## ✅ Checklist

- [ ] Git installed and verified
- [ ] Repository initialized (`git init`)
- [ ] Files committed (`git commit`)
- [ ] GitHub repository created
- [ ] Local repo connected to GitHub (`git remote add`)
- [ ] Code pushed to GitHub (`git push`)
- [ ] Verified files appear on GitHub website

---

**Once complete, proceed to `HOSTING_GUIDE.md` for deployment!** 🚀
