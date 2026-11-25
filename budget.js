/** budget.js — pure budget logic (no DOM, no storage). MIT */

/** Format a number as Philippine peso, e.g. "₱1,250.00". */

export function peso(n) {

return new Intl.NumberFormat('en-PH', {

style: 'currency', currency: 'PHP',

}).format(n);

}

/** Date -> "YYYY-MM-DD" in local time. */

export function toISODate(d) {

const m = String(d.getMonth() + 1).padStart(2, '0');

const day = String(d.getDate()).padStart(2, '0');

return `${d.getFullYear()}-${m}-${day}`;

}

/** "YYYY-MM-DD" -> Date at local midnight. */

export function fromISODate(s) {

const [y, m, d] = s.split('-').map(Number);

return new Date(y, m - 1, d);

}