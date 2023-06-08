let meuLanche = document.getElementById("meuLanche");

// Pega nome do Localstorage
let nome = localStorage.getItem('pessoa');  
if (nome) {
  nome = JSON.parse(nome);
  document.querySelector('#name').value = nome;
}

// Lanche
meuLanche.addEventListener("submit", function(event) {
  event.preventDefault();

  // Pega os dados do formulário
  let pao = document.querySelector('input[name="pao"]:checked');
  !pao ? alert("pão é obrigatório") : pao = pao.value;

  let name = document.querySelector('#name');
  if (name) {
    name = name.value;
    localStorage.setItem('pessoa', JSON.stringify(name));
  }
  
  let acompanhamento = document.querySelector('input[name="acompanhamento"]:checked');
  if (acompanhamento) {
    acompanhamento = acompanhamento.value;
  }

  let description = document.querySelector('#description').value;
  if (description.trim() === "") {
    description = null;
  }

  // URL padrão da API
  const url = "https://lunch-app.fly.dev/api/v1/orders"; // Substitua pelo URL do seu endpoint

  const data = {
    name: name,
    food: pao,
    accompaniment: acompanhamento,
    description: description
  };

  // Salva na API
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log("Resposta do servidor:", data);
  })
  .catch(error => {
    console.error("Erro ao enviar solicitação:", error);
  });

  // fecha o popup
  setTimeout(() => {
    window.close();
  }, 500);
}); 

// Alterna entre Pedir e Pedidos
const pedido = document.querySelector('#pedidos');
const pedir = document.querySelector('#pedir');
const sectionPedidos = document.querySelector('#section-pedidos');

pedir.addEventListener('click', () => {
  console.log("Eisme aqui");
  pedir.classList.add('active');
  pedido.classList.remove('active');

  meuLanche.classList.remove('section-none');
  sectionPedidos.classList.add('section-none');
})

pedido.addEventListener('click', () => {
  pedido.classList.add('active');
  pedir.classList.remove('active');

  sectionPedidos.classList.remove('section-none');
  meuLanche.classList.add('section-none');
})
