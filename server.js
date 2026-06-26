import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 10000;
const dist = join(__dirname, 'dist');

app.use(express.static(dist));

app.get('*', (_req, res) => {
  try {
    const html = readFileSync(join(dist, 'index.html'), 'utf-8');
    res.send(html);
  } catch {
    res.status(404).send('Not found');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
