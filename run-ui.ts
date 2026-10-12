import { exec, execSync } from "node:child_process";
import waitOn from 'wait-on';
async function run() {
    exec('npm run start:server -- --port=3004');
    await waitOn({ resources: ['http://localhost:3004'], timeout: 10_000 });
    execSync('playwright test --ui --config=./playwright.ci.config.ts', { stdio: 'inherit' });
}

run();