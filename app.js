

/** app.js — BAON single-page app: routing, views, events. MIT */

/** app.js — BAON single-page app: routing, views, events. MIT */

import * as calc from './budget.js';

import * as db from './db.js';

const view = document.getElementById('view');

const toastEl = document.getElementById('toast');

/* ---------- state: the data the screens show ---------- */

const DEFAULT_BUDGET = {

amount: 1000, period: 'weekly', startDate: calc.toISODate(new Date()),

};

const state = { budget: DEFAULT_BUDGET, expenses: [] };

async function loadState() {

state.budget = await db.getSetting('budget', DEFAULT_BUDGET);

}

/* ---------- helpers ---------- */

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => ESC[ch]);

function toast(msg, action) {

toastEl.innerHTML = `<span>${esc(msg)}</span>`;

if (action) {

const b = document.createElement('button');

b.textContent = action.label;

b.onclick = action.run;

toastEl.append(b);

}

toastEl.hidden = false;

clearTimeout(toast.timer);

const hide = () => { toastEl.hidden = true; };

if (!action) toast.timer = setTimeout(hide, 2500);

/* ---------- views (placeholders for now) ---------- */

function renderHome() {

view.innerHTML = `<section class="card"><h2>Home</h2>

<p class="muted">Your remaining baon will show here.</p></section>`;

}

function renderAdd() {

view.innerHTML = `<section class="card"><h2>Add expense</h2>

<p class="muted">The expense form will go here.</p></section>`;

}

function renderHistory() {

view.innerHTML = `<section class="card"><h2>History</h2>

<p class="muted">Your expenses will be listed here.</p></section>`;

}

// function renderSettings() {

// view.innerHTML = `<section class="card"><h2>My baon</h2>

// <p class="muted">The budget form will go here.</p></section>`;
function renderSettings() {

const b = state.budget;

const opt = (p) =>

`<option ${p === b.period ? 'selected' : ''}>${p}</option>`;

view.innerHTML = `

<section class="card">

<h2>My baon</h2>

<form id="budgetForm">

<label>Allowance amount (₱)

<input name="amount" type="number" min="1" step="0.01"

value="${b.amount}" required></label>

<label>Every

<select name="period">

${['daily', 'weekly', 'monthly'].map(opt).join('')}

</select></label>
<label>Starting

<input name="startDate" type="date"

value="${b.startDate}" required></label>

<button class="btn lime">Save budget</button>

</form>

</section>`;

document.getElementById('budgetForm').onsubmit = saveBudget;

}

async function saveBudget(ev) {

ev.preventDefault();

const d = Object.fromEntries(new FormData(ev.target));

state.budget = {

amount: Number(d.amount), period: d.period, startDate: d.startDate,

};

await db.setSetting('budget', state.budget);

toast('Budget saved ✅');
/* ---------- router ---------- */

const routes = {

home: renderHome, add: renderAdd,

history: renderHistory, settings: renderSettings,

};

async function router() {

const name = location.hash.replace('#/', '') || 'home';

const render = routes[name] ?? renderHome;

document.querySelectorAll('.tabbar a').forEach((a) =>

a.classList.toggle('active', a.dataset.route === name));

await render();

window.scrollTo(0, 0);

view.focus({ preventScroll: true });

}

/* ---------- start ---------- */

window.addEventListener('hashchange', router);
await loadState();
router();

}
}


