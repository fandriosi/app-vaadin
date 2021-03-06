export default class Vendas{
    constructor(id, dataCompra, dataRecebimento, tipoPagamento, valorPago, quantidade, valorTotal, desconto, idCliente,
        produto){
        this.id = id;
        this.dataCompra = dataCompra;
        this.dataRecebimento = dataRecebimento;
        this.tipoPagamento = tipoPagamento;
        this.valorPago = valorPago;
        this.desconto = desconto;
        this.quantidade = quantidade;
        this.valorTotal = valorTotal;
        this.idCliente = idCliente;
        this.produto = produto;
    }
    get json(){
        return JSON.stringify({
            id: this.id,
            dataCompra: this.dataCompra,
            dataRecebimento: this.dataRecebimento,
            tipoPagamento: this.tipoPagamento,
            valorPago: this.valorPago,
            valorTotal: this.valorTotal,
            desconto: this.desconto,
            clientes:{
                id: this.idCliente
            },
            produtosVendidos:this.produto
        })
    }
}