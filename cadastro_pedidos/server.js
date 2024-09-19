const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const cors = require('cors');  // Para habilitar o CORS e permitir o acesso pelo frontend

// Configuração de conexão com o banco de dados SQL Server
const dbConfig = {
    user: 'kaua',
    password: '123',
    server: '195.200.6.31',
    port: 1433,
    database: 'cadastro_pedidos',
    options: {
        encrypt: false, // Para Azure ou se seu servidor exigir criptografia
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

// Função para conectar ao banco de dados (DAO Pattern)
async function connectToDB() {
    try {
        await sql.connect(dbConfig);
        console.log("Conectado ao SQL Server");
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados', err);
    }
}

// Função para inserir dados do cliente e pedido no banco de dados (DAO)
async function cadastrarClientePedido(cliente, pedido) {
    try {
        const pool = await sql.connect(dbConfig);

        const clienteResult = await pool.request()
            .input('nome', sql.NVarChar, cliente.nome)
            .input('email', sql.NVarChar, cliente.email)
            .input('DDD', sql.NVarChar, cliente.DDD)
            .input('telefone', sql.NVarChar, cliente.telefone)
            .input('cpf', sql.NVarChar, cliente.cpf)
            .input('data_nascimento', sql.Date, cliente.dataNascimento)
            .query('INSERT INTO Clientes (nome, email, DDD, telefone, cpf, data_nascimento) OUTPUT INSERTED.Id VALUES (@nome, @email, @DDD, @telefone, @cpf, @data_nascimento)');

        const clienteId = clienteResult.recordset[0].Id;

        await pool.request()
            .input('produto', sql.NVarChar, pedido.produto)
            .input('quantidade', sql.Int, pedido.quantidade)
            .input('valorTotal', sql.Decimal(10, 2), pedido.valorTotal)
            .input('dataPedido', sql.Date, pedido.dataPedido)
            .input('vendedor', sql.NVarChar, pedido.vendedor)
            .input('clienteId', sql.Int, clienteId)
            .query('INSERT INTO Pedidos (Produto, Quantidade, ValorTotal, DataPedido, Vendedor, ClienteId) VALUES (@produto, @quantidade, @valorTotal, @dataPedido, @vendedor, @clienteId)');

        return { sucesso: true, mensagem: 'Cadastro realizado com sucesso!' };
    } catch (err) {
        console.error('Erro ao cadastrar cliente e pedido', err);
        throw err;
    }
}

const app = express();
app.use(bodyParser.json());
app.use(cors());  // Habilitar CORS para permitir requisições do frontend

app.post('/cadastro', async (req, res) => {
    const { nome, email, telefone, cpf, dataNascimento, produto, quantidade, valorTotal, dataPedido, vendedor } = req.body;

    const cliente = { nome, email, telefone, cpf, dataNascimento };
    const pedido = { produto, quantidade, valorTotal, dataPedido, vendedor };

    try {
        const resultado = await cadastrarClientePedido(cliente, pedido);
        res.send(resultado.mensagem);
    } catch (err) {
        res.status(500).send('Erro ao cadastrar.');
    }
});

// Inicializa o servidor na porta 3000
app.listen(3000, async () => {
    await connectToDB();
    console.log('Servidor rodando na porta 3000');

    
});
