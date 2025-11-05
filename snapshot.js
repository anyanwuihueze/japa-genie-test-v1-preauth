const fs   = require('fs');
const path = require('path');
const root = process.cwd();
const out  = 'japa-genie-snapshot.json';

const skip = /node_modules|\.next|dist|\.git|\.env\.local|\.env\.production/;
const ext  = /\.(json|js|jsx|ts|tsx|mjs|md|yml|yaml)$/i;

let tree = { root, files: {} };

(function walk(dir = root, rel = '.') {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name);
    const r   = path.join(rel, ent.name);
    if (skip.test(abs)) continue;
    if (ent.isDirectory()) { walk(abs, r); continue; }
    if (ext.test(ent.name)) {
      const head = fs.readFileSync(abs, 'utf8').slice(0, 5000);
      tree.files[r] = { size: fs.statSync(abs).size, head };
    }
  }
})();

fs.writeFileSync(out, JSON.stringify(tree, null, 2));
console.log('✅  snapshot written to', out);
