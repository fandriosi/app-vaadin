export default class Cliente{
    constructor(id, nome, email, area, phone){
        this.id = id;
        this.nome= nome;
        this.email = email;
        this.area= area;
        this.phone = phone;
    }
    
    get json(){
        return JSON.stringify({
            id: this.id,
            nome: this.nome,
            email: this.email,
            phone: this.area + " " + this.phone
        });
    }
}