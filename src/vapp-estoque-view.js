import {html, render} from 'lit-html/lit-html';
import '@vaadin/vaadin-form-layout';
import '@vaadin/vaadin-text-field/vaadin-text-field';
import '@vaadin/vaadin-text-field/vaadin-integer-field'
import '@vaadin/vaadin-dialog';
import '@vaadin/vaadin-button';
import Service from '../util/services';
import Estoque from '../beans/estoque';

export default class VappEstoque extends HTMLElement{
    constructor(){
        super();    
        this.service = new Service();
    }
    connectedCallback(){
        this.callServer();
        this.loadingGrid();
        this.attachComboBox();
        this.selectItemsEventListener();
        this.disabledInsercao(true);
    }
    callServer(){
        const templete = html `
        <vaadin-dialog aria-label="simple"></vaadin-dialog>
        <vaadin-form-layout>
            <vaadin-text-field label="Código" disabled="true" style="width: 100%;" placeholder="Código" id="id"></vaadin-text-field>
            <vaadin-integer-field  min="1" max="100" has-controls label="Quantidade" id="quantidade"></vaadin-integer-field>
            <vaadin-combo-box required label="Produto" item-label-path="descricao" item-value-path="id" id="produtos"></vaadin-combo-box>
            <vaadin-form-item>
                <vaadin-button theme="primary" @click=${_ => this.salvar()} id="btnSalvar">Salvar</vaadin-button>
                <vaadin-button theme="primary" @click=${_ => this.deletar()} id="btnExcluir">Excluir</vaadin-button>
                <vaadin-button theme="primary" @click=${_ =>this.editar()} id="btnEditar">Editar</vaadin-button>
                <vaadin-button theme="primary" @click=${_ =>this.cancelar()} id="btnCancelar">Cancelar</vaadin-button>
            </vaadin-form-item>
        </vaadin-form-layout>
        <vaadin-grid>
            <vaadin-grid-column path="id" header="Código" width="15%"></vaadin-grid-column>
            <vaadin-grid-column path="quantidade" header="Quantidade" width="15%"></vaadin-grid-column>
            <vaadin-grid-column path= "produto.descricao" header="Produto" width="70%"></vaadin-grid-column>
        </vaadin-grid>
        </vaadin-form-layout>`
        render(templete, this);
    }
    disabledInsercao(option){
        let buttonSalvar = this.querySelector('#btnSalvar');
        let buttonExcluir = this.querySelector('#btnExcluir');
        let buttonEditar = this.querySelector('#btnEditar');
        let idTextfield = this.querySelector('#id');
        let produtosComobobox = this.querySelector('#produtos');
        if(option && idTextfield.value == 0){
            buttonExcluir.disabled=true;
            buttonSalvar.disabled=false;
            buttonEditar.disabled=true;
            produtosComobobox.disabled = false;
        }else{
            buttonExcluir.disabled=false;
            buttonSalvar.disabled=true;
            buttonEditar.disabled=false;
            produtosComobobox.disabled = true;
        }
    }
    selectItemsEventListener(){            
        const grid = this.querySelector('vaadin-grid');
        let idTextfield = this.querySelector('#id');
        let quantidadeTextfield = this.querySelector('#quantidade');
        let produtoCombobox = this.querySelector('#produtos'); 
        let btnExcluir = this.querySelector('#btnExcluir');      
        let btnEditar = this.querySelector('#btnEditar');
        let btnSalvar = this.querySelector('#btnSalvar');
        grid.addEventListener('active-item-changed', function(event){
            const item = event.detail.value;
            grid.selectedItems = item ? [item]:[];
            idTextfield.value=item.id;
            quantidadeTextfield.value=item.quantidade; 
            produtoCombobox.value = item.produto.id;  
            produtoCombobox.disabled = true;
            btnExcluir.disabled=false; 
            btnEditar.disabled=false;
            btnSalvar.disabled=true;
        });           
    }
    salvar(){
        if(this.querySelector("#produtos").validate()){
            this.service.postServices("http://localhost:8080/resources/estoque", this.getJson())
            .then(response =>{ 
                if(response.ok){
                    this.loadingGrid();
                    this.showDialog("Estoque salvo com sucesso!");
                    this.editionField(true);
                    this.disabledInsercao(true);
                }              
            }).catch(erro =>{
                this.showDialog("Erro na conexão como Servidor!");
                console.log(erro.message);
            });
        }        
    }
    editar(){
       if(this.querySelector('#produtos').validate()){
            this.service.putServices("http://localhost:8080/resources/estoque", this.getJson())
            .then(response =>{ 
                if(response.ok){
                    this.loadingGrid();
                    this.showDialog("Estoque alterado com sucesso!");
                    this.editionField(true);
                    this.disabledInsercao(true);
                }              
            }).catch(erro =>{
                this.showDialog("Erro na conexão como Servidor!");
                console.log(erro.message);
            });
        }       
    }
    deletar(){
        this.service.deleteServices("http://localhost:8080/resources/estoque", this.getJson())
            .then(response =>{ 
                if(response.ok){
                    console.log('response',response);
                    this.loadingGrid();       
                    this.showDialog("Estoque delatado com sucesso!");
                    this.editionField(true);
                        this.disabledInsercao(true);
                }              
            }).catch(erro =>{
                this.showDialog("Erro na conexão como Servidor!");
                console.log(erro.message);
            });   
    }
    cancelar(){
        this.editionField(true);
        this.disabledInsercao(true);
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
    editionField(option){
        let idField = this.querySelector('#id');
        let produtosComobobox = this.querySelector('#produtos');
        if(option){
            idField.value = "";
            produtosComobobox.value = "";
        }else{
            produtosComobobox.readonly = false;
        }
        
    }
    attachComboBox(){
        customElements.whenDefined('vaadin-combo-box').then(_ =>{
            this.querySelector('#produtos').dataProvider = (params, callback) =>{
                this.service.getServicesJson("http://localhost:8080/resources/produtos").then(
                    json => callback(json, json.length)
                );
            }
        });
    }
    loadingGrid(){        
        const grid = this.querySelector('vaadin-grid');
        grid.dataProvider =(params, callback) =>{
            this.service.getServices("http://localhost:8080/resources/estoques").then(
                json => callback(json, json.length));
        }                
    }
    getJson(){
        const estoque= new Estoque(this.querySelector('#id').value, this.querySelector('#quantidade').value,
        this.querySelector("#produtos").value);
        console.log(estoque.json);
        return estoque.json;
    }
    
}
customElements.define('vapp-estoque-view',VappEstoque);

