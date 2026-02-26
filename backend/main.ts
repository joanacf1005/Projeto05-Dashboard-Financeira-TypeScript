import { Transacao } from "./modules/types.js";
import { carregarTransacoes, salvarTransacoes } from "./modules/storage.js";
import { inicializarPopUp } from "./modules/editTransaction.js";
import { calcularReceitas, calcularDespesas, calcularSaldoTotal, mostrarReceitas, mostrarDespesas, mostrarSaldoTotal} from "./modules/transactions.js";


// Captura de elementos

const tipoTransacaoSelect = document.getElementById("tipo-transacao") as HTMLSelectElement;
const categoriaBotoes = document.querySelectorAll<HTMLButtonElement>(".categorias");
const inputHidden = document.getElementById("categoria-selecionada") as HTMLInputElement;
const listaTransacoes = document.querySelector(".lista-transacoes") as HTMLUListElement;

if (!tipoTransacaoSelect || !inputHidden || !listaTransacoes) {
  throw new Error("Elementos essenciais do formulário não encontrados.");
}

let categoriaSelecionada = "";


// Eventos de seleção de categoria

categoriaBotoes.forEach((botao) => {
  botao.addEventListener("click", () => {
    categoriaBotoes.forEach((b) => b.classList.remove("ativa"));

    botao.classList.add("ativa");

    const valor = botao.dataset.value;
    if (!valor) return;

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

let transacoes: Transacao[] = carregarTransacoes();
console.log("Transações carregadas:", transacoes);

const abrirPopUp = inicializarPopUp(transacoes, renderizarTransacoes, atualizarDados);


// Renderizar transações

function renderizarTransacoes(): void {
  listaTransacoes.innerHTML = "";

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
    listaTransacoes.appendChild(li);
  });
}


// Adicionar transação

function adicionarTransacao(): void {
  const descricaoInput = document.getElementById("descricao") as HTMLInputElement;
  const quantidadeInput = document.getElementById("quantidade") as HTMLInputElement;

  const descricao = descricaoInput.value.trim();
  const quantidade = Number(quantidadeInput.value);
  const tipo = tipoTransacaoSelect.value as "receita" | "despesa";
  const categoria = inputHidden.value;

  // Validações
  if (descricao.length < 3) return alert("Escreva de novo, com mínimo 3 letras!");
  if (isNaN(quantidade) || quantidade <= 0) return alert("Insira um número positivo!");
  if (tipo !== "receita" && tipo !== "despesa") return alert("Selecione um tipo de transação!");
  if (!categoria) return alert("Escolha uma categoria!");

  if (tipo === "receita" && !["Salário", "Outros"].includes(categoria)) {
    return alert("Para receita, apenas 'Salário' ou 'Outros' são permitidos!");
  }
  if (tipo === "despesa" && !["Entretenimento", "Comida", "Faturas", "Lazer", "Outros"].includes(categoria)) {
    return alert("Para despesa, apenas categorias válidas!");
  }

  const novaTransacao: Transacao = {
    descricao,
    quantidade,
    tipo,
    categoria,
    data: new Date().toString(),
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

const btnAdicionar = document.querySelector(".adiciona-historia") as HTMLButtonElement;
btnAdicionar?.addEventListener("click", adicionarTransacao);

const btnAdicionarIcon = document.querySelector(".nova-transacao-icon") as HTMLButtonElement;
btnAdicionarIcon?.addEventListener("click", adicionarTransacao);


// Atualizar dados 

function atualizarDados(): void {
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

const hamburger = document.getElementById("hamburger") as HTMLElement;
const sidebar = document.querySelector(".sidebar") as HTMLElement;
const overlay = document.getElementById("overlay") as HTMLElement;

function toggleMenu(): void {
  sidebar?.classList.toggle("active");
  overlay?.classList.toggle("active");
}

function fecharMenu(): void {
  sidebar?.classList.remove("active");
  overlay?.classList.remove("active");
}

hamburger?.addEventListener("click", toggleMenu);
overlay?.addEventListener("click", fecharMenu);
document.querySelectorAll(".menu-itens").forEach((item) => item.addEventListener("click", fecharMenu));