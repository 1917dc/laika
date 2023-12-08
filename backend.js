const sqlite3 = require('sqlite3').verbose();
// const cargo = require('cargo');
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
    console.log('Editando venda...')

    const db = new sqlite3.Database('./db.sqlite3', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Conectado ao banco de dados.');
    });

    // req.body accessa o JSON diretamente sem precisar converter manualmente
    const venda = req.body;

    db.all(`UPDATE vendas SET codVendedor = ?, nomeVendedor = ?, cargoVendedor = ?, valorVenda = ? WHERE codVenda = ?`, [
        venda.codVendedor,
        venda.nomeVendedor,
        venda.cargoVendedor,
        venda.valorVenda,
        venda.codVenda
    ], (err) => {
        if(err){
            throw err;
        } else{
            res.status(200).json(venda);
            db.close((err) =>{
                if(err){
                    throw err;
                }else{
                    console.log('(EDIT) O banco de dados foi fechado.')
                }
            })
        }
    })
}

function deleteVendas(req, res){
    console.log('Apagando venda...')

    const db = new sqlite3.Database('./db.sqlite3', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Conectado ao banco de dados.');
    });

    // req.body accessa o JSON diretamente sem precisar converter manualmente

    const venda = req.url.split('/')[2];
        console.log(req.url.split('/'));

    db.all(`DELETE FROM vendas WHERE codVenda = ?`, [venda], (err) => {
        if(err){
            throw err;
        } else{
            res.status(200);
        }
        db.close((err) =>{
            if(err){
                throw err;
            }else{
                console.log('(DELETE) O banco de dados foi fechado.')
            }
        })
    })
}

// ---------------------------------- CONFIGURANDO O SERVIDOR ----------------------------------

// Servir os arquivos estáticos localizados na pasta 'public'
app.use(express.static('public'));

// CRUD - Definir as rotas
app.get('/vendas', getVendas);
app.post('/vendas', addVendas);
app.put('/vendas/:codVenda', editVendas);
app.delete('/vendas/:codVenda', deleteVendas);

// ---------------------------------- CRIAR O SERVIDOR ----------------------------------
app.listen(port, () => console.log(`O servidor foi ligado na porta ${port}.`));
