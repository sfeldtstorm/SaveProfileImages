# SaveProfileImages
 
A [Vencord](https://vencord.dev) plugin that lets you save any Discord user's avatar or banner at full resolution, straight from the right-click menu.

---
 
## What it does
 
Did you ever ask someone for their Profile Picture or Banner and you lowkey realize they're just a gatekeeper even though they don't own the fucking Art...

Discord doesn't make it easy to grab someone's full-size avatar or banner — you usually end up opening the image and hoping the URL isn't downscaled. This plugin skips all that crap.

- **Save Avatar** — right-click any user, download their avatar
- **Save Banner** — same, for their profile banner (only shows up if they have one)
- Works with animated (GIF) avatars/banners
- Choose your download resolution, up to 4096px

---

## Install
 
This plugin isn't in Vencord's official plugin list, so you'll need your own local Vencord userplugin build for it to work.
 
**1. Get Vencord set up locally** (skip if you already have this)
```
git clone https://github.com/Vendetta-mod/Vencord
cd Vencord
pnpm install
```
 
**2. Add this plugin**
```
mkdir -p src/userplugins/saveProfileImages
```
Download `index.tsx` from this repo and place it inside that new folder — or just open [`index.tsx`](index.tsx) here, copy the code, and paste it into a new file with that exact name in that folder.
 
> **Note:** if you're using Notepad to create the file, make sure to change "Save as type" to **All Files** before saving — otherwise Notepad quietly saves it as `index.tsx.txt`, or something like that and the plugin won't be found.
 
**3. Build it in**
```
pnpm build
```
 
**4. Connect it to Discord** (only needed the first time you build a custom plugin into this install — skip if Vencord is already injected)
```
pnpm inject
```
 
**5. Restart Discord completely**, then enable it:
`User Settings → Vencord → Plugins → search "SaveProfileImages" → toggle on`
 
> **Windows users:** a couple of small differences from the steps above —
> - Use PowerShell or Git Bash for these commands, not `cmd.exe`.
> - No `nano` on Windows — just create `index.tsx` in VS Code, Notepad, or any text editor instead.
> - "Restart Discord completely" means right-clicking the Discord icon in your system tray (bottom-right, near the clock) and choosing **Quit** — closing the window alone isn't enough, same as on Mac/Linux.

---

## How to use it
 
Right-click on:
- a username in chat, a server member list, or a DM
- an avatar anywhere
- an open profile card
You'll see **Save Avatar** and **Save Banner** near the bottom of the menu — click either to download.
 
Change the download resolution anytime in the plugin's own settings.
 
---
 
## Notes
 
- Only works on avatars/banners you're already able to see in Discord — it doesn't bypass any privacy or blocking.
- Requires rebuilding (`pnpm build` + Discord restart) any time you update `index.tsx`.
