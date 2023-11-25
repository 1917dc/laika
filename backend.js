// INCLUINDO O HTTP

const http = require('http')

// array de vendas para ser acessado pelo front end

let vendas = [
    {nomeVendedor: 'Luiz', cargoVendedor: 'pleno', codVendedor: '0', valorVenda: '1000', codVenda: '01'}
]

// CRIANDO O SERVIDOR

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

    // se o endereço './api' for executado ele retornará o array de vendas em forma de string.

    if(req.url === '/vendas' && req.method === 'GET'){
        //obter as vendas
        res.statusCode = 200
        res.end(JSON.stringify(vendas))
    } else if(req.url === '/vendas' && req.method === 'POST'){
        // adicionar vendas no back-end
        console.log('Adicionando contato') 
        let body = ''

        req.on('data', chunck => {
            body += chunck.toString()
        })
        req.on('end', () => {
            let venda = JSON.parse(body)
            vendas.push(venda);
            res.statusCode = 200
            res.end(JSON.stringify(venda))
        })
    } else if(req.url.startsWith('/vendas/') && req.method === 'PUT'){
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
                res.end(JSON.stringify({message: 'Rota não encontrada.'}))
            }
        })
    } else if(req.url.startsWith('/vendas/') && req.method === 'DELETE'){
        const nomeSearch = req.url.split('/')[2];
        const index = vendas.findIndex(venda => venda.nomeVendedor === nomeSearch)

        if(index > -1){
            vendas.splice(index, 1)
            res.statusCode = 200
            res.end(JSON.stringify({message: 'Apagado com sucesso.'}))
        } else{
            res.statusCode = 404
            res.end(JSON.stringify({message: 'Rota não encontrada.'}))
        }
        
    }
})


// localizando o servidor na porta 5000.
server.listen(5000, () => console.log('O servidor foi ligado.'))