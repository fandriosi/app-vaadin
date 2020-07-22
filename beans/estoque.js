export default class Estoque{
    constructor(id, quantidade, idProduto){
        this.id = id;
        this.quantidade = quantidade;
        this.idProduto = idProduto
    }
    get json(){
        return JSON.stringify({
            id: this.id,
            quantidade: this.quantidade,
            produto:{
                id: this.idProduto
            }
        });
    }
}