export default class Storager{
    constructor(name){
        this.slot = name;
        this.storage = window.localStorage;
    }

    storager(response){       
        this.storage.setItem(this.slot, response);
    }

    load(){
        const stringified = this.storage.getItem(this.slot);
        return stringified;
    }
}