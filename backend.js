const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const app = express();
const port = 5000;
//const http = require('http')

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
            console.log('O banco de dados foi conectado')
            res.statusCode = 200
            res.end(JSON.stringify(vendas))
        }
    })
    db.close((err) => {
        if(err){
            console.log('Erro', err)
        } else{
            console.log('O banco de dados foi fechado')
        }
    })
}

function addVendas(req, res){
    // adicionar vendas no back-end
    console.log('Adicionando contato') 

    const db = new sqlite3.Database('./db.sqlite3', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Conectado ao banco de dados.');
    });

    let body = ''
    req.on('data', chunck => body += chunck.toString())
    req.on('end', () =>{
        let venda = JSON.parse(body)
        db.all(`INSERT INTO vendas (nomeVendedor, cargoVendedor, codVendedor, valorVenda, codVenda) VALUES (?, ?, ?, ?, ?)`, [
            venda.nomeVendedor,
            venda.cargoVendedor,
            venda.codVendedor,
            venda.valorVenda,
            venda.codVenda
            ], (err) =>{
        
            if(err){
                console.log('Erro', err)
            } else{
                res.statusCode = 200
                res.end(JSON.stringify(venda))
                db.close((err) => {
                    if(err){
                        console.log('Erro', err)
                    } else{
                        console.log('O banco de dados foi fechado')
                    }
                })
            }
        })
    })
}

function editVendas(req, res){

    req.on('data', chunck => body += chunck.toString())
    req.on('end', () =>{
        let venda = JSON.parse(body)
        db.all(`UPDATE INTO vendas (nomeVendedor, cargoVendedor, codVendedor, valorVenda, codVenda) VALUES (?,?,?,?,?)`, [
            venda.nomeVendedor,
            venda.cargoVendedor,
            venda.codVendedor,
            venda.valorVenda,
            venda.codVenda
        ], (err) =>{
        
            if(err){
                console.log('Erro', err)
            } else{
                res.statusCode = 200
                res.end(JSON.stringify(venda))
                db.close((err) => {
                    if(err){
                        console.log('Erro', err)
                    } else{
                        console.log('O banco de dados foi fechado')
                    }
                })
            }
        })
    })

    const nomeSearch = req.url.split('/')[2];
    console.log(req.url.split('/'));
    let body = ''
    req.on('data', chunck => {
        body += chunck.toString()
    })
    req.on('end', () => {
        const index = vendas.findIndex(venda => venda.nomeVendedor === nomeSearch)
        if(index > -1){
            vendas[index] = JSON.parse(body);
            res.statusCode = 200
            res.end(JSON.stringify(vendas[index]))
        } else{
            res.statusCode = 404
            res.end(JSON.stringify({message: 'Rota n�o encontrada.'}))
        }
    })
}

function deleteVendas(req, res){
    const nomeSearch = req.url.split('/')[2];
    const index = vendas.findIndex(venda => venda.nomeVendedor === nomeSearch)

    if(index > -1){
        vendas.splice(index, 1)
        res.statusCode = 200
        res.end(JSON.stringify({message: 'Apagado com sucesso.'}))
    } else{
        res.statusCode = 404
        res.end(JSON.stringify({message: 'Rota n�o encontrada.'}))
    }
}

// ---------------------------------- CONFIGURANDO O SERVIDOR ----------------------------------

// Serve static files located in the "public" folder using Express
app.use(express.static('public'));

// Define routes
app.get('/vendas', getVendas);
app.post('/vendas', addVendas);
app.put('/vendas/:nomeVendedor', editVendas);
app.delete('/vendas/:nomeVendedor', deleteVendas);

/*
const server = http.createServer(function(req, res){
    // CORS PARA PREVINIR ERROS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.statusCode = 204; // No Content
        res.end();
        return;
    }

    res.setHeader('Content-Type', 'application/json')

    // se o endere�o './api' for executado ele retornar� o array de vendas em forma de string.

    if(req.url === '/vendas' && req.method === 'GET'){
        getVendas(req, res)
        
        // //obter as vendas
        // res.statusCode = 200
        // res.end(JSON.stringify(vendas))
    } else if(req.url === '/vendas' && req.method === 'POST'){
        addVendas(req, res);

        // // adicionar vendas no back-end
        // console.log('Adicionando contato') 
        // let body = ''

        // req.on('data', chunck => {
        //     body += chunck.toString()
        // })
        // req.on('end', () => {
        //     let venda = JSON.parse(body)
        //     vendas.push(venda);
        //     res.statusCode = 200
        //     res.end(JSON.stringify(venda))
        // })
    } else if(req.url.startsWith('/vendas/') && req.method === 'PUT'){
        editVendas(req, res);

        // const nomeSearch = req.url.split('/')[2];
        // console.log(req.url.split('/'));
        // let body = ''
        // req.on('data', chunck => {
        //     body += chunck.toString()
        // })
        // req.on('end', () => {
        //     const index = vendas.findIndex(venda => venda.nomeVendedor === nomeSearch)
        //     if(index > -1){
        //         vendas[index] = JSON.parse(body);
        //         res.statusCode = 200
        //         res.end(JSON.stringify(vendas[index]))
        //     } else{
        //         res.statusCode = 404
        //         res.end(JSON.stringify({message: 'Rota n�o encontrada.'}))
        //     }
        // })
    } else if(req.url.startsWith('/vendas/') && req.method === 'DELETE'){
        deleteVendas(req, res);

    //     const nomeSearch = req.url.split('/')[2];
    //     const index = vendas.findIndex(venda => venda.nomeVendedor === nomeSearch)

    //     if(index > -1){
    //         vendas.splice(index, 1)
    //         res.statusCode = 200
    //         res.end(JSON.stringify({message: 'Apagado com sucesso.'}))
    //     } else{
    //         res.statusCode = 404
    //         res.end(JSON.stringify({message: 'Rota n�o encontrada.'}))
    //     }
        
    // }
    }
})
*/

// ---------------------------------- CRIANDO O SERVIDOR ----------------------------------
// Localizado na porta 5000
/*
server.listen(5000, () => console.log('O servidor foi ligado.'))
*/

app.listen(port, () => console.log(`O servidor foi ligado na porta ${port}.`));
