let vendasSorted = []; // Array de vendas tratado
let vendas = []; // Array que armazena as vendas

const minhaModalEditar = document.getElementById('modalEditarVenda')
const btnEditar = document.getElementById('editarDados');
const btnFecharEditar = document.getElementById('closeModalEditar')
const formEditarVenda = document.getElementById('formEditarVenda');

const minhaModal = document.getElementById("modalAdicionarVenda");
const btnAdicionar = document.getElementById("btnAdicionar");
const btnFechar = document.getElementById("closeModal");
const formAdicionarVenda = document.getElementById('formAdicionarVenda')

const overlay = document.getElementById("overlay");
const gerarBtn = document.getElementById('gerarBtn');

function renderizarTabela() {
    let vendasBody = document.getElementById('vendasBody')
    vendasBody.innerHTML = '' // Limpa a tabela

    vendas.forEach((venda, index) => {
        venda.valorVenda = parseFloat(venda.valorVenda)
        valorVendaFormatado = venda.valorVenda.toLocaleString('pt-BR', {
            style: 'currency', currency: 'BRL'
        })
        venda.codVenda = venda.codVenda.toString();
        venda.codVendedor = venda.codVendedor.toString();

        venda.codVendedor = venda.codVendedor.padStart(3, '0')
        venda.codVenda = venda.codVenda.padStart(3, '0')

        if(venda.cargoVendedor === 'junior' || venda.cargoVendedor === 'Junior' || venda.cargoVendedor === 'Júnior'){
            venda.cargo = 'Júnior'
        } else if(venda.cargoVendedor === 'pleno' || venda.cargoVendedor === 'Pleno'){
            venda.cargoVendedor = 'Pleno'
        } else{venda.cargoVendedor = 'Sênior'}

        vendasBody.innerHTML += `
            <tr>
                <td>${venda.nomeVendedor}</td>
                <td>${venda.cargoVendedor}</td>
                <td>${venda.codVendedor}</td>
                <td>${valorVendaFormatado}</td>
                <td>${venda.codVenda}</td>
                <td style="display: flex">
                    <button type="button" class="btn btn-light btn-sm text-center" onclick="overlay.style.display = 'block', editarVenda(${index})">
                        Editar
                    </button>

                    <button type="button" class="btn btn-light btn-sm text-center ml-2" onclick="excluirDados(${index})">
                        Excluir
                    </button>
                </td>
            </tr>
            `
    })
}

function adicionarVenda(event){
    event.preventDefault()

    // Armazenar os valores dos campos de input
    let nomeVendedor = document.getElementById('nomeVendedor').value;
    let cargoVendedor = document.getElementById('cargoVendedor').value;
    let codVendedor = document.getElementById('codVendedor').value;
    let valorVenda = document.getElementById('valorVenda').value;
    let codVenda = document.getElementById('codVenda').value;

    const venda = {nomeVendedor, cargoVendedor, codVendedor, valorVenda, codVenda}

    fetch('http://localhost:5000/vendas', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(venda)
    })
    .then(response => response.json())
    .then(() => {
        buscarVendas()
    })
    .catch(error => console.error('Error:', error));

    toggleModal(minhaModal)
    formAdicionarVenda.reset()
}  

function editarVenda(index){
    const venda = vendas[index]
    toggleModal(minhaModalEditar)

    document.getElementById('nomeEditar').value = venda.nomeVendedor 
    document.getElementById('cargoEditar').value = venda.cargoVendedor
    document.getElementById('codVendedorEditar').value = venda.codVendedor
    document.getElementById('valorVendaEditar').value = venda.valorVenda
    document.getElementById('codVendaEditar').value = venda.codVenda

    formEditarVenda.addEventListener('submit', function(event){
        event.preventDefault()

        const novaVenda = {
            nomeVendedor: document.getElementById('nomeEditar').value,
            cargoVendedor: document.getElementById('cargoEditar').value,
            codVendedor: document.getElementById('codVendedorEditar').value,
            valorVenda: document.getElementById('valorVendaEditar').value,
            codVenda: document.getElementById('codVendaEditar').value,
        }

        fetch(`http://localhost:5000/vendas/${venda.codVenda}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaVenda)
        }).then(() => {
            buscarVendas()
        })

        toggleModal(minhaModalEditar)
        formEditarVenda.reset();
    })
}

function excluirDados(index){
    vendas[index].codVenda = parseInt(vendas[index].codVenda)
    fetch(`http://localhost:5000/vendas/${vendas[index].codVenda}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        }).then(buscarVendas())

    renderizarTabela()
}

// Função que comunica o front-end com o back-end
function buscarVendas(){
    fetch('http://localhost:5000/vendas')
        .then(response => response.json())
        .then(dados => {
            vendas = dados
            renderizarTabela()
        })
}

function sortVendas(){
    let codVendasRepetidas = []
    let vendedores = []
    vendedor = {}

    /* Como fazer? 
    - Verificar se a pessoa já foi adicionada, se não foi, adicionar
    - Criar um objeto de vendedor, para adicionar na checagem
    - Usar .includes para verificar */
    vendas.forEach(venda =>{
        if(codVendasRepetidas.includes(venda.codVendedor)){
        vendedores.forEach(vendedor =>{
            if(venda.nomeVendedor === vendedor.nome){
                vendedor.totalVendas += venda.valorVenda
                if(venda.valorVenda > vendedor.maiorVenda){
                    vendedor.maiorVenda = venda.valorVenda
                }

                if(vendedor.cargo === 'Júnior'){
                    vendedor.comissao = vendedor.totalVendas * 0.01
                }else if(vendedor.cargo === 'Pleno'){
                    vendedor.comissao = vendedor.totalVendas * 0.02
                }else if(vendedor.cargo === 'Sênior'){
                    vendedor.comissao = vendedor.totalVendas * 0.03
                }
            }
        })
        } else{
            let nome = venda.nomeVendedor
            let cargo = venda.cargoVendedor
            let totalVendas = parseFloat(venda.valorVenda)
            let maiorVenda = parseFloat(venda.valorVenda)

            if(cargo === 'Júnior'){
                comissao = totalVendas * 0.01
            }else if(cargo === 'Pleno'){
                comissao = totalVendas * 0.02
            }else{
                comissao = totalVendas * 0.03
            }  
            vendedor = {nome, cargo, totalVendas, maiorVenda, comissao}

            vendedores.push(vendedor)
            codVendasRepetidas.push(venda.codVendedor);
        }
    })
    console.log(vendedores)
    console.log(localStorage)
    localStorage.setItem('vendas',JSON.stringify(vendedores));
    
}

function toggleModal(modal) {
    const isModal = modal.style.display === 'block'

    modal.style.display = isModal ? 'none' : 'block'
    overlay.style.display = isModal ? 'none' : 'block'
}


// Ouvidor de evento de clique dos botões
btnAdicionar.addEventListener("click", function () {
    toggleModal(minhaModal);
});

btnFechar.addEventListener("click", function () {
    toggleModal(minhaModal);
});

document.addEventListener('DOMContentLoaded', buscarVendas);

btnFecharEditar.addEventListener("click", function() {
    toggleModal(minhaModalEditar)
})
