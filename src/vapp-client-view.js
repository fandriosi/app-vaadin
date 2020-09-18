import {html, render} from 'lit-html/lit-html.js';
import '@vaadin/vaadin-form-layout' ;
import '@vaadin/vaadin-custom-field';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-text-field/vaadin-email-field';
import '@vaadin/vaadin-dialog';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-grid';
import Service from '../util/services';
import Storage from '../util/storage';
import Cliente from '../beans/cliente';

export default class ClienteView extends HTMLElement{
    constructor(){
        super();
        this.storage = new Storage('clientes');
        this.service = new Service();  
        this.URL="resources/clientes"
        //this.URL = "http://localhost:8080/resources/clientes";
    }
    connectedCallback(){
        this.createTemplate(); 
        this.loadingGrid();    
        this.selectItemsEventListener();
    }
    createTemplate(){
        const templete = html `
        <vaadin-dialog aria-label="simple"></vaadin-dialog>
        <vaadin-form-layout>
            <vaadin-text-field label="Código" disabled="true" style="width: 100%;" placeholder="Código" id="id"></vaadin-text-field>
            <vaadin-text-field required style="width: 100%;" label="Nome" placeholder="Nome" id="nome" error-message="O nome do Cliente é obrigatório!" clear-button-visible></vaadin-text-field>
            <vaadin-email-field label="Email" placeholder="E-mail" style="width: 100%;" id="email" error-message="Please enter a valid email address" clear-button-visible></vaadin-email-field>    
            <vaadin-custom-field label="Número Telefone">
                <vaadin-text-field prevent-invalid-input pattern="[0-9]*" maxlength="3" placeholder="Area" id="area"></vaadin-text-field>
                <vaadin-text-field prevent-invalid-input pattern="[0-9]*" maxlength="9" placeholder="Número" id="numero"></vaadin-text-field>
            </vaadin-custom-field>       
            <vaadin-form-item>
                <vaadin-button theme="primary" @click=${_ => this.persist()} id="btnSalvar">Salvar</vaadin-button>
                <vaadin-button theme="primary" @click=${_ => this.deletar()} id="btnExcluir">Excluir</vaadin-button>
                <vaadin-button theme="primary" @click=${_ =>this.cancelar()} id="btnCancelar">Novo</vaadin-button>
            </vaadin-form-item>
        </vaadin-form-layout>
        <h4>Lista de Clientes</h4>
        <vaadin-grid>
            <vaadin-grid-column path="id" header="Código" width="15%"></vaadin-grid-column>
            <vaadin-grid-column path="nome" header="Nome"></vaadin-grid-column>
            <vaadin-grid-column path="email" header="E-mail"></vaadin-grid-column>
            <vaadin-grid-column path="phone" header="Telefone"></vaadin-grid-column>
        </vaadin-grid>`;
        render(templete, this);
    } 
    selectItemsEventListener(){            
        const grid = this.querySelector('vaadin-grid');
        let idTextfield = this.querySelector('#id');
        let nomeTextfield = this.querySelector('#nome');
        let emailTextfiel = this.querySelector('#email');
        let areaTextfield = this.querySelector('#area');
        let numeroTextfield = this.querySelector('#numero'); 
        grid.addEventListener('active-item-changed', function(event){
            const item = event.detail.value;
            grid.selectedItems = item ? [item]:[];
            var str = item.phone;
            idTextfield.value=item.id;
            nomeTextfield.value=item.nome; 
            emailTextfiel.value=item.email;
            areaTextfield.value=str.substr(0,3);
            numeroTextfield.value=str.substr(3,9); 
        });                   
    }
    persist(){
        if(this.querySelector('#id').value !== null){
            this.editar()
        }else{
            this.salvar();
        }
    }
    salvar(){       
        let nomeTextfield = this.querySelector('#nome');
        let emailTextfiel= this.querySelector('#email');        
        if(nomeTextfield.validate()){
            if( emailTextfiel.value !="" && emailTextfiel.validate()){
                this.service.postServices(this.URL, this.getJson())
                .then(response =>{ 
                    if(response.ok){
                        this.querySelector('vaadin-grid').dataProvider = (params, callback) =>{
                            cresponse.json().then( json => callback(json, json.length));
                        }
                        this.showDialog("Cliente salvo com sucesso!");
                        this.editionField();
                    }              
                }).catch(erro =>{
                    this.showDialog("Erro na conexão como Servidor!");
                    console.log(erro.message);
                });
            }else{
                this.service.postServices(this.URL, this.getJson())
                .then(response =>{ 
                    if(response.ok){
                        this.querySelector('vaadin-grid').dataProvider = (params, callback) =>{
                            console.log(response.json().then(
                                json => callback(json, json.length)
                             ));
                        }
                        this.showDialog("Cliente salvo com sucesso!");
                        this.editionField();
                    }              
                }).catch(erro =>{
                    this.showDialog("Erro na conexão como Servidor!");
                    console.log(erro.message);
                });
            }            
        }       
    }
    editar(){
        let nomeTextfield = this.querySelector('#nome');
        let emailTextfiel= this.querySelector('#email');   
        if(nomeTextfield.validate()){
            if( emailTextfiel.value !="" && emailTextfiel.validate()){
                this.service.putServices(this.URL, this.getJson())
                .then(response =>{ 
                    if(response.ok){
                        this.querySelector('vaadin-grid').dataProvider = (params, callback) =>{
                            response.json().then(json => callback(json, json.length));
                        }
                        this.showDialog("Cliente alterado com sucesso!");
                        this.editionField();
                    }              
                }).catch(erro =>{
                    this.showDialog("Erro na conexão como Servidor!");
                    console.log(erro.message);
                });
            }else{
                this.service.putServices(this.URL, this.getJson())
                .then(response =>{ 
                    if(response.ok){
                        this.querySelector('vaadin-grid').dataProvider = (params, callback) =>{
                            response.json().then(json => callback(json, json.length));
                        }
                        this.showDialog("Cliente alterado com sucesso!");
                        this.editionField();
                    }              
                }).catch(erro =>{
                    this.showDialog("Erro na conexão como Servidor!");
                    console.log(erro.message);
                });
            }            
        }        
    }
    deletar(){
        this.service.deleteServices(this.URL, this.getJson())
            .then(response =>{ 
                if(response.ok){
                    this.querySelector('vaadin-grid').dataProvider = (params, callback) =>{
                        response.json().then(json => callback(json, json.length));
                    }       
                    this.showDialog("Cliente delatado com sucesso!");
                    this.editionField();
                }              
            }).catch(erro =>{
                this.showDialog("Erro na conexão como Servidor!");
                console.log(erro.message);
            });   
    }
    cancelar(){
        this.editionField();
    }
    loadingGrid(){        
        const grid = this.querySelector('vaadin-grid');
        grid.dataProvider =(params, callback) =>{
            this.service.getServices(this.URL).then(
                json => callback(json, json.length));
        }                
    }
    showDialog(message){
        customElements.whenDefined('vaadin-dialog').then(_ =>{
            const dialog = this.querySelector('vaadin-dialog');
            dialog.renderer= function(root, dialog){
                root.textContent=message;
            }
            dialog.opened =true
        });          
    }
    editionField(){
        this.querySelector('#id').value='';
        this.querySelector('#nome').value='';
        this.querySelector('#email').value='';
        this.querySelector('#area').value='';
        this.querySelector('#numero').value='';
        
    }
    getJson(){
        const clinte = new Cliente(this.querySelector('#id').value,this.querySelector('#nome').value, 
        this.querySelector('#email').value, this.querySelector('#area').value, this.querySelector('#numero').value);
        return clinte.json;
    }
}
customElements.define('vapp-cliente-view',ClienteView);
