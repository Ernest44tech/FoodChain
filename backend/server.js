const express = require('express');
const fs = require('fs');
const Blockchain = require('./blockchain');
const cors = require('cors');
const app = express();
const PORT = 3000;

const blockchainFile = './data/blockchain.json';
let foodChain;

if (fs.existsSync(blockchainFile)) {
try {
  const data = fs.readFileSync(blockchainFile, 'utf8');
  const parsed = JSON.parse(data);

  foodChain = new Blockchain();
  foodChain.chain = parsed.chain;
} catch (err) {
  console.warn('⚠️ Archivo blockchain.json inválido o vacío. Se crea nueva cadena.');
  foodChain = new Blockchain();
}
} else {
  foodChain = new Blockchain();
}

app.use(cors());
app.use(express.json());

// GET: Ver todos los bloques
app.get('/blockchain', (req, res) => {
  res.json(foodChain.getAllBlocks());
});

// POST: Registrar una nueva donación
app.post('/donation', (req, res) => {
  const { donor, receiver, type, quantity } = req.body;

  if (!donor || !receiver || !type || !quantity) {
    return res.status(400).json({ error: 'Faltan datos de la donación.' });
  }

  const newBlock = foodChain.addBlock({ donor, receiver, type, quantity });

  // Guardamos la cadena en el archivo
  fs.writeFileSync(blockchainFile, JSON.stringify({ chain: foodChain.getAllBlocks() }, null, 2));

  res.json({ message: 'Donación registrada con éxito', block: newBlock });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
