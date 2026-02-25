interface Transacao {
        descricao: string;
        quantidade: number;
        tipo: "receita" | "despesa";
        categoria: string;
        data: string | Date;
    }

const tipoTransacaoValue = document.getElementById("tipo-transacao") as HTMLSelectElement;

tipoTransacaoValue.addEventListener("change", () => {
    console.log(tipoTransacaoValue.value);
});

const categoriaBotao = document.querySelectorAll<HTMLButtonElement>(".categorias");
const inputHidden = document.getElementById("categoria-selecionada") as HTMLInputElement;

let categoriaSelecionada = "";

categoriaBotao.forEach(botao => {
    botao.addEventListener("click", () => {
        categoriaBotao.forEach(b => b.classList.remove("ativa"));
        botao.classList.add("ativa");
        if(botao.dataset.value){
            categoriaSelecionada = botao.dataset.value;
            inputHidden.value = categoriaSelecionada;
            console.log("Categoria selecionada:", categoriaSelecionada);
        }
        
    })
})

const listaTransacoes = document.querySelector(".lista-transacoes") as HTMLUListElement;


// 5) Estado principal
let transacoes: Transacao[] = carregarTransacoes();
console.log("Transações carregadas:", transacoes);

const abrirPopUp = inicializarPopUp(
    transacoes,
    renderizarTransacoes,
    atualizarDados
);

//função para re-renderizar a lista com botão para apagar
function renderizarTransacoes() {
    listaTransacoes.innerHTML = "";

    transacoes.forEach((transacao: Transacao, index: number) => {

        const transacaoListItem = document.createElement("li");
        transacaoListItem.classList.add("transacao-Item");

        transacaoListItem.innerHTML =
            '<span>' + transacao.descricao + '</span>' +
            '<span>' + transacao.categoria + '</span>' +
            '<span>' + new Date(transacao.data).toLocaleDateString() + '</span>' +
            '<span>' + transacao.quantidade + " €" + '</span>';

        const botaoApagar = document.createElement("button");
        botaoApagar.textContent = "x";
        botaoApagar.classList.add("botao-apagar");

    
        botaoApagar.addEventListener("click", (event: MouseEvent) => {
            event.stopPropagation(); 

            transacoes.splice(index, 1);
            salvarTransacoes(transacoes);
            atualizarDados();
        });

        transacaoListItem.addEventListener("click", () => {
            abrirPopUp(transacao, index);
            console.log("pop-up abrir")
        });

        transacaoListItem.appendChild(botaoApagar);
        listaTransacoes.appendChild(transacaoListItem);
    });
}


// Renderiza transações guardadas ao iniciar
renderizarTransacoes();

//função para adicionar transação ✔
function adicionarTransacao(){
    const descricaoInput = document.getElementById("descricao") as HTMLInputElement;
    const quantidadeInput = document.getElementById("quantidade") as HTMLInputElement;

    const descricaoValue: string = descricaoInput.value.trim()
    if (descricaoValue.length < 3) {
        alert("Escreva de novo, com mínimo 3 letras!");
        return;
    } 
    if (descricaoValue == "") {
        alert("Escreva algo!");
        return;
    }

    const quantidadeValue: number = quantidadeInput.value ;

    if(quantidadeValue <= 0 || isNaN(quantidadeValue)){
        alert("Insira um número positivo, maior que zero!");
        return;            
    }

    const tipoTransacaoSelecionado: "receita" | "despesa" = tipoTransacaoValue.value as "receita" | "despesa";

    if(!tipoTransacaoSelecionado){
        alert("Selecione um tipo de transação!");
        return;
    }

    const categoriaValue: string = inputHidden.value;

    if(!categoriaValue){
        alert("Escolha uma categoria!");
        return;
    }

    if (tipoTransacaoSelecionado === "receita") {
        const categoriasPermitidas = ["Salário", "Outros"];
        if (!categoriasPermitidas.includes(categoriaValue)) {
            alert("Para uma receita, apenas 'Salário' ou 'Outros' são permitidos como categoria!");
            return; 
        }
    }

    if (tipoTransacaoSelecionado === "despesa") {
        const categoriasPermitidas = ["Entretenimento", "Comida", "Faturas", "Lazer", "Outros"];
        if (!categoriasPermitidas.includes(categoriaValue)){
            alert("Para uma despesa, apenas 'Entretenimento', 'Comida', 'Faturas', 'Lazer' ou 'Outros' são permitidos como categoria!");
            return;
        }
    }

    // console.log({
    //     descricao: descricaoValue,
    //     quantidade: quantidadeValue,
    //     tipo: tipoTransacaoSelecionado,
    //     categoria: categoriaValue
    // });

    const novaTransacao: Transacao = {
        descricao: descricaoValue,              
        quantidade: quantidadeValue,    
        tipo: tipoTransacaoSelecionado,        
        categoria: categoriaValue,              
        data: new Date()                        
    };

    transacoes.push(novaTransacao);
    salvarTransacoes(transacoes);
    renderizarTransacoes();

    //Limpar Inputs
    descricaoInput.value = "";
    quantidadeInput.value = "";
    tipoTransacaoValue.value = "";
    inputHidden.value = "";
    categoriaBotao.forEach(botao => {
        botao.classList.remove("ativa");
    });

    atualizarDados();
}

// 2) Escutar clique do botão ✔
const adicionaHistoria = document.querySelector(".adiciona-historia") as HTMLButtonElement | null;
if(adicionaHistoria){
    adicionaHistoria.addEventListener("click",() => {
        adicionarTransacao();
    });
}

const adicionaTransacaoIcon = document.querySelector(".nova-transacao-icon") as HTMLButtonElement | null;
if(adicionaTransacaoIcon){
    adicionaTransacaoIcon.addEventListener("click", () => {
        adicionarTransacao();
    });
}


//função que mostra e atualiza o saldo total, o total de receitas e o total de despesas

function atualizarDados(){
    renderizarTransacoes();

    calcularReceitas();
    calcularDespesas();
    calcularSaldoTotal();

    mostrarReceitas();
    mostrarDespesas();
    mostrarSaldoTotal();
}

atualizarDados();

//menu hamburger

const hamburger = document.getElementById("hamburger");
const sidebar = document.querySelector(".sidebar");
const overlay = document.getElementById("overlay");

function toggleMenu() {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
}

function fecharMenu() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
}

hamburger.addEventListener("click", toggleMenu);
overlay.addEventListener("click", fecharMenu); //fecha ao clicar no overlay (fora do sidebar)

// Fecha ao clicar num item do menu
document.querySelectorAll(".menu-itens").forEach(item => {
    item.addEventListener("click", fecharMenu);
});