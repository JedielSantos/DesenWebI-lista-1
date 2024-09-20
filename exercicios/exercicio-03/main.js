document.getElementById('image-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const width = document.getElementById('width').value;
    const height = document.getElementById('height').value;
    const quantity = document.getElementById('quantity').value;
    
    // Limpa mensagens de erro
    document.getElementById('width-error').textContent = '';
    document.getElementById('height-error').textContent = '';
    document.getElementById('quantity-error').textContent = '';

    // Validação
    let valid = true;
    
    if (width < 100 || width > 1920) {
        document.getElementById('width-error').textContent = 'A largura deve estar entre 100 e 1920 pixels.';
        valid = false;
    }

    if (height < 100 || height > 1080) {
        document.getElementById('height-error').textContent = 'A altura deve estar entre 100 e 1080 pixels.';
        valid = false;
    }

    if (![3, 5, 10, 20].includes(parseInt(quantity))) {
        document.getElementById('quantity-error').textContent = 'Selecione uma quantidade válida (3, 5, 10 ou 20).';
        valid = false;
    }

    if (!valid) return;

    // Chamar a função para gerar as imagens se tudo estiver correto
    gerarImagens(width, height, quantity);
});

function gerarImagens(width, height, quantity) {
    const container = document.getElementById('image-grid');
    container.innerHTML = ''; // Limpa o grid antes de gerar novas imagens

    for (let i = 0; i < quantity; i++) {
        const imageId = Math.floor(Math.random() * 1000); // Gera um ID aleatório para a imagem
        const imgSrc = `https://picsum.photos/id/${imageId}/${width}/${height}`;
        
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = `Imagem aleatória com ${width}px de largura e ${height}px de altura.`;
        
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');
        imageContainer.appendChild(img);

        // Botão para copiar o link da imagem
        const copyLinkButton = document.createElement('button');
        copyLinkButton.textContent = 'Copiar Link';
        copyLinkButton.addEventListener('click', () => {
            navigator.clipboard.writeText(img.src).then(() => {
                alert('Link copiado com sucesso!');
            }).catch(err => {
                console.error('Erro ao copiar o link: ', err);
            });
        });
        imageContainer.appendChild(copyLinkButton);

        // Botão para compartilhar a imagem
        const shareButton = document.createElement('button');
        shareButton.textContent = 'Compartilhar';
        shareButton.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: 'Imagem Aleatória',
                    text: 'Veja esta imagem!',
                    url: img.src
                }).catch((error) => console.log('Erro ao compartilhar:', error));
            } else {
                alert('Compartilhamento não suportado neste navegador');
            }
        });
        imageContainer.appendChild(shareButton);

        // Botão para baixar a imagem em Full HD (1920x1080) no formato webp
        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Baixar em Full HD';
        downloadButton.addEventListener('click', () => {
            const fullHdLink = `https://picsum.photos/id/${imageId}/1920/1080.webp`; // Tamanho Full HD no formato webp
            const a = document.createElement('a');
            a.href = fullHdLink;
            a.download = `imagem-fullhd-${imageId}.webp`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a); // Remove o link após o clique
        });
        imageContainer.appendChild(downloadButton);

        container.appendChild(imageContainer);
    }
}