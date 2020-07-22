export default class Categoria{
    constructor(id, descricao){
        this.id = id;
        this.descricao= descricao;
    }
    get json(){
        return JSON.stringify({
            id: this.id,
            descricao: this.descricao
        });
    }
}