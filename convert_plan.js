const fs = require('fs');
const path = require('path');

// Handle execution from different directories
const baseDir = __dirname;
const planPath = path.join(baseDir, 'constants', 'plan.ts');
const outPath = path.join(baseDir, 'data', '2025.json');

console.log(`Reading from: ${planPath}`);
console.log(`Writing to: ${outPath}`);

if (!fs.existsSync(path.join(baseDir, 'data'))) {
    fs.mkdirSync(path.join(baseDir, 'data'));
}

try {
    const content = fs.readFileSync(planPath, 'utf8');
    const startMatch = content.indexOf('[');
    const endMatch = content.lastIndexOf(']');

    if (startMatch !== -1 && endMatch !== -1) {
        const arrayStr = content.substring(startMatch, endMatch + 1);
        // Use eval to handle unquoted keys (e.g. index: "1")
        const data = eval('(' + arrayStr + ')');
        fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
        console.log('Successfully created data/2025.json');
    } else {
        console.error('Failed to find array in plan.ts');
        process.exit(1);
    }
} catch (e) {
    console.error(e);
    process.exit(1);
}
