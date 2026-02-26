import { carregarTransacoes, salvarTransacoes } from "./modules/storage.js";
import { inicializarPopUp } from "./modules/editTransaction.js";
import { calcularReceitas, calcularDespesas, calcularSaldoTotal, mostrarReceitas, mostrarDespesas, mostrarSaldoTotal } from "./modules/transactions.js";
// Captura de elementos
const tipoTransacaoSelect = document.getElementById("tipo-transacao");
const categoriaBotoes = document.querySelectorAll(".categorias");
const inputHidden = document.getElementById("categoria-selecionada");
const listaTransacoesEl = document.querySelector(".lista-transacoes");
if (!tipoTransacaoSelect || !inputHidden || !listaTransacoesEl) {
    throw new Error("Elementos essenciais do formulário não encontrados.");
}
let categoriaSelecionada = "";
// Eventos de seleção de categoria
categoriaBotoes.forEach((botao) => {
    botao.addEventListener("click", () => {
        // Remove classe ativa de todos
        categoriaBotoes.forEach((b) => b.classList.remove("ativa"));
        // Marca clicado
        botao.classList.add("ativa");
        const valor = botao.dataset.value;
        if (!valor)
            return;
        categoriaSelecionada = valor;
        inputHidden.value = categoriaSelecionada;
        console.log("Categoria selecionada:", categoriaSelecionada);
    });
});
// Tipo de transação
tipoTransacaoSelect.addEventListener("change", () => {
    console.log("Tipo selecionado:", tipoTransacaoSelect.value);
});
// Estado principal
let transacoes = carregarTransacoes();
console.log("Transações carregadas:", transacoes);
const abrirPopUp = inicializarPopUp(transacoes, renderizarTransacoes, atualizarDados);
// Renderizar transações
function renderizarTransacoes() {
    listaTransacoesEl.innerHTML = "";
    transacoes.forEach((transacao, index) => {
        const li = document.createElement("li");
        li.classList.add("transacao-Item");
        li.innerHTML =
            `<span>${transacao.descricao}</span>` +
                `<span>${transacao.categoria}</span>` +
                `<span>${new Date(transacao.data).toLocaleDateString()}</span>` +
                `<span>${transacao.quantidade.toFixed(2)} €</span>`;
        // Botão apagar
        const botaoApagar = document.createElement("button");
        botaoApagar.textContent = "x";
        botaoApagar.classList.add("botao-apagar");
        botaoApagar.addEventListener("click", (event) => {
            event.stopPropagation();
            transacoes.splice(index, 1);
            salvarTransacoes(transacoes);
            atualizarDados();
        });
        // Abrir popup ao clicar na transação
        li.addEventListener("click", () => abrirPopUp(transacao, index));
        li.appendChild(botaoApagar);
        listaTransacoesEl.appendChild(li);
    });
}
// Adicionar transação
function adicionarTransacao() {
    const descricaoInput = document.getElementById("descricao");
    const quantidadeInput = document.getElementById("quantidade");
    const descricao = descricaoInput.value.trim();
    const quantidade = Number(quantidadeInput.value);
    const tipo = tipoTransacaoSelect.value;
    const categoria = inputHidden.value;
    // Validações
    if (descricao.length < 3)
        return alert("Escreva de novo, com mínimo 3 letras!");
    if (isNaN(quantidade) || quantidade <= 0)
        return alert("Insira um número positivo!");
    if (tipo !== "receita" && tipo !== "despesa")
        return alert("Selecione um tipo de transação!");
    if (!categoria)
        return alert("Escolha uma categoria!");
    if (tipo === "receita" && !["Salário", "Outros"].includes(categoria)) {
        return alert("Para receita, apenas 'Salário' ou 'Outros' são permitidos!");
    }
    if (tipo === "despesa" && !["Entretenimento", "Comida", "Faturas", "Lazer", "Outros"].includes(categoria)) {
        return alert("Para despesa, apenas categorias válidas!");
    }
    const novaTransacao = {
        descricao,
        quantidade,
        tipo,
        categoria,
        data: new Date().toISOString(),
    };
    transacoes.push(novaTransacao);
    salvarTransacoes(transacoes);
    atualizarDados();
    // Limpar inputs
    descricaoInput.value = "";
    quantidadeInput.value = "";
    tipoTransacaoSelect.value = "";
    inputHidden.value = "";
    categoriaBotoes.forEach((b) => b.classList.remove("ativa"));
}
// Eventos de botões
const btnAdicionar = document.querySelector(".adiciona-historia");
btnAdicionar === null || btnAdicionar === void 0 ? void 0 : btnAdicionar.addEventListener("click", adicionarTransacao);
const btnAdicionarIcon = document.querySelector(".nova-transacao-icon");
btnAdicionarIcon === null || btnAdicionarIcon === void 0 ? void 0 : btnAdicionarIcon.addEventListener("click", adicionarTransacao);
// Atualizar dados 
function atualizarDados() {
    renderizarTransacoes();
    calcularReceitas();
    calcularDespesas();
    calcularSaldoTotal();
    mostrarReceitas();
    mostrarDespesas();
    mostrarSaldoTotal();
}
atualizarDados();
// Menu hamburger
const hamburger = document.getElementById("hamburger");
const sidebar = document.querySelector(".sidebar");
const overlay = document.getElementById("overlay");
function toggleMenu() {
    sidebar === null || sidebar === void 0 ? void 0 : sidebar.classList.toggle("active");
    overlay === null || overlay === void 0 ? void 0 : overlay.classList.toggle("active");
}
function fecharMenu() {
    sidebar === null || sidebar === void 0 ? void 0 : sidebar.classList.remove("active");
    overlay === null || overlay === void 0 ? void 0 : overlay.classList.remove("active");
}
hamburger === null || hamburger === void 0 ? void 0 : hamburger.addEventListener("click", toggleMenu);
overlay === null || overlay === void 0 ? void 0 : overlay.addEventListener("click", fecharMenu);
document.querySelectorAll(".menu-itens").forEach((item) => item.addEventListener("click", fecharMenu));
//# sourceMappingURL=main.js.map