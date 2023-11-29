const sqlite3 = require('sqlite3').verbose();
const express = require('express'); 

// Essa função retorna uma instância de um aplicativo Express
const app = express(); 
const port = 5000;

// Middleware - Tem acesso aos objetos de req e res
app.use(express.json()); // Analisa requisições JSON e cabeçalhos recebidos

// ---------------------------------- BANCO DE DADOS ---------------------------------- 

// Obter as vendas
function getVendas(req, res){

    const db = new sqlite3.Database('./db.sqlite3', function(err){
        if (err) {
            console.error(err.message);
        }
        console.log('Conectado ao banco de dados.');
    });

    db.all(`SELECT * FROM vendas`, [], (err, rows) =>{
        
        if(err){
            console.log('Erro', err)
        } else{
            vendas = rows;
            console.log('(GET) O banco de dados foi conectado.')
            res.statusCode = 200
            res.end(JSON.stringify(vendas))
        }
    })
    db.close((err) => {
        if(err){
            console.log('Erro', err)
        } else{
            console.log('(GET) O banco de dados foi fechado.')
        }
    })
}

// Adicionar vendas no back-end
function addVendas(req, res){
    console.log('Adicionando venda...') 

    const db = new sqlite3.Database('./db.sqlite3', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Conectado ao banco de dados.');
    });

    // req.body accessa o JSON diretamente sem precisar converter manualmente
    const venda = req.body;

    db.all(`INSERT INTO vendas (nomeVendedor, cargoVendedor, codVendedor, valorVenda, codVenda) VALUES (?, ?, ?, ?, ?)`, [
            venda.nomeVendedor,
            venda.cargoVendedor,
            venda.codVendedor,
            venda.valorVenda,
            venda.codVenda
        ], 
        (err) =>{
            if(err){
                console.log('Erro', err)
            } else{
                res.status(200).json(venda);
                db.close((err) => {
                    if(err){
                        console.log('Erro', err)
                    } else{
                        console.log('(ADD) O banco de dados foi fechado.')
                    }
                })
            }
    })
}

function editVendas(req, res) {
    const nomeSearch = req.params.nomeVendedor; 
    const venda = req.body;

    const db = new sqlite3.Database('./db.sqlite3', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Conectado ao banco de dados.');
    });

    db.run(
        `UPDATE vendas SET nomeVendedor=?, cargoVendedor=?, codVendedor=?, valorVenda=?, codVenda=? WHERE nomeVendedor=?`,
        [
            venda.nomeVendedor,
            venda.cargoVendedor,
            venda.codVendedor,
            venda.valorVenda,
            venda.codVenda,
            nomeSearch,
        ],
        (err) => {
            if (err) {
                console.log('Erro', err);
            } else {
                res.status(200).json(venda);
                db.close((err) => {
                    if (err) {
                        console.log('Erro', err);
                    } else {
                        console.log('(EDIT) O banco de dados foi fechado.');
                    }
                });
            }
        }
    );
}

function deleteVendas(req, res){
    const nomeSearch = req.params.nomeVendedor;
    const index = vendas.findIndex(venda => venda.nomeVendedor === nomeSearch)

    if(index > -1){
        vendas.splice(index, 1)
        res.statusCode = 200
        res.status(200).json({ message: 'Apagado com sucesso.' });
    } else{
        res.statusCode = 404
        res.status(404).json({ message: 'Rota não encontrada.' });
    }
}

// ---------------------------------- CONFIGURANDO O SERVIDOR ----------------------------------

// Servir os arquivos estáticos localizados na pasta 'public'
app.use(express.static('public'));

// CRUD - Definir as rotas
app.get('/vendas', getVendas);
app.post('/vendas', addVendas);
app.put('/vendas/:nomeVendedor', editVendas);
app.delete('/vendas/:nomeVendedor', deleteVendas);

// ---------------------------------- CRIAR O SERVIDOR ----------------------------------
app.listen(port, () => console.log(`O servidor foi ligado na porta ${port}.`));
