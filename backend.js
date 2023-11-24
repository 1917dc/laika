// INCLUINDO O HTTP

const http = require('http')

// array de vendas para ser acessado pelo front end

let vendas = [
    {nome: 'Luiz', cargo: 'pleno', codVendedor: '0', valVenda: '1000', codVenda: '01'}
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
    }
})


// localizando o servidor na porta 5000.
server.listen(5000, () => console.log('O servidor foi ligado.'))