import fs from 'fs';
import path from 'path';
import selfsigned from 'selfsigned';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const attrs = [{ name: 'commonName', value: 'patrimonio.edu' }];
const opts = {
  keySize: 2048,
  days: 365,
  algorithm: 'sha256',
  extensions: [
    { name: 'basicConstraints', cA: true },
    {
      name: 'subjectAltName',
      altNames: [
        { type: 2, value: 'patrimonio.edu' }, // DNS
        // { type: 2, value: 'www.patrimonio.edu' } // DNS alternativo
      ]
    }
  ]
};


const pems = selfsigned.generate(attrs, opts);

const outDir = path.join(__dirname, 'cert');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

fs.writeFileSync(path.join(outDir, 'key.pem'), pems.private);
fs.writeFileSync(path.join(outDir, 'cert.pem'), pems.cert);

console.log('Certificados gerados em ./cert (key.pem e cert.pem)');
