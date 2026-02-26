import { carregarTransacoes } from "./storage.js";
let totalReceitas = 0;
let totalDespesas = 0;
// RECEITAS
function calcularReceitas() {
    const transacoes = carregarTransacoes();
    const apenasReceitas = transacoes.filter((transacao) => transacao.tipo === "receita");
    let somaReceitas = 0;
    apenasReceitas.forEach((transacao) => {
        somaReceitas += transacao.quantidade;
    });
    totalReceitas = somaReceitas;
}
function mostrarReceitas() {
    const receitaDiv = document.querySelector(".receita-valor");
    if (receitaDiv) {
        receitaDiv.textContent = "+ " + totalReceitas.toFixed(2) + " €";
    }
}
// DESPESAS
function calcularDespesas() {
    const transacoes = carregarTransacoes();
    const apenasDespesas = transacoes.filter((transacao) => transacao.tipo === "despesa");
    let somaDespesas = 0;
    apenasDespesas.forEach((transacao) => {
        somaDespesas += transacao.quantidade;
    });
    totalDespesas = somaDespesas;
}
function mostrarDespesas() {
    const despesaDiv = document.querySelector(".despesas-valor");
    if (despesaDiv) {
        despesaDiv.textContent = "- " + totalDespesas.toFixed(2) + " €";
    }
}
// SALDO
function calcularSaldoTotal() {
    const transacoes = carregarTransacoes();
    const saldo = transacoes.reduce((acumulador, transacao) => {
        if (transacao.tipo === "receita") {
            return acumulador + transacao.quantidade;
        }
        if (transacao.tipo === "despesa") {
            return acumulador - transacao.quantidade;
        }
        return acumulador;
    }, 0);
    return saldo;
}
function mostrarSaldoTotal() {
    const saldo = calcularSaldoTotal();
    const balancoDiv = document.querySelector(".balanco-total");
    if (balancoDiv) {
        balancoDiv.textContent = saldo.toFixed(2) + " €";
    }
}
export { calcularReceitas, calcularDespesas, calcularSaldoTotal, mostrarReceitas, mostrarDespesas, mostrarSaldoTotal };
//# sourceMappingURL=transactions.js.map