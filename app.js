/* ============================================================
   CYB – APPLICATION SCRIPT
   Login, sign‑up, navigation, XP, Quick Facts and game logic.
   ============================================================ */

/* ------------ LocalStorage Helpers ------------ */
function readUsers() {
  return JSON.parse(localStorage.getItem("cyb_users") || "[]");
}

function writeUsers(users) {
  localStorage.setItem("cyb_users", JSON.stringify(users));
}

function setSession(id) {
  localStorage.setItem("cyb_session", id);
}

function getSession() {
  return localStorage.getItem("cyb_session");
}

/* ------------ View Switching ------------ */
function showView(name) {
  const session = getSession();
  const publicViews = ["login", "signup"];

  if (!session && !publicViews.includes(name)) {
    name = "login";
  }

  document.querySelectorAll(".view").forEach(v =>
    v.classList.remove("view--active")
  );

  const target = document.getElementById("view-" + name);
  if (target) target.classList.add("view--active");

  if (name === "home") {
    renderHome();
  }
}

/* ------------ Render Home (header + XP) ------------ */
function renderHome() {
  const id = getSession();
  const users = readUsers();
  const user = users.find(u => u.id === id);
  if (!user) return;

  const emailSpan = document.getElementById("signed-email");
  if (emailSpan) emailSpan.textContent = user.email;

  const levelPill = document.getElementById("summary-level-pill");
  const xpLabel = document.getElementById("summary-xp-label");
  const goalLabel = document.getElementById("summary-goal-label");
  const xpCaption = document.getElementById("summary-xp-caption");
  const xpFill = document.getElementById("xp-fill");

  const xp = user.xp || 0;
  const level = user.level || 1;
  const goal = user.goal || "Protect myself";

  if (levelPill) levelPill.textContent = `Level ${level}`;
  if (xpLabel) xpLabel.textContent = `${xp} XP`;
  if (goalLabel) goalLabel.textContent = `Goal: ${goal}`;
  if (xpCaption) xpCaption.textContent = `${xp} / 20 XP to next level`;
  if (xpFill) xpFill.style.width = `${Math.min((xp / 20) * 100, 100)}%`;
}

/* ============================================================
   AUTH – SIGN UP & LOGIN
   ============================================================ */

/* SIGN UP */
document.addEventListener("click", (e) => {
  if (!e.target.matches("#signup-btn")) return;

  const emailInput = document.getElementById("signup-email");
  const passInput = document.getElementById("signup-pass");
  const msg = document.getElementById("signup-msg");

  const email = emailInput.value.trim().toLowerCase();
  const pass = passInput.value;
  msg.textContent = "";

  if (!email || !pass) {
    msg.textContent = "Please provide both an email and a password.";
    return;
  }

  if (pass.length < 6) {
    msg.textContent = "Password must be at least 6 characters.";
    return;
  }

  const users = readUsers();
  if (users.some(u => u.email === email)) {
    msg.textContent = "This email is already registered on this device.";
    return;
  }

  const newUser = {
    id: "u" + (users.length + 1),
    email,
    password: pass,
    xp: 0,
    level: 1,
    goal: "Protect myself"
  };

  users.push(newUser);
  writeUsers(users);
  setSession(newUser.id);

  showView("home");
});

/* LOGIN */
document.addEventListener("click", (e) => {
  if (!e.target.matches("#login-btn")) return;

  const emailInput = document.getElementById("login-email");
  const passInput = document.getElementById("login-pass");
  const msg = document.getElementById("login-msg");

  const email = emailInput.value.trim().toLowerCase();
  const pass = passInput.value;
  msg.textContent = "";

  const user = readUsers().find(u => u.email === email && u.password === pass);

  if (!user) {
    msg.textContent = "Incorrect email or password for this browser.";
    return;
  }

  setSession(user.id);
  showView("home");
});

/* LOGOUT */
document.addEventListener("click", (e) => {
  if (!e.target.matches("#logout-btn")) return;

  setSession("");
  showView("login");
});

/* ============================================================
   GLOBAL NAVIGATION
   ============================================================ */

/* Home menu cards */
document.addEventListener("click", (e) => {
  const card = e.target.closest(".menu-card");
  if (!card) return;

  const view = card.dataset.view;
  if (view) showView(view);
});

/* Header icons & settings list */
document.addEventListener("click", (e) => {
  const icon = e.target.closest(".icon-pill, .settings-item");
  if (!icon) return;

  const view = icon.dataset.view;
  if (view) showView(view);
});

/* Admin Hub tiles */
document.addEventListener("click", (e) => {
  const tile = e.target.closest(".admin-tile");
  if (!tile) return;
  const view = tile.dataset.view;
  if (view) showView(view);
});

/* Certification Hub links */
document.addEventListener("click", (e) => {
  const link = e.target.closest(".cert-link");
  if (!link) return;

  const level = link.dataset.cert;
  if (level === "beginner") showView("cert-beginner");
  else if (level === "intermediate") showView("cert-intermediate");
  else if (level === "advanced") showView("cert-advanced");
});

/* ============================================================
   QUICK FACTS – Topic pill details
   ============================================================ */
document.addEventListener("click", (e) => {
  const pill = e.target.closest(".topic-pill");
  if (!pill) return;

  const detailBox = document.getElementById("quickfact-topic-detail");
  if (!detailBox) return;

  const topic = pill.textContent.trim();
  let html = "";

  switch (topic) {
    case "What is a firewall?":
      html = `
        <h3>What is a firewall?</h3>
        <p>
          A firewall is a security gate that controls which network traffic is allowed in or out
          of a device or network.
        </p>
        <ul>
          <li>Used on home routers, school networks and individual devices.</li>
          <li>Blocks unwanted or unexpected connections.</li>
          <li>Works best alongside other security tools.</li>
        </ul>
      `;
      break;

    case "How strong passwords protect you":
      html = `
        <h3>How strong passwords protect you</h3>
        <p>
          Strong passwords make it harder for attackers to guess or crack your login details.
          Longer, unique passphrases are far stronger than short, simple words.
        </p>
        <ul>
          <li>Use several random words instead of one short word.</li>
          <li>A different password for important accounts reduces damage if one is leaked.</li>
          <li>Password managers help you store them securely.</li>
        </ul>
      `;
      break;

    case "Staying safe on public Wi‑Fi":
      html = `
        <h3>Staying safe on public Wi‑Fi</h3>
        <p>
          Public Wi‑Fi can be convenient but less secure than trusted home or school networks.
        </p>
        <ul>
          <li>Avoid logging into sensitive accounts on unknown networks.</li>
          <li>Check sites use <strong>https://</strong> and show a padlock icon.</li>
          <li>Turn off sharing options on laptops when using public Wi‑Fi.</li>
        </ul>
      `;
      break;

    case "Recognising phishing attacks":
      html = `
        <h3>Recognising phishing attacks</h3>
        <p>
          Phishing messages pretend to be from trusted organisations in order to steal information.
        </p>
        <ul>
          <li>Look for spelling errors or unusual sender addresses.</li>
          <li>Be suspicious of time pressure or threats.</li>
          <li>Visit official websites directly instead of clicking unexpected links.</li>
        </ul>
      `;
      break;

    case "Multi‑factor authentication":
      html = `
        <h3>Multi‑factor authentication</h3>
        <p>
          Multi‑factor authentication (MFA) adds an extra check when logging in, such as a code
          sent to your phone.
        </p>
        <ul>
          <li>MFA makes a stolen password less useful on its own.</li>
          <li>Common factors: password, phone code, fingerprint or security key.</li>
          <li>Recommended for email, social media and banking accounts.</li>
        </ul>
      `;
      break;

    case "Why software updates matter":
      html = `
        <h3>Why software updates matter</h3>
        <p>
          Updates often fix known weaknesses that attackers could use. Installing them reduces the
          number of ways your device can be attacked.
        </p>
        <ul>
          <li>Keep operating systems, browsers and apps up to date.</li>
          <li>Turn on automatic updates where possible.</li>
          <li>Restart devices when updates require it.</li>
        </ul>
      `;
      break;

    default:
      html = `<p>Select a topic above to see a short explanation here.</p>`;
  }

  detailBox.innerHTML = html;
});

/* ============================================================
   ONLINE PLAY – Interactive quiz modes
   ============================================================ */

const ONLINE_QUESTION_SETS = {
  lightning: [
    {
      q: "You receive an email saying you have won a prize and must click a link to claim it. What should you do?",
      options: [
        "Click the link quickly before it expires",
        "Check if the email is expected and verify the sender before doing anything",
        "Reply with your full name and address",
        "Forward it to all your friends"
      ],
      correct: 1
    },
    {
      q: "Which of these is the safest password?",
      options: [
        "password123",
        "Manchester2024",
        "Tree!Dog!Pizza!River",
        "qwerty"
      ],
      correct: 2
    },
    {
      q: "What does two‑factor or multi‑factor authentication do?",
      options: [
        "Automatically changes your password every week",
        "Adds an extra check, such as a code or fingerprint, when you log in",
        "Lets you share passwords safely with friends",
        "Makes your device run faster"
      ],
      correct: 1
    },
    {
      q: "Why are software updates important?",
      options: [
        "They only change how apps look",
        "They always make devices slower",
        "They often fix security weaknesses and bugs",
        "They delete old files to save space"
      ],
      correct: 2
    },
    {
      q: "You are using public Wi‑Fi in a café. Which action is safest?",
      options: [
        "Logging into online banking",
        "Accessing schoolwork through a known, secure website",
        "Sharing your Wi‑Fi password with others",
        "Turning off your device’s firewall"
      ],
      correct: 1
    }
  ],
  capture: [
    {
      q: "A friend sends you a screenshot of a message asking for your login code. What should you tell them?",
      options: [
        "Share the code only with close friends",
        "Codes are secret; they should never be shared with anyone",
        "Send the code but change password later",
        "Ignore it because codes are not important"
      ],
      correct: 1
    },
    {
      q: "You spot a USB stick on the floor near school. Best response?",
      options: [
        "Plug it into your laptop to see what’s on it",
        "Take it home and keep it",
        "Give it to a member of staff or IT to handle safely",
        "Throw it in the nearest bin"
      ],
      correct: 2
    },
    {
      q: "A website address looks slightly different to the one you normally use. What should you check?",
      options: [
        "Only the logo colours",
        "That the URL is spelled correctly and uses https",
        "Whether the page has lots of adverts",
        "How quickly the page loads"
      ],
      correct: 1
    }
  ],
  quizswap: [
    {
      q: "Explain in your own words why using the same password everywhere is risky.",
      options: [],
      correct: 0
    }
  ]
};

let currentOnlineMode = null;
let currentOnlineIndex = 0;
let currentOnlineScore = 0;
let lightningTimerId = null;
let lightningTimeLeft = 0;

function resetOnlinePanel() {
  const title = document.getElementById("online-game-title");
  const desc = document.getElementById("online-game-description");
  const timer = document.getElementById("online-game-timer");
  const status = document.getElementById("online-game-status");
  const question = document.getElementById("online-game-question");
  const options = document.getElementById("online-game-options");
  const startBtn = document.getElementById("online-game-start");

  if (title) title.textContent = "Pick a game mode";
  if (desc) {
    desc.textContent =
      "Select Lightning Round, Capture The Flag, or Quiz Swap to see instructions and start a game.";
  }
  if (timer) timer.textContent = "";
  if (status) status.textContent = "";
  if (question) question.textContent = "";
  if (options) options.innerHTML = "";
  if (startBtn) startBtn.style.display = "inline-block";
}

/* Select a game mode */
document.addEventListener("click", (e) => {
  const row = e.target.closest(".game-row");
  if (!row) return;

  const mode = row.dataset.onlineGame;
  currentOnlineMode = mode;
  currentOnlineIndex = 0;
  currentOnlineScore = 0;

  if (lightningTimerId) {
    clearInterval(lightningTimerId);
    lightningTimerId = null;
  }

  const title = document.getElementById("online-game-title");
  const desc = document.getElementById("online-game-description");
  const timer = document.getElementById("online-game-timer");
  const status = document.getElementById("online-game-status");
  const question = document.getElementById("online-game-question");
  const options = document.getElementById("online-game-options");
  const startBtn = document.getElementById("online-game-start");

  if (!title || !desc || !timer || !status || !question || !options || !startBtn) return;

  question.textContent = "";
  options.innerHTML = "";
  status.textContent = "";
  timer.textContent = "";

  switch (mode) {
    case "lightning":
      title.textContent = "Lightning Round";
      desc.textContent =
        "Answer as many questions as you can in 60 seconds. Each correct answer scores a point.";
      timer.textContent = "Time remaining: 60s";
      break;
    case "capture":
      title.textContent = "Capture The Flag";
      desc.textContent =
        "Work through scenario‑based questions. Aim for the highest score you can.";
      break;
    case "quizswap":
      title.textContent = "Quiz Swap";
      desc.textContent =
        "Read the open question and discuss your answer with a partner or group.";
      break;
    default:
      resetOnlinePanel();
  }

  startBtn.textContent = "Start game";
  startBtn.style.display = "inline-block";
});

/* Start game button */
document.addEventListener("click", (e) => {
  if (!e.target.matches("#online-game-start")) return;

  if (!currentOnlineMode) {
    resetOnlinePanel();
    return;
  }

  const status = document.getElementById("online-game-status");
  if (status) status.textContent = "";

  currentOnlineIndex = 0;
  currentOnlineScore = 0;

  if (currentOnlineMode === "lightning") {
    const timerLabel = document.getElementById("online-game-timer");
    lightningTimeLeft = 60;
    if (timerLabel) timerLabel.textContent = `Time remaining: ${lightningTimeLeft}s`;

    if (lightningTimerId) clearInterval(lightningTimerId);
    lightningTimerId = setInterval(() => {
      lightningTimeLeft -= 1;
      if (timerLabel) timerLabel.textContent = `Time remaining: ${lightningTimeLeft}s`;
      if (lightningTimeLeft <= 0) {
        clearInterval(lightningTimerId);
        lightningTimerId = null;
        endOnlineGame(true);
      }
    }, 1000);
  } else {
    const timerLabel = document.getElementById("online-game-timer");
    if (timerLabel) timerLabel.textContent = "";
  }

  renderOnlineQuestion();
});

/* Render the current question */
function renderOnlineQuestion() {
  const questions = ONLINE_QUESTION_SETS[currentOnlineMode];
  const questionEl = document.getElementById("online-game-question");
  const optionsEl = document.getElementById("online-game-options");
  const startBtn = document.getElementById("online-game-start");

  if (!questions || !questionEl || !optionsEl || !startBtn) return;

  if (currentOnlineIndex >= questions.length) {
    endOnlineGame(false);
    return;
  }

  const q = questions[currentOnlineIndex];
  questionEl.textContent = q.q;
  optionsEl.innerHTML = "";

  if (q.options && q.options.length > 0) {
    q.options.forEach((opt, index) => {
      const btn = document.createElement("button");
      btn.className = "online-option";
      btn.textContent = opt;
      btn.dataset.answerIndex = String(index);
      optionsEl.appendChild(btn);
    });
  } else {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent =
      "This is an open question. Discuss your answer with a partner and note key points.";
    optionsEl.appendChild(p);
  }

  startBtn.style.display = "none";
}

/* Handle answer click */
document.addEventListener("click", (e) => {
  const optBtn = e.target.closest(".online-option");
  if (!optBtn) return;

  const questions = ONLINE_QUESTION_SETS[currentOnlineMode];
  if (!questions) return;

  const q = questions[currentOnlineIndex];
  const chosen = Number(optBtn.dataset.answerIndex);
  const status = document.getElementById("online-game-status");

  if (chosen === q.correct) {
    currentOnlineScore += 1;
    if (status) status.textContent = "Correct – nice work!";
  } else {
    if (status) status.textContent = "Not quite – keep going.";
  }

  currentOnlineIndex += 1;
  setTimeout(() => {
    if (status) status.textContent = "";
    renderOnlineQuestion();
  }, 600);
});

/* End of game */
function endOnlineGame(timeUp) {
  const questions = ONLINE_QUESTION_SETS[currentOnlineMode] || [];
  const questionEl = document.getElementById("online-game-question");
  const optionsEl = document.getElementById("online-game-options");
  const status = document.getElementById("online-game-status");
  const startBtn = document.getElementById("online-game-start");

  if (!questionEl || !optionsEl || !status || !startBtn) return;

  if (lightningTimerId) {
    clearInterval(lightningTimerId);
    lightningTimerId = null;
  }

  questionEl.textContent = "";
  optionsEl.innerHTML = "";

  if (timeUp && currentOnlineMode === "lightning") {
    status.textContent = `Time’s up! You scored ${currentOnlineScore} out of ${questions.length}.`;
  } else {
    status.textContent = `You scored ${currentOnlineScore} out of ${questions.length}.`;
  }

  addXP(5); // reward

  startBtn.textContent = "Play again";
  startBtn.style.display = "inline-block";
}

/* ============================================================
   OFFLINE PLAY – Prompt generator
   ============================================================ */

const OFFLINE_PROMPTS = {
  solo: [
    "Name three signs that an email might be a phishing attempt.",
    "Explain why using the same password on every site is risky.",
    "List two things you should check before installing a new app.",
    "Describe one situation where public Wi‑Fi might be unsafe.",
    "Give an example of good digital behaviour you could teach a friend."
  ],
  scenario: [
    "You receive a message from a classmate asking for your login details because they are 'locked out'. What should you do and why?",
    "A pop‑up appears on your screen saying your device is infected and you must call a number. How do you respond?",
    "You are about to post a group photo online. What checks should you do first?",
    "Your game account has a very rare item. You get an offer to trade it if you share your login. What is the safest approach?"
  ],
  threatspotter: [
    "A message says: 'Your account will be closed in 24 hours unless you click this link.' What is the threat and what is a safe response?",
    "A stranger adds you to a group chat and sends a file called 'results.pdf'. What risks should you consider before opening it?",
    "You find a website that looks identical to your bank’s site, but the address bar spelling is slightly different. What could be happening?",
    "Someone phones claiming to be technical support and asks you to install remote access software. What are the risks?"
  ]
};

let currentOfflineMode = "solo";

/* Choose an offline activity */
document.addEventListener("click", (e) => {
  const row = e.target.closest(".offline-row");
  if (!row) return;

  currentOfflineMode = row.dataset.offlineGame || "solo";
  updateOfflinePanel(true);
});

/* New prompt button */
document.addEventListener("click", (e) => {
  if (!e.target.matches("#offline-new-prompt")) return;
  updateOfflinePanel(false);
});

function updateOfflinePanel(resetTitle) {
  const title = document.getElementById("offline-game-title");
  const desc = document.getElementById("offline-game-description");
  const promptEl = document.getElementById("offline-game-prompt");

  if (!title || !desc || !promptEl) return;

  if (resetTitle) {
    switch (currentOfflineMode) {
      case "solo":
        title.textContent = "Solo Speed Drill";
        desc.textContent = "Use these questions as 60‑second quick‑fire prompts.";
        break;
      case "scenario":
        title.textContent = "Scenario Simulator";
        desc.textContent = "Discuss the situation and agree what a safe response looks like.";
        break;
      case "threatspotter":
        title.textContent = "Threat Spotter";
        desc.textContent = "Identify the risks and suggest protective actions.";
        break;
      default:
        title.textContent = "Offline activity";
        desc.textContent = "";
    }
  }

  const list = OFFLINE_PROMPTS[currentOfflineMode] || [];
  if (list.length === 0) {
    promptEl.textContent = "No prompts available for this activity yet.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * list.length);
  promptEl.textContent = list[randomIndex];
}

/* ============================================================
   XP Helper (used by online games)
   ============================================================ */
function addXP(amount) {
  const id = getSession();
  if (!id) return;

  const users = readUsers();
  const user = users.find(u => u.id === id);
  if (!user) return;

  user.xp = (user.xp || 0) + amount;

  if (user.xp >= 20) {
    user.level = (user.level || 1) + 1;
    user.xp = 0;
  }

  writeUsers(users);
  renderHome();
}

/* ------------ Initialise App ------------ */
showView("login");
