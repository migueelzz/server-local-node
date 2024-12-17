const express = require('express');
const path = require('path');
const app = express();
const PORT = 3333;

// Rota para servir o manifesto
app.get('/updates', (req, res) => {
  res.sendFile(path.join(__dirname, '.expo/updates/manifest.json'));
});

// Rota para servir os bundles e assets
app.use('/bundles', express.static(path.join(__dirname, '.expo/updates')));

app.listen(PORT, () => {
  console.log(`🔥 Server running`);
});
