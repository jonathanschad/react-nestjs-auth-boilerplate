#!/usr/bin/env node
const fs = require("fs");
const { execSync } = require("child_process");
// Get version from command-line arguments
const version = process.argv[2];

if (!version) {
    console.error("Usage: yarn release <version>");
    process.exit(1);
}

// Check if tag already exists in Git
try {
    const existingTags = execSync("git tag", { encoding: "utf8" }).split("\n");
    if (existingTags.includes(version)) {
        console.error(`Tag ${version} already exists in Git.`);
        process.exit(1);
    }
} catch (error) {
    console.error("Error checking Git tags:", error.message);
    process.exit(1);
}
const packageJsonPathWebsite = "./server/package.json";
const packageJsonPathBackend = "./client/package.json";

const updatePackageJson = (packageJsonPath) => {
    // Update package.json version
    try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
        packageJson.version = version;
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4) + "\n");

        execSync(`git add ${packageJsonPath}`);

        console.log(`Updated package.json version to ${version}`);
    } catch (error) {
        console.error("Error updating package.json:", error.message);
        process.exit(1);
    }
};

updatePackageJson(packageJsonPathWebsite);
updatePackageJson(packageJsonPathBackend);

// Create Git commit and tag
try {
    execSync(`git commit -m "Release ${version}"`, { stdio: "inherit" });
    execSync(`git tag -a ${version} -m "Version ${version}"`, { stdio: "inherit" });
    console.log(`Created Git tag ${version}`);
} catch (error) {
    console.error("Error creating Git commit or tag:", error.message);
    process.exit(1);
}
