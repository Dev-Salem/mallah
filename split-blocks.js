const fs = require('fs');
const content = fs.readFileSync('seed.sql', 'utf8');
const blocks = content.split('DO $$');
blocks.slice(1).forEach((block, i) => {
    fs.writeFileSync('block' + i + '.sql', 'DO $$' + block);
});
console.log('Split into', blocks.length - 1, 'blocks');
