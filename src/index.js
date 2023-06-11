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
  fazerRequisicao(url, data);
}); 

// Alterna entre Pedir e Pedidos
const pedido = document.querySelector('#pedidos');
const pedir = document.querySelector('#pedir');
const sectionPedidos = document.querySelector('#section-pedidos');
const title = document.querySelector('#title');

pedir.addEventListener('click', () => {
  console.log("Eisme aqui");
  pedir.classList.add('active');
  pedido.classList.remove('active');

  meuLanche.classList.remove('section-none');
  sectionPedidos.classList.add('section-none');

  title.innerText = "Novo Pedido";
})

pedido.addEventListener('click', () => {
  pedido.classList.add('active');
  pedir.classList.remove('active');

  sectionPedidos.classList.remove('section-none');
  meuLanche.classList.add('section-none');

  title.innerText = "Pedidos";
})

// Envia dados para API
function fazerRequisicao(url, data) {
  let loading = document.querySelector("#loading");
  show(loading);

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      setTimeout(() => {
        hide(loading);
      }, 5000);
      
      fechaPopup();      
    } else {
      throw new Error('Erro na requisição');
    }
  })
  .catch(error => {

    // Reenvia dados para a API
    setTimeout(() => {
      fazerRequisicao(data);
    }, 5000);
  });
}

// Fecha Popup
function fechaPopup() {
  setTimeout(() => {
    window.close();
  }, 500);
}

// SUMIR
function hide(id) {
  id.classList.add("hide")
}

// APARECER
function show(id) {
  id.classList.remove("hide")
}

let close = document.querySelector("#close");
close.addEventListener("click", () => {
  fechaPopup();
});

// Get the dropdown button and content
let dropdownBtn = document.querySelector(".dropbtn");
let dropdownContent = document.querySelector(".dropdown-content");

// Toggle the dropdown content when the button is clicked
dropdownBtn.addEventListener("click", function() {
  dropdownContent.classList.toggle("show");
});

// Close the dropdown when clicking outside of it
window.addEventListener("click", function(event) {
  if (!event.target.matches(".dropbtn")) {
    if (dropdownContent.classList.contains("show")) {
      dropdownContent.classList.remove("show");
    }
  }
});
