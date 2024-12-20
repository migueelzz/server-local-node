const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3333;

const APK_URL = 'https://github.com/migueelzz/jbs-poc-releases/raw/main/releases/download/version/app.apk';
const APK_URL_V2 = 'https://github.com/migueelzz/jbs-poc-releases/raw/main/releases/download/version/app_2.0.0.apk';

const UPDATES_DIR = path.join(__dirname, 'updates');
const APK_PATH = path.join(UPDATES_DIR, 'app.apk');
const APK_PATH_V2 = path.join(UPDATES_DIR, 'app_2.0.0.apk');

// Garante que o diretório 'updates' exista
if (!fs.existsSync(UPDATES_DIR)) {
    fs.mkdirSync(UPDATES_DIR);
}

// Rota para baixar o APK do GitHub (versão 1)
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
            res.status(200).send('APK v1 baixado e salvo com sucesso!');
        });

        writer.on('error', (err) => {
            console.error('Erro ao salvar o APK v1:', err);
            res.status(500).send('Erro ao salvar o APK v1.');
        });
    } catch (error) {
        console.error('Erro ao baixar o APK v1:', error);
        res.status(500).send('Erro ao baixar o APK v1 do GitHub.');
    }
});

// Rota para baixar o APK do GitHub (versão 2)
app.get('/download-apk-v2', async (req, res) => {
    try {
        const response = await axios({
            url: APK_URL_V2,
            method: 'GET',
            responseType: 'stream',
        });

        const writer = fs.createWriteStream(APK_PATH_V2);
        response.data.pipe(writer);

        writer.on('finish', () => {
            res.status(200).send('APK v2 baixado e salvo com sucesso!');
        });

        writer.on('error', (err) => {
            console.error('Erro ao salvar o APK v2:', err);
            res.status(500).send('Erro ao salvar o APK v2.');
        });
    } catch (error) {
        console.error('Erro ao baixar o APK v2:', error);
        res.status(500).send('Erro ao baixar o APK v2 do GitHub.');
    }
});

// Endpoint para servir o APK (versão 1)
app.get('/downloads', (req, res) => {
    if (fs.existsSync(APK_PATH)) {
        res.download(APK_PATH, 'app.apk');
    } else {
        res.status(404).send('APK v1 não encontrado. Faça o download primeiro na rota /download-apk.');
    }
});

// Endpoint para servir o APK (versão 2)
app.get('/downloads-v2', (req, res) => {
    if (fs.existsSync(APK_PATH_V2)) {
        res.download(APK_PATH_V2, 'app_2.0.0.apk');
    } else {
        res.status(404).send('APK v2 não encontrado. Faça o download primeiro na rota /download-apk-v2.');
    }
});

// Endpoint para retornar a versão da aplicação
app.get('/version', (req, res) => {
    res.json({
        version: '2.0.0',
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
