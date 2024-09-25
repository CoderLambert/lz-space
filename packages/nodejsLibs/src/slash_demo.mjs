import path from 'node:path';
import slash from 'slash';

const string = path.join('foo', 'bar');
// Unix    => foo/bar
// Windows => foo\\bar

// slash(string);
// Unix    => foo/bar
// Windows => foo/bar
console.log(string)
console.log(slash(string));