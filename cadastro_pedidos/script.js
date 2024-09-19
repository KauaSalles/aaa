document.getElementById('formCadastro').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const cpf = document.getElementById('cpf').value;
    const dataNascimento = document.getElementById('dataNascimento').value;
    const produto = document.getElementById('produto').value;
    const quantidade = document.getElementById('quantidade').value;
    const valorTotal = document.getElementById('valorTotal').value;
    const dataPedido = document.getElementById('dataPedido').value;
    const vendedor = document.getElementById('vendedor').value;

    const data = {
        nome,
        email,
        telefone,
        cpf,
        dataNascimento,
        produto,
        quantidade,
        valorTotal,
        dataPedido,
        vendedor
    };

    try {
        const response = await fetch('http://localhost:5500/cadastro_pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.text();
        alert(result);
    } catch (error) {
        alert('Erro ao enviar os dados: ' + error);
    }



    alert('Cadastro realizado com sucesso!');
});


document.addEventListener('DOMContentLoaded', function () {
    const telefoneInput = document.getElementById('telefone');
    const cpfInput = document.getElementById('cpf');

    // Máscara para o campo de telefone (11 dígitos)
    telefoneInput.addEventListener('input', function (e) {
        let telefone = e.target.value.replace(/\D/g, ''); 
        
        if (telefone.length > 11) {
            telefone = telefone.slice(0, 11); 
        }
        
        telefone = telefone.replace(/^(\d{2})(\d)/g, '($1) $2'); 
        telefone = telefone.replace(/(\d{5})(\d{4})$/, '$1-$2');
        e.target.value = telefone;
    });

   
    cpfInput.addEventListener('input', function (e) {
        let cpf = e.target.value.replace(/\D/g, ''); 
        
        if (cpf.length > 11) {
            cpf = cpf.slice(0, 11); 
        }
        
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); 
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); 
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); 
        e.target.value = cpf;
    });
});


document.getElementById('valorTotal').addEventListener('input', function(e) {
    let valor = e.target.value.replace(/\D/g, ''); 
    valor = (valor / 100).toFixed(2) + ''; 
    valor = valor.replace('.', ','); 
    valor = valor.replace(/(\d)(?=(\d{3})+\,)/g, "$1."); 
    e.target.value = 'R$ ' + valor;
});

quantidadeInput.addEventListener('input', function (e) {
    if (e.target.value < 1) {
        e.target.value = 1; // Se o valor for menor que 1, define como 1
    }
});
