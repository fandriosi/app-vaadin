import {html, render} from 'lit-html/lit-html.js';
import '@vaadin/vaadin-form-layout' ;
import '@vaadin/vaadin-custom-field';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-text-field/vaadin-number-field';
import '@vaadin/vaadin-combo-box';
import '@vaadin/vaadin-dialog';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-grid';

import Service from '../util/services';

export default class ProdutosView extends HTMLElement{
    constructor(){
        super();
        this.service = new Service();
    }

    connectedCallback(){
        this.getTemplate();
        this.loadingGrid();
        this.attachComboBox();
        this.fiedEventListener();
        this.selectItemsEventListener();
        this.disabledInsercao(true);
    }

    getTemplate(){
        const template = html `
        <vaadin-dialog aria-label="simple"></vaadin-dialog>
        <vaadin-form-layout>
            <vaadin-text-field label="Código" disabled="true" style="width: 100%;" placeholder="Código" id="id"></vaadin-text-field>
            <vaadin-text-field required style="width: 100%;" placeholder="Descrição" id="descricao" label="Descrição" error-message="A descrição do produto não pode ser nulo!" clear-button-visible></vaadin-text-field>
            <vaadin-text-field label="Referência" style="width: 100%;" placeholder="Referência" id="referencia"  clear-button-visible></vaadin-text-field>    
            <vaadin-combo-box label="Categoria" item-label-path="descricao" item-value-path="id"></vaadin-combo-box>
            <vaadin-custom-field label="Preço">
                <vaadin-number-field  maxlength="5" placeholder="Custo" id="custo"><div slot="prefix">R$</div></vaadin-number-field>
                <vaadin-number-field  maxlength="5" placeholder="Venda" id="venda"><div slot="prefix">R$</div></vaadin-number-field>
            </vaadin-custom-field>       
            <vaadin-form-item>
                <vaadin-button theme="primary" id="btnSalvar" @click=${_ => this.salvar()}>Salvar</vaadin-button>
                <vaadin-button theme="primary" id="btnExcluir" @click=${_ => this.deletar()}>Excluir</vaadin-button>
                <vaadin-button theme="primary" id="btnEditar" @click=${_ => this.editar()}>Editar</vaadin-button>
                <vaadin-button theme="primary" id="btnCancelar" @click=${_ => this.cancelar()}>Cancelar</vaadin-button>
            </vaadin-form-item>
        </vaadin-form-layout>
        <vaadin-grid>
            <vaadin-grid-column path="id" header="Código" width="15%"></vaadin-grid-column>
            <vaadin-grid-column path="descricao" header="Descrição"></vaadin-grid-column>
            <vaadin-grid-column path= "categoria.descricao" header="Categoria"></vaadin-grid-column>
            <vaadin-grid-column path="codigoBarra" header="Referência"></vaadin-grid-column>
            <vaadin-grid-column path="precoCusto" header="Preço de Custo"></vaadin-grid-column>
            <vaadin-grid-column path="preco" header="Preço"></vaadin-grid-column>
        </vaadin-grid>`;  
        render(template, this);   
    }
    fiedEventListener(){
        let nomeTextfield = this.querySelector('#descricao');
        nomeTextfield.addEventListener('click',_ =>{      
            this.disabledInsercao(true);
            this.editionField(false);
        }); 
    }
    selectItemsEventListener(){            
        const grid = this.querySelector('vaadin-grid');
        let idTextfield = this.querySelector('#id');
        let descricaoTextfield = this.querySelector('#descricao');
        let referenciaTextfiel = this.querySelector('#referencia');
        let custoTextfield = this.querySelector('#custo');
        let precoTextfield = this.querySelector('#venda');  
        let categoriaComob = this.querySelector('vaadin-combo-box'); 
        let btnExcluir = this.querySelector('#btnExcluir');      
        let btnEditar = this.querySelector('#btnEditar');
        let btnSalvar = this.querySelector('#btnSalvar');
        grid.addEventListener('active-item-changed', function(event){
            const item = event.detail.value;
            grid.selectedItems = item ? [item]:[];
            console.log(item);
            idTextfield.value=item.id;
            descricaoTextfield.value=item.descricao; 
            referenciaTextfiel.value=item.codigoBarra;
            custoTextfield.value=item.precoCusto;
            precoTextfield.value=item.preco;
            categoriaComob.value = item.categoria.id;
            descricaoTextfield.readonly= true;
            referenciaTextfiel.disabled=true;
            custoTextfield.disabled=true;
            precoTextfield.disabled=true;        
            btnExcluir.disabled=false; 
            btnEditar.disabled=false;
            btnSalvar.disabled=true;
        });           
        
    }
    disabledInsercao(option){
        let buttonSalvar = this.querySelector('#btnSalvar');
        let buttonExcluir = this.querySelector('#btnExcluir');
        let buttonEditar = this.querySelector('#btnEditar');
        let idTextfield = this.querySelector('#id');
        if(option && idTextfield.value == 0){
            buttonExcluir.disabled=true;
            buttonSalvar.disabled=false;
            buttonEditar.disabled=true;
        }else{
            buttonExcluir.disabled=false;
            buttonSalvar.disabled=true;
            buttonEditar.disabled=false;
        }
    }
    salvar(){       
        let descricaoTextfield = this.querySelector('#descricao');    
        if(descricaoTextfield.validate()){
            this.service.postServices("http://localhost:8080/produtos", this.getJson())
            .then(response =>{ 
                if(response.ok){
                    this.loadingGrid();
                    this.showDialog("Cliente salvo com sucesso!");
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
        let nomeTextfield = this.querySelector('#nome');
        let emailTextfiel= this.querySelector('#email');   
        console.log('click editar');     
        if(nomeTextfield.validate()){
            if( emailTextfiel.value !="" && emailTextfiel.validate()){
                this.service.putServices("http://localhost:8080/produtos", this.getJson())
                .then(response =>{ 
                    if(response.ok){
                        this.loadingGrid();
                        this.showDialog("Produto alterado com sucesso!");
                        this.editionField(true);
                        this.disabledInsercao(true);
                    }              
                }).catch(erro =>{
                    this.showDialog("Erro na conexão como Servidor!");
                    console.log(erro.message);
                });
            }else{
                this.service.putServices("http://localhost:8080/produtos", this.getJson())
                .then(response =>{ 
                    if(response.ok){
                        this.loadingGrid();
                        this.showDialog("Produtos alterado com sucesso!");
                        this.editionField(true);
                        this.disabledInsercao(true);
                    }              
                }).catch(erro =>{
                    this.showDialog("Erro na conexão como Servidor!");
                    console.log(erro.message);
                });
            }            
        }        
    }
    deletar(){
        this.service.deleteServices("http://localhost:8080/produtos", this.getJson())
            .then(response =>{ 
                if(response.ok){
                    console.log('response',response);
                    this.loadingGrid();       
                    this.showDialog("Produtos delatado com sucesso!");
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
    loadingGrid(){        
        const grid = this.querySelector('vaadin-grid');
        grid.dataProvider =(params, callback) =>{
            this.service.getServices("http://localhost:8080/produtos").then(
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
    editionField(option){
        let idField = this.querySelector('#id');
        let descricaoField = this.querySelector('#descricao');
        let referenciaField = this.querySelector('#referencia');
        let custoField = this.querySelector('#custo');
        let vendaField = this.querySelector('#venda');
        if(option){
            idField.value = "";
            descricaoField.value = "";
            referenciaField.value= "";
            custoField.value= "";
            vendaField.value= "";
        }else{
            descricaoField.readonly = false;
            referenciaField.disabled= false;
            custoField.disabled = false;
            vendaField.disabled= false;
        }
        
    }
    getJson(){
        let id = this.querySelector('#id');
        let descricao = this.querySelector('#descricao');
        let codigoBarra = this.querySelector('#referencia');
        let precoCusto= this.querySelector('#custo');
        let preco = this.querySelector('#venda');
        let categoria =this.querySelector('vaadin-combo-box');
        let data = {categoria:{
                id: categoria.value},
            id: id.value, 
            descricao: descricao.value, 
            codigoBarra: codigoBarra.value,
            precoCusto: precoCusto.value,
            preco: preco.value            
            }; 
        return data;
    }
    attachComboBox(){
        customElements.whenDefined('vaadin-combo-box').then(_ =>{
            this.service.getServicesJson("http://localhost:8080/categoria").then(json =>{
                this.querySelector('vaadin-combo-box').items = json;
            });
        });
    }
}
customElements.define('vapp-produtos-view', ProdutosView);