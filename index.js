const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORTA = 3000;

// Configuração do motor de visualização e recebimento de dados
app.set('view engine', 'ejs');
app.set('views', './views')
app.use(express.urlencoded({ extended: true }));

// Inicialização e conexão com o banco de dados
const db = new sqlite3.Database('gamevault.db', (err) => {
    if (err) {
        console.error('Erro ao conectar com o banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        
        // TODO: Escreva a query SQL para criar a tabela 'jogos'
        // Dica: Use o comando CREATE TABLE IF NOT EXISTS.
        // A tabela deve ter as colunas:
        // - id (INTEGER PRIMARY KEY AUTOINCREMENT)
        // - titulo (TEXT)
        // - plataforma (TEXT)
        // - status (TEXT)
        // - nota (INTEGER)
        // - capa_url (TEXT)
        
        const queryCriacao = `CREATE TABLE IF NOT EXISTS jogos (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                titulo TEXT,
                                plataforma TEXT,
                                status TEXT,
                                nota INTEGER,
                                capa_url TEXT);`; // Escreva sua query aqui
        
        db.run(queryCriacao, (err) => {
            if(err) console.error("Erro ao criar tabela:", err.message);
        });
    }
});

// Rota GET para exibir o formulário
app.get('/cadastrar', (req, res) => {
    // TODO: Use res.render() para renderizar a página 'cadastro.ejs'
    res.render('cadastro')
});

// Rota POST para processar o formulário
app.post('/adicionar', (req, res) => {
    // Os dados do formulário chegam aqui através do req.body
    const { titulo, plataforma, status, nota, capa_url } = req.body;

    // TODO: Escreva a query SQL de inserção
    // Dica: Use INSERT INTO... e não se esqueça dos placeholders (?)
    const query = `INSERT INTO jogos (titulo,plataforma,status,nota,capa_url) VALUES (?,?,?,?,?);`; 
    
    db.run(query,[titulo, plataforma, status, nota, capa_url],(err) => {

        if(err) {
            console.error('erro ao inserir dados: ' + err.message)
            return res.send('erro ao inserir dados')
        }
        res.redirect('/')
    })
    // TODO: Execute a query usando db.run()
    // Passe o array com as variáveis na ordem correta: [titulo, plataforma, status, nota, capa_url]
    // No callback de sucesso, use res.redirect('/') para voltar à página principal.
});

app.get('/', (req, res) => {
    
    // TODO: Escreva a query SQL para buscar todos os jogos
    const query = `SELECT id, titulo, capa_url, nota, status FROM jogos;`; 
    
    db.all(query, (err,rows) => {

        if(err) {
            console.error('erro ao buscar dados: ' + err.message)
            return res.send('erro ao buscar dados')

        }
        res.render('index',{jogos: rows})
    })

    // TODO: Execute a query usando db.all()
    // No callback, caso não haja erro, use res.render() para renderizar a página 'index.ejs'
    // Lembre-se de passar o array de resultados (rows) em um objeto, por exemplo: { jogos: rows }
    
});

// Usamos GET aqui para simplificar a exclusão direta via tag <a> do HTML.
app.get('/deletar/:id', (req, res) => {
    // Capturamos o parâmetro dinâmico da URL
    const idDoJogo = req.params.id;
    
    // TODO: Escreva a query SQL para deletar um registro específico
    // Dica: DELETE FROM ... WHERE ...
    const query = `DELETE FROM jogos WHERE id = ?;`;

    db.run(query, [idDoJogo], (err) => {

        if(err) {
            console.error('erro ao deletar dados: '.err.message)
            return res.send('erro ao deletar dados')
        }

        res.redirect('/')
    })
    
    // TODO: Execute a query usando db.run() passando o [idDoJogo]
    // No callback, após deletar com sucesso, use res.redirect('/')
});

// O servidor ficará ouvindo a porta 3000
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});