export default class Produto{
    constructor(id, descricao, codigoBarra, precoCusto, preco, catId){
        this.id = id;
        this.descricao = descricao;
        this.codigoBarra= codigoBarra;
        this.precoCusto =precoCusto;
        this.preco= preco;        
        this.catId = catId;
    }
    get json(){
        return JSON.stringify({
            id: this.id,
            descricao: this.descricao,
            codigoBarra: this.codigoBarra,
            precoCusto: this.precoCusto,
            preco: this.preco,
            categoria: {
                id: this.catId
            }
        });
    }
}