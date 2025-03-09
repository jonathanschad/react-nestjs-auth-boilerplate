#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');
// Get version from command-line arguments
const version = process.argv[2].replace(/^v/, '');

if (!version) {
    console.error('Usage: yarn release <version>');
    process.exit(1);
}

// Check if tag already exists in Git
try {
    const existingTags = execSync('git tag', { encoding: 'utf8' }).split('\n');
    if (existingTags.includes(version)) {
        console.error(`Tag ${version} already exists in Git.`);
        process.exit(1);
    }
} catch (error) {
    console.error('Error checking Git tags:', error.message);
    process.exit(1);
}
const packageJsonPathWebsite = './apps/server/package.json';
const packageJsonPathBackend = './apps/client/package.json';
const packageJsonPathDatabase = './packages/prisma/package.json';
const packageJsonPathRoot = './package.json';

const updatePackageJson = (packageJsonPath) => {
    // Update package.json version
    try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        packageJson.version = version;
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4) + '\n');

        execSync(`git add ${packageJsonPath}`);

        console.log(`Updated package.json version to ${version}`);
    } catch (error) {
        console.error('Error updating package.json:', error.message);
        process.exit(1);
    }
};

updatePackageJson(packageJsonPathWebsite);
updatePackageJson(packageJsonPathBackend);
updatePackageJson(packageJsonPathDatabase);
updatePackageJson(packageJsonPathRoot);

// Create Git commit and tag
try {
    execSync('git push origin', { stdio: 'inherit' });
    execSync(`git commit -m "Release v${version}"`, { stdio: 'inherit' });
    execSync('git push origin', { stdio: 'inherit' });
    execSync(`git tag -a v${version} -m "Version v${version}"`, { stdio: 'inherit' });
    execSync(`git push origin v${version}`, { stdio: 'inherit' });
    console.log(`Created Git tag v${version}`);
} catch (error) {
    console.error('Error creating Git commit or tag:', error.message);
    process.exit(1);
}
