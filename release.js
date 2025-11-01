#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

// Function to recursively find all package.json files in a directory
const findPackageJsonFiles = (dir) => {
    const packageJsonFiles = [];

    if (!fs.existsSync(dir)) {
        return packageJsonFiles;
    }

    const files = fs.readdirSync(dir);

    const subDirs = files
        .map((file) => {
            const filePath = path.join(dir, file);
            return [filePath, fs.statSync(filePath)];
        })
        .filter((file) => file[1].isDirectory());

    for (const [subDirPath, subDirStat] of subDirs) {
        if (subDirStat.isDirectory()) {
            const packageJsonPath = path.join(subDirPath, 'package.json');
            if (fs.existsSync(packageJsonPath)) {
                packageJsonFiles.push(packageJsonPath);
            }
        }
    }

    return packageJsonFiles;
};

// Get version from command-line arguments
const version = process.argv[2].replace(/^v/, '');

if (!version) {
    console.error('Usage: yarn release <version>');
    process.exit(1);
}

if (version.split('.').length !== 3) {
    console.error('Release version must be in the format x.x.x');
    process.exit(1);
}

execSync('git checkout main');
execSync('git pull');

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

// Find all package.json files
const packageJsonFiles = [
    './package.json', // Root package.json
    ...findPackageJsonFiles('./apps'),
    ...findPackageJsonFiles('./packages'),
];

console.log('Found package.json files:', packageJsonFiles);

const updatePackageJson = (packageJsonPath) => {
    // Update package.json version
    try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        packageJson.version = version;
        fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 4)}\n`);

        execSync(`git add ${packageJsonPath}`);

        console.log(`Updated ${packageJsonPath} version to ${version}`);
    } catch (error) {
        console.error(`Error updating ${packageJsonPath}:`, error.message);
        process.exit(1);
    }
};

// Update all found package.json files
packageJsonFiles.forEach(updatePackageJson);

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
