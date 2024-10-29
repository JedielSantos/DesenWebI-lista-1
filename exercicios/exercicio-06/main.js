const products = [
  { id: 1, name: 'Computador Gamer', category: 'computadores', brand: 'Marca A', price: 4500, description: 'Um PC potente para jogos.', image: 'Imagens/Computador Gamer.png' },
  { id: 2, name: 'Mouse Sem Fio', category: 'acessórios', brand: 'Marca B', price: 150, description: 'Mouse ergonômico e preciso.', image: 'Imagens/Mouse sem fio.jpg' },
  { id: 3, name: 'Teclado Mecânico', category: 'acessórios', brand: 'Marca C', price: 350, description: 'Teclado mecânico com iluminação RGB.', image: 'Imagens/Teclado Mecanico.jpg' },
  { id: 4, name: 'Monitor 4K', category: 'monitores', brand: 'Marca A', price: 1200, description: 'Monitor com resolução 4K e alta qualidade.', image: 'Imagens/monitor 4K.jpg' },
  { id: 5, name: 'Notebook Ultrafino', category: 'notebooks', brand: 'Marca D', price: 3000, description: 'Notebook leve e com ótima performance.', image: 'Imagens/notebook.jpg' },
  { id: 6, name: 'Cadeira Gamer', category: 'móveis', brand: 'Marca E', price: 800, description: 'Cadeira ergonômica para conforto em longas sessões.', image: 'Imagens/cadeira Gamer.jpg' }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Exibe os produtos na página inicial
function displayProducts() {
  const productContainer = document.getElementById('product-container');
  productContainer.innerHTML = '';

  products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');
      productDiv.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h2>${product.name}</h2>
          <p>Preço: R$${product.price.toFixed(2)}</p>
          <button onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
      `;
      productContainer.appendChild(productDiv);
  });
}


// Adiciona produto ao carrinho
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
      existingItem.quantity += 1;
  } else {
      cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Produto adicionado ao carrinho!');
}

// Exibe o carrinho
function displayCart() {
  const cartContainer = document.getElementById('cart-container');
  const totalPriceElement = document.getElementById('total-price');

  cartContainer.innerHTML = '';
  let totalPrice = 0;

  cart.forEach(item => {
      totalPrice += item.price * item.quantity;

      const itemDiv = document.createElement('div');
      itemDiv.classList.add('cart-item');
      itemDiv.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <h3>${item.name}</h3>
          <p>Preço: R$${item.price.toFixed(2)}</p>
          <label>Quantidade:</label>
          <input type="number" value="${item.quantity}" min="1" onchange="updateCartQuantity(${item.id}, this.value)">
          <button onclick="removeFromCart(${item.id})">Remover</button>
      `;
      cartContainer.appendChild(itemDiv);
  });

  totalPriceElement.innerText = `Preço Total: R$${totalPrice.toFixed(2)}`;
}

// Atualiza a quantidade do produto no carrinho
function updateCartQuantity(id, quantity) {
  const item = cart.find(item => item.id === id);
  if (item) {
      item.quantity = parseInt(quantity);
      localStorage.setItem('cart', JSON.stringify(cart));
      displayCart();
  }
}

// Remove um item do carrinho
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
}

// Redireciona para a página de checkout
function goToCheckout() {
  window.location.href = 'checkout.html';
}

// Carrega os produtos na página inicial
if (window.location.pathname.includes('index.html')) {
  displayProducts();
}

// Carrega o carrinho ao abrir a página do carrinho
if (window.location.pathname.includes('cart.html')) {
  displayCart();
}

// Processa o formulário de checkout
document.getElementById('checkout-form')?.addEventListener('submit', function(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const address = document.getElementById('address').value;

  if (cart.length === 0) {
      alert('Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.');
      return;
  }

  // Aqui você pode adicionar lógica para processar o pagamento ou enviar os dados do pedido
  alert(`Compra finalizada com sucesso!\nNome: ${name}\nEndereço: ${address}`);
  
  // Limpa o carrinho após finalizar a compra
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  window.location.href = 'index.html'; // Redireciona de volta para a página inicial
});

function applyFilters() {
  // Obtém os valores dos filtros
  const searchTerm = document.getElementById('searchBar').value.toLowerCase();
  const categoryFilter = document.getElementById('categoryFilter').value;
  const brandFilter = document.getElementById('brandFilter').value;

  // Obtém todos os produtos
  const products = document.querySelectorAll('.product');

  // Itera sobre cada produto para verificar se ele deve ser exibido
  products.forEach(product => {
      // Obtém informações do produto
      const productName = product.querySelector('h2').textContent.toLowerCase();
      const productCategory = product.getAttribute('data-category');
      const productBrand = product.getAttribute('data-brand');

      // Verifica se o produto atende aos critérios de busca
      const matchesSearch = productName.includes(searchTerm);
      const matchesCategory = categoryFilter ? productCategory === categoryFilter : true;
      const matchesBrand = brandFilter ? productBrand === brandFilter : true;

      // Mostra ou oculta o produto com base nos critérios
      if (matchesSearch && matchesCategory && matchesBrand) {
          product.style.display = 'block'; // Exibe o produto
      } else {
          product.style.display = 'none'; // Oculta o produto
      }
  });
}

document.getElementById('paymentMethod').addEventListener('change', function() {
  const cardDetails = document.getElementById('creditCardDetails');
  if (this.value === 'creditCard') {
      cardDetails.style.display = 'block';
  } else {
      cardDetails.style.display = 'none';
  }
});