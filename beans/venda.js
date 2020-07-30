export default class Vendas{
    constructor(id, dataCompra, dataRecebimento, tipoPagamento, valorPago, quantidade, idCliente,
        idProduto){
        this.id = id;
        this.dataCompra = dataCompra;
        this.dataRecebimento = dataRecebimento;
        this.tipoPagamento = tipoPagamento;
        this.valorPago = valorPago;
        this.quantidade = quantidade;
        this.idCliente = idCliente;
        this.idProduto = idProduto;
    }
    get json(){
        return JSON.stringify({
            id: this.id,
            dataCompra: this.dataCompra,
            dataRecebimento: this.dataRecebimento,
            tipoPagamento: this.tipoPagamento,
            valorPago: this.valorPago,
            clientes:{
                id: this.idCliente
            },
            produtosVendidos:[{                
                quantidade: this.quantidade,
                produto:{
                    id: this.idProduto
                }
            }]
        })
    }
}