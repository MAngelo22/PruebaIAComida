// main.js

// Botón para abrir el explorador de archivos y seleccionar una imagen
document.getElementById('uploadButton').addEventListener('click', () => {
    const imageInput = document.getElementById('imageInput');
    imageInput.click();
});

// Manejar la selección de archivo
document.getElementById('imageInput').addEventListener('change', handleFileSelect);

// Función para manejar la selección de archivos
function handleFileSelect(event) {
    const file = event.target.files[0];
    const MAX_SIZE = 2 * 1024 * 1024; // Limitar el tamaño a 2 MB

    if (file && file.size > MAX_SIZE) {
        alert("El archivo es demasiado grande. Selecciona uno de menos de 2 MB.");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        const imageUrl = reader.result;
        const imagePreview = document.getElementById('imagePreview');
        imagePreview.src = imageUrl;
        imagePreview.style.display = 'block';
        document.getElementById('sendButton').disabled = false; // Habilitar el botón de enviar
    };
    reader.readAsDataURL(file);
}

// Botón para capturar imagen desde la cámara
document.getElementById('cameraButton').addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();

        video.style.width = '100%';
        video.style.maxWidth = '300px';
        video.style.marginTop = '10px';
        document.body.appendChild(video);

        const captureButton = document.createElement('button');
        captureButton.innerText = 'Capturar Foto';
        captureButton.style.display = 'block';
        captureButton.style.marginTop = '10px';
        document.body.appendChild(captureButton);

        captureButton.addEventListener('click', () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageUrl = canvas.toDataURL('image/png');
            const imagePreview = document.getElementById('imagePreview');
            imagePreview.src = imageUrl;
            imagePreview.style.display = 'block';
            document.getElementById('sendButton').disabled = false;

            stream.getTracks().forEach(track => track.stop());
            document.body.removeChild(video);
            document.body.removeChild(captureButton);
        });
    } catch (error) {
        console.error("Error al acceder a la cámara:", error);
        alert("No se puede acceder a la cámara. Revisa permisos y configuración.");
    }
});

// Botón para enviar la imagen al servidor
document.getElementById('sendButton').addEventListener('click', () => {
    const imagePreview = document.getElementById('imagePreview').src;
    if (imagePreview) {
        showSpinner();
        sendImageToServer(imagePreview);
    }
});

// Función para enviar la imagen al servidor
async function sendImageToServer(imageUrl) {
    try {
        const response = await fetch('http://localhost:3000/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageUrl })
        });
        const data = await response.json();
        document.getElementById('result').innerHTML = data;
    } catch (error) {
        console.error("Error al analizar la imagen:", error);
        document.getElementById('result').innerText = "Error al analizar la imagen.";
    } finally {
        hideSpinner();
    }
}


// Abrir el menú lateral
document.getElementById("openNavButton").addEventListener("click", function() {
    document.getElementById("sidebar").style.width = "250px";
    document.getElementById("mainContent").style.marginLeft = "250px";
});

// Cerrar el menú lateral 
document.getElementById("closeNavButton").addEventListener("click", function() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("mainContent").style.marginLeft = "0";
});


function showSpinner() {
    // Ocultar cualquier otro spinner (si existe)
    const existingSpinner = document.getElementById('existingSpinner'); // Ajusta el ID si es necesario
    if (existingSpinner) {
        existingSpinner.style.display = 'none';
    }

    // Mostrar el spinner de hámster
    document.getElementById('spinner').style.display = 'block';
}

function hideSpinner() {
    // Ocultar el spinner de hámster
    document.getElementById('spinner').style.display = 'none';

    // Volver a mostrar el spinner original (si lo necesitas)
    const existingSpinner = document.getElementById('existingSpinner');
    if (existingSpinner) {
        existingSpinner.style.display = 'block';
    }
}


// Procesar el formulario y enviar la imagen al servidor
document.getElementById('mainContent').addEventListener('sendButton', async function (event) {
    event.preventDefault();

    const fileInput = document.getElementById('imageInput');
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);

    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            // Redirigir a la página de resultados
            window.location.href = '/resultado.html';
        } else {
            alert('Error al analizar la imagen.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema con la solicitud.');
    }
});

