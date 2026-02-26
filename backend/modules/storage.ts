import { Transacao } from "./types.js";

export function salvarTransacoes(transacoes: Transacao[]): void {
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

export function carregarTransacoes(): Transacao[] {
    const data = localStorage.getItem("transacoes");

    if (!data) return [];

    return JSON.parse(data) as Transacao[];
}
