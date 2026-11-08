const { execSync } = require('child_process');
const path = require('path');

const rootDir = __dirname;

function run(cmd) {
  console.log('[run] ' + cmd);
  execSync(cmd, { stdio: 'inherit', cwd: rootDir });
}

try {
  console.log('=== Pushing to GitHub (main branch) ===');
  run('git add -A');
  
  const status = execSync('git status --porcelain', { cwd: rootDir }).toString().trim();
  if (status) {
    const args = process.argv.slice(2).join(' ').trim();
    const msg = args || ('Update: ' + new Date().toISOString());
    run('git commit -m "' + msg + '"');
  } else {
    console.log('No new changes to commit.');
  }

  run('git push origin main');
  console.log('=== Successfully pushed to GitHub! ===');
} catch (err) {
  console.log('[Notice] Push failed or rejected, attempting pull rebase...');
  try {
    run('git pull origin main --rebase');
    run('git push origin main');
    console.log('=== Successfully pushed after rebase! ===');
  } catch (rebaseErr) {
    console.error('Final push failed:', rebaseErr.message);
    process.exit(1);
  }
}
