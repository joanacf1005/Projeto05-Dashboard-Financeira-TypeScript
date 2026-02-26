export function salvarTransacoes(transacoes) {
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
}
export function carregarTransacoes() {
    const data = localStorage.getItem("transacoes");
    if (!data)
        return [];
    return JSON.parse(data);
}
//# sourceMappingURL=storage.js.map