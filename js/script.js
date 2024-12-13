// Falso banco de dados de clientes, em memória RAM
var clientes = []
var estilo = []
var academias = []

//guarda o cliente que está sendo alterado
var clienteAlterado = null

function mostrarModal(){
    const modal = document.getElementById("modal")
    modal.style.display = "block"
}

function ocultarModal(){
    const modal = document.getElementById("modal")
    modal.style.display = "none"
}

function adicionar(){
    clienteAlterado = null // marca que está adicionando um cliente
    limparFormulario() 
    mostrarModal()
}

function alterar(cpf){
    //busca o cliente que será alterado
    for(let i=0; i < clientes.length; i++){
        let cliente = clientes[i]
        if (cliente.cpf == cpf){
            document.getElementById("academia").value = cliente.gym.id
            document.getElementById("nome").value = cliente.nome
            document.getElementById("cpf").value = cliente.cpf
            document.getElementById("estilo").value = cliente.estilo || ""; // Evita valores undefined

            
            document.getElementById("peso").value = cliente.peso
            document.getElementById("altura").value = cliente.altura
            document.getElementById("dataNascimento").value = cliente.dataNascimento
            document.getElementById("sapato").value = cliente.sapato
            
            
            clienteAlterado = cliente //guarda o cliente que está sendo alterado
            mostrarModal()
        }
    }

    
}

function excluir(cpf){
    if (confirm("Deseja realmente excluir este body builder?")){
        fetch('http://localhost:3000/body-builder/' + cpf, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        }).then(() => {
            alert("Excluído com sucesso")
            carregarClientes()
        }).catch((error) => {
            alert("Erro ao cadastrar")
        })
    }
}

function salvar(){
    let idAcademia = document.getElementById("academia").value
    let cpf = document.getElementById("cpf").value
    let nome = document.getElementById("nome").value
    
    
    let estilo = document.getElementById("estilo").value

    let peso = document.getElementById("peso").value
    let altura = document.getElementById("altura").value
    let dataNascimento = document.getElementById("dataNascimento").value
    let sapato = document.getElementById("sapato").value
    

    let novoBodyBuilder = {
        idAcademia: idAcademia,
        nome: nome,
        cpf: cpf,
        estilo: estilo,
        
        peso: peso,
        altura: altura,
        dataNascimento: dataNascimento,
        sapato: sapato,
        
    }

    //se clienteAlterado == null, então está adicionando um novo cliente
    if (clienteAlterado == null){
        fetch('http://localhost:3000/body-builder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(novoBodyBuilder)
        }).then(() => {
            alert("Cadastrado com sucesso")
        }).catch((error) => {
            alert("Erro ao cadastrar")
        })
    }else{ //senao está alterando um cliente
        fetch('http://localhost:3000/body-builder/' + clienteAlterado.cpf, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(novoBodyBuilder)
        }).then(() => {
            alert("Alterado com sucesso")
        }).catch((error) => {
            alert("Erro ao alterar")
        })
    }
    
    ocultarModal()

    limparFormulario()

    carregarClientes()
    return false
}

function limparFormulario(){
    document.getElementById("academia").value = ""
    document.getElementById("nome").value = ""
    document.getElementById("cpf").value = ""
    document.getElementById("estilo").value = ""
    document.getElementById("peso").value = ""
    document.getElementById("altura").value = ""
    document.getElementById("dataNascimento").value = ""
    document.getElementById("sapato").value = ""
}

function atualizarLista(){
    let tbody = document.getElementsByTagName("tbody")[0]; // pega o primeiro tbody da página
    tbody.innerHTML = ""; // limpa as linhas da tabela

    for (let i = 0; i < clientes.length; i++) {
        let cliente = clientes[i];

        // Verifica se o estilo existe, usa valor padrão se estiver ausente
        let estilo = cliente.estilo || "Estilo não informado";

        let linhaTabela = document.createElement("tr");
        linhaTabela.innerHTML = `
            <td>${cliente.gym.nome}</td>
            <td>${cliente.cpf}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.estilo}</td>
            <td>${cliente.peso}kg</td>
            <td>${cliente.altura}m</td>
            <td>${cliente.dataNascimento}</td>
            <td>${cliente.sapato}</td>
            <td>
                <button onclick="alterar('${cliente.cpf}')">Alterar</button>
                <button onclick="excluir('${cliente.cpf}')">Excluir</button>
            </td>`;

        tbody.appendChild(linhaTabela);
    }
}



function carregarClientes(){
    fetch('http://localhost:3000/body-builder', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors'
    }).then((response) => response.json())
    .then((data) => {
        // console.log(data)
        clientes = data //recebe a lista de clientes do back
        atualizarLista()
    }).catch((error) => {
        console.log(error)
        alert("Erro ao listar clientes")
    })
}

function carregarAcademias(){
    fetch('http://localhost:3000/gym', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors'
    }).then((response) => response.json())
    .then((data) => {
        // console.log(data)
        academias = data //recebe a lista de clientes do back
        atualizarListaAcademias()
    }).catch((error) => {
        console.log(error)
        alert("Erro ao listar academias")
    })
}

function atualizarListaAcademias(){
    let listaAcademia = document.getElementById("academia")
    for(let i = 0; i < academias.length; i++){
        let academia = academias [i]
        let option = document.createElement("option")
        option.value = academia.id
        option.innerHTML = academia.nome
        listaAcademia.appendChild(option)
}}
