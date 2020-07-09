import {html, render} from 'lit-html/lit-html.js';
import '@vaadin/vaadin-form-layout' ;
import '@vaadin/vaadin-custom-field';
import '@vaadin/vaadin-text-field';
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
        this.loadingGrid();
        this.difinedCustomElementsForms();
        this.showDialog();
    }
    connectedCallback(){
        this.createTemplate(); 
        this.selectItemsEventListener(); 
        this.fiedEventListener();       
        this.salvarEventListener();
        this.editarEventListener();
        this.deletarEventListern();       
    }
    createTemplate(){
        const templete = html `
        <vaadin-dialog aria-label="simple"></vaadin-dialog>
        <vaadin-form-layout>
            <vaadin-custom-field label="Código">
                <vaadin-text-field disabled="true" placeholder="Código" id="id"></vaadin-text-field>
            </vaadin-custom-field>        
            <vaadin-custom-field label="Nome" error-message="O nome do Cliente é obrigatório!">                
                <vaadin-text-field required style="width: 40em;" placeholder="Nome" id="nome"></vaadin-text-field>      
            </vaadin-custom-field>  
            <vaadin-custom-field label="Número Telefone">
                <vaadin-text-field prevent-invalid-input pattern="[0-9]*" maxlength="3" placeholder="Area"></vaadin-text-field>
                <vaadin-text-field prevent-invalid-input pattern="[0-9]*" maxlength="9" placeholder="Número"></vaadin-text-field>
            </vaadin-custom-field>  
            </vaadin-custom-field label="Email">  
                <vaadin-email-field label="Email" name="email" error-message="Please enter a valid email address" clear-button-visible></vaadin-email-field>       
            </vaadin-custom-field> 
            <vaadin-form-item>
                <vaadin-button theme="primary" id="buttonSalvar">Salvar</vaadin-button>
                <vaadin-button theme="primary" id="buttonDeletar">Excluir</vaadin-button>
                <vaadin-button theme="primary" id="buttonEditar">Editar</vaadin-button>
            </vaadin-form-item>
        </vaadin-form-layout>
        <vaadin-grid>
            <vaadin-grid-column path="id" header="Código"></vaadin-grid-column>
            <vaadin-grid-column path="nome" header="Nome"></vaadin-grid-column>
        </vaadin-grid>`;
        render(templete, this);
    }    
    difinedCustomElementsForms(){
        customElements.whenDefined('vaadin-form-layou').then(_ =>{});
    }
    salvarEventListener(){
        let customField = this.querySelector('vaadin-custom-field');
        let buttonSalvar = this.querySelector('#buttonSalvar');
        buttonSalvar.addEventListener('click', _ =>{  
            console.log('salvar');        
            customField.validate(); 
            this.salvar();
            this.cleanFields();
        });
    }
    editarEventListener(){
        let customField = this.querySelector('vaadin-custom-field');
        let buttonSalvar = this.querySelector('#buttonEditar');
        buttonSalvar.addEventListener('click', _ =>{          
            customField.validate(); 
            this.editar();
            this.cleanFields();
        });
    }
    deletarEventListern(){
        let buttonDeletar = this.querySelector('#buttonDeletar');
        let buttonSalvar = this.querySelector('#buttonSalvar');
        buttonDeletar.addEventListener('click',_ =>{
            buttonDeletar.disabled= true;
            buttonSalvar.disabled= false;
            this.deletar();  
            this.cleanFields();   
        });        
    }
    fiedEventListener(){
        let nomeTextfield = this.querySelector('#nome');
        let buttonSalvar = this.querySelector('#buttonSalvar');
        let buttonDeletar = this.querySelector('#buttonDeletar');
        nomeTextfield.addEventListener('click',_ =>{                
            if(buttonSalvar.disabled){
                console.log('field click');
                nomeTextfield.readonly=false;
                buttonSalvar.disabled=false;
                buttonDeletar.disabled=true;
            }
        }); 
    }
    selectItemsEventListener(){            
        const grid = this.querySelector('vaadin-grid');
        let nomeCliente = this.querySelector('#nome');
        let buttonSalvar = this.querySelector('#buttonSalvar');
        let buttonDeletar = this.querySelector('#buttonDeletar');
        grid.addEventListener('active-item-changed', function(event){
            const item = event.detail.value;
            grid.selectedItems = item ? [item]:[];
            idCliente.value=item.id;
            nomeCliente.value=item.nome;
            nomeCliente.readonly=true;
            buttonSalvar.disabled=true;
            buttonDeletar.disabled=false;       
        });           
    }
    salvar(){
        const nome = this.querySelector('#nome');
        const data = {nome: nome.value};        
        if(nome.value != null && nome.value != ""){
            this.service.postServices("http://localhost:8080/clientes", data)
            .then(response =>{ 
                if(response.ok){
                    this.loadingGrid();
                    const textfield = this.querySelector('vaadin-text-field');
                    textfield.value = "";         
                    this.showDialog("Cliente salvo com sucesso!");
                }              
            }).catch(erro =>{
                this.showDialog("Erro na conexão como Servidor!");
                console.log(erro.message);
            });
        }       
    }
    editar(){
        let id = this.querySelector('#id');
        let nome = this.querySelector('#nome');
        const data = {id: id.value, nome: nome.value};        
        if(nome.value != null && nome.value != ""){
            this.service.putServices("http://localhost:8080/clientes", data)
            .then(response =>{ 
                if(response.ok){
                    this.loadingGrid();
                    const textfield = this.querySelector('vaadin-text-field');
                    textfield.value = "";         
                    this.showDialog("Cliente alterado com sucesso!");
                }              
            }).catch(erro =>{
                this.showDialog("Erro na conexão como Servidor!");
                console.log(erro.message);
            });
        }       
    }
    deletar(){
        let id = this.querySelector('#id');
        let nome = this.querySelector('#nome');        
        let data = {id: id.value, nome: nome.value};        
        if(nome.value != null && nome.value != ""){
            this.service.deleteServices("http://localhost:8080/clientes", data)
            .then(response =>{ 
                if(response.ok){
                    console.log('response',response);
                    this.loadingGrid();
                    textfield.value = "";         
                    this.showDialog("Cliente delatado com sucesso!");
                }              
            }).catch(erro =>{
                this.showDialog("Erro na conexão como Servidor!");
                console.log(erro.message);
            });

        }       
    }
    loadingGrid(){
        customElements.whenDefined('vaadin-grid').then(_ =>{
            const grid = this.querySelector('vaadin-grid');
            grid.dataProvider =(params, callback) =>{
                this.service.getServices("http://localhost:8080/clientes").then(
                    json => callback(json, json.length));
            }   
        });                   
    }
    showDialog(message){
        customElements.whenDefined('vaadin-dialog').then(_ =>{
            const dialog = this.querySelector('vaadin-dialog');
            dialog.renderer= function(root, dialog){
                root.textContent=message;
            }
            dialog.opened =true;  
        });          
    }
    cleanFields(){
        let idField = this.querySelector('#id');
        let nomeField = this.querySelector('#nome');
        idField.value = "";
        nomeField.value= "";
    }
}
customElements.define('cliente-view',ClienteView);

