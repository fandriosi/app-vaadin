export default class Produto{
    constructor(id, descricao, codigoBarra, precoCusto, preco, quantidade, catId){
        this.id = id;
        this.descricao = descricao;
        this.codigoBarra= codigoBarra;
        this.precoCusto =precoCusto;
        this.preco= preco;        
        this.quantidade = quantidade;
        this.catId = catId;
    }
    get json(){
        return JSON.stringify({
            id: this.id,
            descricao: this.descricao,
            codigoBarra: this.codigoBarra,
            precoCusto: this.precoCusto,
            preco: this.preco,
            quantidade: this.quantidade,
            categoria: {
                id: this.catId
            }
        });
    }
}