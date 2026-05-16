# cyb

A cybersecurity gamified learning platform. *Share. Learn. Play.*

cyb was a small group project I worked on at university. The idea was simple: take the dry parts of intro-level cybersecurity (terminology, common attacks, defensive habits) and wrap them in something that looks and feels more like a game than a textbook. Users sign up, work through quick-fact cards and game rounds, and earn XP and levels for what they get right.

## What's in this repo

- `index.html`: the single-page UI: login, sign-up, home, quick facts, and the game views, all swapped via CSS classes
- `app.js`: client-side logic: localStorage-backed accounts, session handling, view switching, the XP and level system, and the game state machine
- `styles.css`: the visual language, including the retro pixel-font logo and the auth and home layouts

No backend, no build step. Everything runs in the browser using `localStorage` for accounts and progress, which kept the scope tight enough for a coursework deadline.

## How to run it

Clone the repo and open `index.html` in a browser. That is it.

```bash
git clone https://github.com/Abdulla-AlBassam/cyb.git
cd cyb
open index.html
```

Or serve it locally if you want clean paths in DevTools:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Status

Coursework artefact. It is not maintained and is not intended as a production learning platform; it is a teaching demo and a record of the group's work.
