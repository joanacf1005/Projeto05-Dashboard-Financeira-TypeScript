export function inicializarPopUp(transacoes, renderizarTransacoes, atualizarDados) {
    const popup = document.getElementById("popup-transacao");
    const popupDescricao = document.getElementById("popup-descricao");
    const popupQuantidade = document.getElementById("popup-quantidade");
    const popupCategoria = document.getElementById("popup-categoria");
    const popupTipo = document.getElementById("popup-tipo");
    const btnSalvar = document.getElementById("salvar-popup");
    const btnFechar = document.getElementById("fechar-popup");
    function abrirPopUp(transacao, index) {
        popup.style.display = "flex";
        // Preencher campos com os valores da transação
        popupDescricao.value = transacao.descricao;
        popupQuantidade.value = transacao.quantidade.toString();
        popupCategoria.value = transacao.categoria;
        popupTipo.value = transacao.tipo;
        btnSalvar.onclick = () => {
            const descricao = popupDescricao.value.trim();
            const quantidade = Number(popupQuantidade.value);
            const categoria = popupCategoria.value.trim();
            const tipo = popupTipo.value;
            // Validações
            if (!descricao || descricao.length < 3) {
                alert("Escreva de novo, com mínimo 3 letras!");
                return;
            }
            if (isNaN(quantidade) || quantidade <= 0) {
                alert("Insira um número positivo, maior que zero!");
                return;
            }
            if (!tipo) {
                alert("Selecione um tipo de transação!");
                return;
            }
            if (!categoria) {
                alert("Escolha uma categoria!");
                return;
            }
            // Validação das categorias de acordo com o tipo
            if (tipo === "receita") {
                const categoriasPermitidas = ["Salário", "Outros"];
                if (!categoriasPermitidas.includes(categoria)) {
                    alert("Para uma receita, apenas 'Salário' ou 'Outros' são permitidos como categoria!");
                    return;
                }
            }
            if (tipo === "despesa") {
                const categoriasPermitidas = ["Entretenimento", "Comida", "Faturas", "Lazer", "Outros"];
                if (!categoriasPermitidas.includes(categoria)) {
                    alert("Para uma despesa, apenas 'Entretenimento', 'Comida', 'Faturas', 'Lazer' ou 'Outros' são permitidos como categoria!");
                    return;
                }
            }
            // Salvar alterações na transação
            transacoes[index] = { descricao, quantidade, categoria, tipo, data: transacao.data };
            // Atualizar lista e dados
            renderizarTransacoes();
            atualizarDados();
            // Fechar popup
            popup.style.display = "none";
        };
        btnFechar.onclick = () => {
            popup.style.display = "none";
        };
    }
    return abrirPopUp;
}
//# sourceMappingURL=editTransaction.js.map