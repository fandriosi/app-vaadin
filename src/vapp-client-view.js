import {html, render} from 'lit-html/lit-html.js';
import '@vaadin/vaadin-form-layout' ;
import '@vaadin/vaadin-custom-field';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-dialog';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-grid';
import Service from '../util/services';
import Storage from '../util/storage';

export default class ClienteView extends HTMLElement{
    constructor(){
        super();
        this.storage = new Storage('clientes');
        this.service = new Service();            
    }
    connectedCallback(){
        this.createTemplate();
        this.salvarEventListener();
        this.loadingGrid();
    }
    createTemplate(){
        const templete = html `
        <vaadin-dialog aria-label="simple"></vaadin-dialog>
        <vaadin-form-layout>   
            <vaadin-custom-field label="Nome" error-message="O nome do Cliente é obrigatório!">
                <vaadin-text-field required style"width: 25em;" placeholder="Nome" style="width: 30em;" id="nome"></vaadin-text-field>
            </vaadin-custom-field>                
            <vaadin-form-item>
                <vaadin-button theme="primary" id="buttomSalvar">Salvar</vaadin-button>
            </vaadin-form-item>
            <vaadin-form-item>
                <vaadin-button theme="primary" id="buttonDeletar">Deletar</vaadin-button>
             </vaadin-form-item>
        </vaadin-form-layout>
        <vaadin-grid>
            <vaadin-grid-column path="id" header="Código"></vaadin-grid-column>
            <vaadin-grid-column path="nome" header="Nome"></vaadin-grid-column>
        </vaadin-grid>`;
        render(templete, this);
    }    
    salvarEventListener(){
        customElements.whenDefined('vaadin-form-layout').then(_ =>{
            const customField = this.querySelector('vaadin-custom-field');
            const button = this.querySelector('#buttonSalvar');
            button.addEventListener('click', _ =>{
                customField.validate(); 
                this.salvar();
            });
        });
    }
    salvar(){
        const nome = this.querySelector('#nome');
        const data = {nome: nome.value};        
        if(nome.value != null && nome.value != ""){
            console.log('salvar');
            this.service.postServices("http://localhost:8080/clientes", data)
            .then(response =>{ 
                if(response.ok){
                    console.log('response',response);
                    this.loadingGrid();
                    const textfield = this.querySelector('vaadin-text-field');
                    textfield.value = "";         
                    this.showDialog("Cliente salvo com sucesso!");
                }              
            }).catch(erro =>{
                this.showDialog("Erro na conexão como Servidor!");
                console.log(erro.message);
            });

        }else{
            
        }        
    }
    loadingStorage(){
        this.service.getServices("http://localhost:8080/clientes")
        .then(data =>{
            this.storage.storager(JSON.stringify(data));
        });
    }
    loadingGrid(){
        customElements.whenDefined('vaadin-grid').then(_ =>{
            const grid = this.querySelector('vaadin-grid');
          //  grid.dataProvider = (params, callback) =>{
          //      fetch("")
          //      .then(response => response.json()).then(
         //           json => callback(json, json.length));
         //
        this.loadingStorage();
        let data = JSON.parse(this.storage.load());
        grid.dataProvider =(params, callback) =>{
                callback(data, data.length);
            }
        });
    }
    showDialog(message){
        customElements.whenDefined('vaadin-dialog').then(_ =>{
            const dialog = this.querySelector('vaadin-dialog');
            console.log(dialog);
            dialog.renderer= function(root, dialog){
                root.textContent=message;
            }
            dialog.opened =true;
        });       
    }
}
customElements.define('cliente-view',ClienteView);

