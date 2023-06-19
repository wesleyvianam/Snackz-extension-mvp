// URL padrão da API
const url = "https://snack-dz.fly.dev/api/v1/orders";

// Executa Busca dos dados Na API
getOrders(url);

// Pega nome do Localstorage
let hasNameSaved = localStorage.getItem('pessoa');  
if (hasNameSaved) {
  nome = JSON.parse(hasNameSaved);
  document.querySelector('#name').value = nome;
}

// Salva lanche na API
let snack = document.getElementById("meuLanche");
snack.addEventListener("submit", function(event) {
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


  const data = {
    name: name,
    food: pao,
    accompaniment: acompanhamento,
    description: description
  };

  // Salva na API
  saveSnack(url, data);
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

  snack.classList.remove('section-none');
  sectionPedidos.classList.add('section-none');

  title.innerText = "Novo Pedido";
})

pedido.addEventListener('click', () => {
  pedido.classList.add('active');
  pedir.classList.remove('active');

  sectionPedidos.classList.remove('section-none');
  snack.classList.add('section-none');

  title.innerText = "Pedidos";
})

// Envia dados para API
function saveSnack(url, data) {
  disableButtonSubmit(true);
  
  let loading = document.querySelector("#loading");
  let success = document.querySelector("#success");
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
        show(success);
      }, 1000);     

      setTimeout(() => {
        fechaPopup();      
      }, 1500);
    } else {
      disableButtonSubmit(false);

      throw new Error('Erro na requisição');
    }
  })
  .catch(error => {

    // Reenvia dados para a API
    setTimeout(() => {
      saveSnack(url, data);
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

async function getSnacks(url) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error("Erro na requisição");        
    }

    return await response.json();
  } catch(error) {
    console.log(error);
  }
}

function getOrders(url) {
  // campos
  const campoQtdPedido = document.querySelector('#qtdPedidos');
  const campoNomeAcompanhamento = document.querySelector('#nomeAcompanhamento');
  const campoQtdAcompanhamento = document.querySelector('#qtdAcompanhamento');
  const campoQtdFrances = document.querySelector('#qtdFrances');
  const campoQtdDoce = document.querySelector('#qtdDoce');
  const campoQtdCreme = document.querySelector('#qtdCreme');

  const response = getSnacks(url+"/results");
  response.then(res => {
    const acompanhamento = res.accompaniment;
    const qtdMussarela = acompanhamento.Mussarela || 0;
    const qtdMortadela = acompanhamento.Mortadela || 0;

    const food = res.food;
    const qtdFrances = food.Frances || 0;
    const qtdCreme = food.Creme || 0;
    const qtdDoce = food.Doce || 0;
    
    // Total de pedidos
    let totalPedidos = 0; 
    for (let propriedade in food) {
      if (food.hasOwnProperty(propriedade)) {
        totalPedidos += food[propriedade];
      }
    }
    
    // Votação Mortadela X Mussarela
    const qtdAcompanhamento = (qtdMortadela + qtdMussarela) * 2;
    qtdMortadela > qtdMussarela
      ? campoNomeAcompanhamento.innerText = "Mortadela"
      : campoNomeAcompanhamento.innerText = "Mussarela";

    // Define Campos
    campoQtdPedido.innerText = totalPedidos;
    campoQtdAcompanhamento.innerText = qtdAcompanhamento;
    campoQtdFrances.innerHTML = qtdFrances;
    campoQtdDoce.innerText = qtdDoce;
    campoQtdCreme.innerText = qtdCreme;
  })
}

function disableButtonSubmit(value) {
  const btnSubmit = document.querySelector("#btnSubmit");

  btnSubmit.disabled = value;
}

async function getDescription(url) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error("Erro na requisição");        
    }

    return await response.json();
  } catch(error) {
    console.log(error);
  }
}

function setDescription(url) {
  const listaObs = document.querySelector("#observacao");

  const response = getDescription(url + "/descriptions");
  response.then(res => {
    res.forEach(index => {
      if (index.description != null) {
        const li = document.createElement('li');
        const divName = document.createElement('div');
        const divDescri = document.createElement('div');

        li.classList.add('list-group-item')
        divName.classList.add('name')
        divDescri.classList.add('description') 
        
        divName.textContent = index.name + ":";
        divDescri.textContent = index.description;
        
        li.appendChild(divName);
        li.appendChild(divDescri);
        listaObs.appendChild(li);
      } 
    })
  })
}

setDescription(url);
