console.log('Clovis Shoes');

const sectionProdutos = document.querySelector('.produtos');
const botaoVoltar = document.querySelector('.voltar');
const sectionDetalhesProduto = document.querySelector('.produto__detalhes');
const sectionHero = document.querySelector('.hero');

const ocultarBotaoExcecao = () => {
    botaoVoltar.style.display = 'none';
    sectionDetalhesProduto.style.display = 'none';
}

ocultarBotaoExcecao();

const formatCurrency = (number) => {
    return number.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
};

const getProducts = async () => {
    const response = await fetch('js/products.json');
    const data = await response.json();
    console.log(data);
    return data;
}

const generateCard = async () => {
    const products = await getProducts();

    products.map((product) => {
        let card = document.createElement('div');
        card.classList.add('card__produto');
        card.id = product.id;
        card.innerHTML = `<figure>
                            <img src="images/${product.image}" alt="${product.product_name}" />
                          </figure>
                          <div class="card__produto__detalhes">
                            <h4>${product.product_name}</h4>
                            <h5>${product.product_model}</h5>
                          </div>
                          <h6>${formatCurrency(product.price)}</h6>`;

        const listaProdutos = document.querySelector('.lista__produtos');
        listaProdutos.appendChild(card); 
        preencherCard(card, products);
    })
}

generateCard();

botaoVoltar.addEventListener('click', () => {
    sectionProdutos.style.display = 'flex';
    ocultarBotaoExcecao();
    resetarSelecao(radios);
});

const preencherDadosProduto = (product) => {
    //preencher imagens
    const imagens = document.querySelectorAll('.produto__detalhes__imagens figure img');
    const imagensArray = Array.from(imagens);
    imagensArray.map(imagen => {
        imagen.src = `./images/${product.image}`; 
    })

    //preencher nome, modelo e preço
    document.querySelector('.detalhes span').innerHTML = product.id;
    document.querySelector('.detalhes h4').innerHTML = product.product_name;
    document.querySelector('.detalhes h5').innerHTML = product.product_model;
    document.querySelector('.detalhes h6').innerHTML = formatCurrency(product.price);
}

// Mudar icone do details frete
/*const details = document.querySelector('details');
details.addEventListener('toggle', () => {
    const summary = document.querySelector('summary');
    summary.classList.toggle('icone-expandir');
    summary.classList.toggle('icone-recolher');
})*/

// Preenher card
const preencherCard = (card, products) => {
    card.addEventListener('click', (e) => {
        // ocultar produtos e mostrar o botão e página de detalhes do produto
        sectionProdutos.style.display = 'none';
        botaoVoltar.style.display = 'block';
        sectionDetalhesProduto.style.display = 'grid';

        //Identificar qual card foi clicado
        const cardClicado = e.currentTarget;
        const idProduto = cardClicado.id;
        const produtoClicado = products.find(product => product.id == idProduto);

        preencherDadosProduto(produtoClicado);
    })
}

// Carrinho
const btnCarrinho = document.querySelector('.btn__carrinho .icone');
const sectionCarrinho = document.querySelector('.carrinho'); 

btnCarrinho.addEventListener('click', () => {
    sectionCarrinho.style.display = 'block';
    sectionHero.style.display = 'none';
    sectionProdutos.style.display = 'none';
    sectionDetalhesProduto.style.display = 'none';
})

const btnHome = document.querySelector('.link_home');
btnHome.addEventListener('click', (event) => {
    event.preventDefault();
    sectionCarrinho.style.display = 'none';
    sectionHero.style.display = 'flex';
    sectionProdutos.style.display = 'flex';
    ocultarBotaoExcecao();
});

// Controlar seleção dos inputs radio
const radios = document.querySelectorAll('input[type="radio"]');
radios.forEach(radio => {
    radio.addEventListener('change', () => {
        const label = document.querySelector(`label[for="${radio.id}"]`);
        label.classList.add('selecionado');
        radios.forEach(radioAtual => {
            if(radioAtual !== radio) {
                const outroLabel = document.querySelector(`label[for="${radioAtual.id}"]`);
                outroLabel.classList.remove('selecionado');
            }
        });
    });
});

const resetarSelecao = (radios) => {
    radios.forEach(radio => {
        radios.forEach(radioAtual => {
            if(radioAtual !== radio) {
               const outroLabel = document.querySelector(`label[for="${radioAtual.id}"]`);
               outroLabel.classList.remove('selecionado');
            }
        })
    });
}

// Inicialização de vetor cart
const cart = [];

// Adicionar ao carrinho
const btnAddCarrinho = document.querySelector('.btn__add__cart');
btnAddCarrinho.addEventListener('click', () => {
    // Pegar dados do produto adicionado
    const produto = {
        id: document.querySelector('.detalhes span').innerHTML,
        nome: document.querySelector('.detalhes h4').innerHTML,
        modelo: document.querySelector('.detalhes h5').innerHTML,
        preco: document.querySelector('.detalhes h6').innerHTML,
        tamanho: document.querySelector('input[type="radio"][name="size"]:checked').value
    }
    cart.push(produto); // Adicionar o produto ao array cart -> carrinho
    // Ocultar botão voltar e seção detalhes_produto e exibe a seção carrinho
    ocultarBotaoExcecao();
    sectionHero.style.display = 'none';
    sectionCarrinho.style.display = 'block';

    atualizarCarrinho(cart);
    atualizarNumeroItens();
});

const corpoTabela = document.querySelector('.carrinho tbody');

const atualizarCarrinho = (cart) => {
    corpoTabela.innerHTML = ""; // Limpa as linhas da tabela
    cart.map(produto => {
        corpoTabela.innerHTML += `
            <tr>
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td class='coluna_tamanho'>${produto.tamanho}</td>
                <td class='coluna_preco'>${produto.preco}</td>
                <td class='coluna_apagar'>
                    <span class="material-symbols-outlined" data-id="${produto.id}">
                        delete
                    </span>
                </td>
            </tr>
        `;
    });

    // R$&nbsp;1.124,45 -> 1124,45
    const total = cart.reduce((valorAcumulado, item) => {
        return valorAcumulado + parseFloat(item.preco.replace('R$&nbsp;', '').replace('.','').replace(',','.'));
    }, 0);
    document.querySelector('.coluna_total').innerHTML = formatCurrency(total); // 1124,45

    acaoBotaoApagar();
}

const numeroItens = document.querySelector('.numero_itens');
numeroItens.style.display = 'none'; // Ocultar o numero_itens
const atualizarNumeroItens = () => {
    (cart.length > 0) ? numeroItens.style.display = 'block' : numeroItens.style.display = 'none';
    numeroItens.innerHTML = cart.length;
}

const acaoBotaoApagar = () => {
    const botaoApagar = document.querySelectorAll('.coluna_apagar span');
    botaoApagar.forEach(botao => {
        botao.addEventListener('click', () => {
            const id = botao.getAttribute('data-id');
            console.log(id);
            const posicao = cart.findIndex(item => item.id == id);
            cart.splice(posicao, 1);
            atualizarCarrinho(cart);
        })
    });
    atualizarNumeroItens();
}

const spanId = document.querySelector('.detalhes span');
spanId.style.display = 'none';