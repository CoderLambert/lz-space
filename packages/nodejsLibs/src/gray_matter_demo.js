const fs = require('fs');
const matter = require('gray-matter');
const fileContent = fs.readFileSync('./assets/gray_matter_demo.md', 'utf-8');
const {data, content} = matter(fileContent);

console.log(data); 
// console.log(content); 