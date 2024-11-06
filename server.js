// server.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Habilitar CORS
app.use(cors());

// Configurar el límite de tamaño a 2 MB
app.use(bodyParser.json({ limit: '2mb' }));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para el análisis de imágenes
app.post('/analyze', async (req, res) => {
    const { imageUrl } = req.body;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Devuelveme dentro de un div con etiquetas html los ingredientes que salen en la imagen y una receta con ellos" },
                        {
                            type: "image_url",
                            image_url: {
                                url: imageUrl,
                            },
                        },
                    ],
                },
            ],
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
        });

        res.json(response.data.choices[0].message.content);
    } catch (error) {
        console.error("Error al analizar la imagen:", error);
        res.status(500).send("Error al analizar la imagen.");
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
