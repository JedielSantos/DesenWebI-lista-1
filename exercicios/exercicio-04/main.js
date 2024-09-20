let photoData = [];
let idCounter = 0;

// Acesso à Câmera
const camera = document.getElementById('camera');
const photo = document.getElementById('photo');
const canvas = document.getElementById('canvas');
const uploadButton = document.getElementById('upload-button');
const uploadPhoto = document.getElementById('upload-photo');
const takePhotoButton = document.getElementById('take-photo');

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        camera.srcObject = stream;
    })
    .catch(() => {
        // Se não houver câmera, mostrar a opção de upload
        uploadButton.style.display = 'block';
        takePhotoButton.style.display = 'none';
    });

takePhotoButton.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = camera.videoWidth;
    canvas.height = camera.videoHeight;
    context.drawImage(camera, 0, 0, canvas.width, canvas.height);
    photo.src = canvas.toDataURL('image/png');
    photo.style.display = 'block';
    camera.style.display = 'none';
});

uploadButton.addEventListener('click', () => {
    uploadPhoto.click();
});

uploadPhoto.addEventListener('change', (event) => {
    const file = event.target.files[0];
    
    // Verifica se o tamanho do arquivo não excede 2MB
    if (file.size > 2 * 1024 * 1024) {
        alert('O tamanho do arquivo deve ser menor que 2MB.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
            const maxSize = 800;
            let width = img.width;
            let height = img.height;

            if (width > maxSize || height > maxSize) {
                if (width > height) {
                    height = Math.round(height * maxSize / width);
                    width = maxSize;
                } else {
                    width = Math.round(width * maxSize / height);
                    height = maxSize;
                }
            }

            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(img, 0, 0, width, height);
            photo.src = canvas.toDataURL('image/png');
            photo.style.display = 'block';
            camera.style.display = 'none';
        };
    };
    reader.readAsDataURL(file);
});

// Configuração do Mapa Leaflet
const map = L.map('map').setView([-23.5505, -46.6333], 13); // Centro em São Paulo
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let marker;

map.on('click', (e) => {
    const { lat, lng } = e.latlng;
    if (marker) {
        map.removeLayer(marker);
    }
    marker = L.marker([lat, lng]).addTo(map);
    document.getElementById('latitude').value = lat;
    document.getElementById('longitude').value = lng;
});

// Obter Localização Atual ao Carregar a Página
window.onload = () => {
    navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        document.getElementById('latitude').value = lat;
        document.getElementById('longitude').value = lng;

        if (marker) {
            map.removeLayer(marker);
        }
        marker = L.marker([lat, lng]).addTo(map);
        map.setView([lat, lng], 13);
    }, () => {
        alert('Não foi possível obter sua localização atual. Por favor, insira manualmente.');
    });

    const storedData = localStorage.getItem('photoData');
    if (storedData) {
        photoData = JSON.parse(storedData);
        idCounter = photoData.length ? photoData[photoData.length - 1].id + 1 : 0;
        updateTable();
    }
};

// Salvar Dados
const saveButton = document.getElementById('save-data');
saveButton.addEventListener('click', () => {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;

    if (!title || !latitude || !longitude) {
        alert('Título e localização são obrigatórios.');
        return;
    }

    const date = new Date().toLocaleString();
    const newEntry = {
        id: idCounter++,
        title,
        description,
        photo: photo.src,
        location: { latitude, longitude },
        date
    };

    photoData.push(newEntry);
    localStorage.setItem('photoData', JSON.stringify(photoData));
    updateTable();
});

// Atualizar Tabela
function updateTable() {
    const tableBody = document.getElementById('photo-table').querySelector('tbody');
    tableBody.innerHTML = '';
    photoData.forEach((entry) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.id}</td>
            <td>${entry.title}</td>
            <td>${entry.description}</td>
            <td>${entry.location.latitude}, ${entry.location.longitude}</td>
            <td>${entry.date}</td>
            <td>
                <button onclick="deleteEntry(${entry.id})">Excluir</button>
                <button onclick="editEntry(${entry.id})">Editar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Excluir Registro
function deleteEntry(id) {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
        photoData = photoData.filter(entry => entry.id !== id);
        localStorage.setItem('photoData', JSON.stringify(photoData));
        updateTable();
    }
}

// Editar Registro
function editEntry(id) {
    const entry = photoData.find(entry => entry.id === id);
    if (entry) {
        document.getElementById('title').value = entry.title;
        document.getElementById('description').value = entry.description;
        document.getElementById('latitude').value = entry.location.latitude;
        document.getElementById('longitude').value = entry.location.longitude;
        // Remover a foto atual para permitir nova captura ou upload
        photo.src = '';
        photo.style.display = 'none';
        camera.style.display = 'block';
    }
}
