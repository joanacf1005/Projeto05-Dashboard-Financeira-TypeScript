import { carregarTransacoes } from "./storage.js";
import { Transacao } from "./types.js";

let totalReceitas: number = 0;
let totalDespesas: number = 0;

// RECEITAS
function calcularReceitas(): void {    
    const transacoes: Transacao[] = carregarTransacoes();

    const apenasReceitas: Transacao[] = transacoes.filter(
        (transacao: Transacao) => transacao.tipo === "receita"
    );

    let somaReceitas: number = 0;

    apenasReceitas.forEach((transacao: Transacao) => {
        somaReceitas += transacao.quantidade;
    });

    totalReceitas = somaReceitas;
}

function mostrarReceitas(): void {
    const receitaDiv = document.querySelector(".receita-valor") as HTMLElement | null;

    if (receitaDiv) {
        receitaDiv.textContent = "+ " + totalReceitas.toFixed(2) + " €";
    }
}

// DESPESAS
function calcularDespesas(): void {
    const transacoes: Transacao[] = carregarTransacoes();

    const apenasDespesas: Transacao[] = transacoes.filter(
        (transacao: Transacao) => transacao.tipo === "despesa"
    );

    let somaDespesas: number = 0;

    apenasDespesas.forEach((transacao: Transacao) => {
        somaDespesas += transacao.quantidade;
    });

    totalDespesas = somaDespesas;
}

function mostrarDespesas(): void {
    const despesaDiv = document.querySelector(".despesas-valor") as HTMLElement | null;

    if (despesaDiv) {
        despesaDiv.textContent = "- " + totalDespesas.toFixed(2) + " €";
    }
}

// SALDO
function calcularSaldoTotal(): number {
    const transacoes: Transacao[] = carregarTransacoes();

    const saldo: number = transacoes.reduce(
        (acumulador: number, transacao: Transacao) => {
            if (transacao.tipo === "receita") {
                return acumulador + transacao.quantidade;
            }

            if (transacao.tipo === "despesa") {
                return acumulador - transacao.quantidade;
            }

            return acumulador;
        },
        0
    );

    return saldo;
}

function mostrarSaldoTotal(): void {
    const saldo: number = calcularSaldoTotal();
    const balancoDiv = document.querySelector(".balanco-total") as HTMLElement | null;

    if (balancoDiv) {
        balancoDiv.textContent = saldo.toFixed(2) + " €";
    }
}

export { calcularReceitas, calcularDespesas, calcularSaldoTotal, mostrarReceitas, mostrarDespesas, mostrarSaldoTotal};