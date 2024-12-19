const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3333;
const APK_URL = 'https://github.com/migueelzz/jbs-poc-releases/raw/main/releases/download/version/app.apk';

const UPDATES_DIR = path.join(__dirname, 'updates');
const APK_PATH = path.join(UPDATES_DIR, 'app.apk');

// Garante que o diretório 'updates' exista
if (!fs.existsSync(UPDATES_DIR)) {
    fs.mkdirSync(UPDATES_DIR);
}

// Rota para baixar o APK do GitHub
app.get('/download-apk', async (req, res) => {
    try {
        const response = await axios({
            url: APK_URL,
            method: 'GET',
            responseType: 'stream',
        });

        const writer = fs.createWriteStream(APK_PATH);
        response.data.pipe(writer);

        writer.on('finish', () => {
            res.status(200).send('APK baixado e salvo com sucesso!');
        });

        writer.on('error', (err) => {
            console.error('Erro ao salvar o APK:', err);
            res.status(500).send('Erro ao salvar o APK.');
        });
    } catch (error) {
        console.error('Erro ao baixar o APK:', error);
        res.status(500).send('Erro ao baixar o APK do GitHub.');
    }
});

// Endpoint para servir o APK
app.get('/downloads', (req, res) => {
    if (fs.existsSync(APK_PATH)) {
        res.download(APK_PATH, 'app.apk');
    } else {
        res.status(404).send('APK não encontrado. Faça o download primeiro na rota /download-apk.');
    }
});

// Endpoint para retornar a versão da aplicação
app.get('/version', (req, res) => {
    res.json({
        version: '1.0.1',
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
