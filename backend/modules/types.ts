interface Transacao {
        descricao: string;
        quantidade: number;
        tipo: "receita" | "despesa";
        categoria: string;
        data: string | Date;
}

export {Transacao};