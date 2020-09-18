import {html, render} from 'lit-html/lit-html.js';
import '@vaadin/vaadin-form-layout' ;
import '@vaadin/vaadin-custom-field';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-text-field/vaadin-number-field';
import '@vaadin/vaadin-combo-box';
import '@vaadin/vaadin-dialog';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-icons';
import '@vaadin/vaadin-grid';

import Service from '../util/services';
import Produto from '../beans/produto';

export default class ProdutosView extends HTMLElement{
    constructor(){
        super();
        this.service = new Service();
        this.URL = "resources/produtos";
        //this.URL = "http://localhost:8080/resources/produtos";
    }

    connectedCallback(){
        this.getTemplate();
        this.loadingGrid();
        this.attachComboBox();
        this.selectItemsEventListener();
    }

    getTemplate(){
        const template = html `
        <vaadin-dialog aria-label="simple"></vaadin-dialog>
        <vaadin-form-layout>
            <vaadin-text-field label="Código" disabled="true" style="width: 100%;" placeholder="Código" id="id"></vaadin-text-field>
            <vaadin-text-field required style="width: 100%;" placeholder="Descrição" id="descricao" label="Descrição" error-message="A descrição do produto não pode ser nulo!" clear-button-visible></vaadin-text-field>
            <vaadin-text-field label="Referência" style="width: 100%;" placeholder="Referência" id="referencia"  clear-button-visible></vaadin-text-field>    
            <vaadin-integer-field  min="1" max="100" has-controls label="Quantidade" id="quantidade"></vaadin-integer-field>
            <vaadin-combo-box label="Categoria" item-label-path="descricao" item-value-path="id"></vaadin-combo-box>
            <vaadin-form-item>
                <vaadin-text-field  style="width: 70%;" placeholder="Buscar por Descrição do Produto" id="findDescricao" clear-button-visible></vaadin-text-field>
                <vaadin-button theme="primary" id="btnFindByDescricao" @click=${_ => this.findByDescricao()}><iron-icon icon="vaadin:search"></iron-icon></vaadin-button>
            </vaadin-form-item>            
            <vaadin-custom-field label="Preço">
                <vaadin-number-field  maxlength="5" placeholder="Custo" id="custo"><div slot="prefix">R$</div></vaadin-number-field>
                <vaadin-number-field  maxlength="5" placeholder="Venda" id="venda"><div slot="prefix">R$</div></vaadin-number-field>
            </vaadin-custom-field>       
            <vaadin-form-item>
                <vaadin-button theme="primary" @click=${_ => this.persist()} id="btnSalvar">Salvar</vaadin-button>
                <vaadin-button theme="primary" @click=${_ => this.deletar()} id="btnExcluir">Excluir</vaadin-button>
                <vaadin-button theme="primary" @click=${_ =>this.cancelar()} id="btnCancelar">Novo</vaadin-button>
            </vaadin-form-item>
        </vaadin-form-layout>
        <h4>Lista de Produtos</h4>
        <vaadin-grid>
            <vaadin-grid-column width="7%" flex-grow="0" path="id" header="Código" width="4%"></vaadin-grid-column>
            <vaadin-grid-column width="30%" path="descricao" header="Descrição"></vaadin-grid-column>
            <vaadin-grid-column path= "categoria.descricao" header="Categoria"></vaadin-grid-column>
            <vaadin-grid-column path="codigoBarra" header="Referência"></vaadin-grid-column>
            <vaadin-grid-column path="strPrecoCusto" header="Preço de Custo"></vaadin-grid-column>
            <vaadin-grid-column path="strPreco" header="Preço"></vaadin-grid-column>
            <vaadin-grid-column path="quantidade" header="Quantidade"></vaadin-grid-column>
        </vaadin-grid>`;  
        render(template, this);   
    }    
    selectItemsEventListener(){            
        const grid = this.querySelector('vaadin-grid');
        let idTextfield = this.querySelector('#id');
        let descricaoTextfield = this.querySelector('#descricao');
        let referenciaTextfiel = this.querySelector('#referencia');
        let custoTextfield = this.querySelector('#custo');
        let precoTextfield = this.querySelector('#venda');  
        let quantidadeTextfield= this.querySelector('#quantidade')
        let categoriaComob = this.querySelector('vaadin-combo-box'); 
        grid.addEventListener('active-item-changed', function(event){
            const item = event.detail.value;
            grid.selectedItems = item ? [item]:[];
            idTextfield.value=item.id;
            descricaoTextfield.value=item.descricao; 
            referenciaTextfiel.value=item.codigoBarra;
            custoTextfield.value=item.precoCusto;
            precoTextfield.value=item.preco;
            quantidadeTextfield.value=item.quantidade;
            categoriaComob.value = item.categoria.id; 
        });         
        
    }
    persist(){
        if(this.querySelector('#id').value !== ''){
            this.editar()
        }else{
            this.salvar();
        }
    }
    salvar(){       
        let descricaoTextfield = this.querySelector('#descricao');    
        if(descricaoTextfield.validate()){
            this.service.postServices(this.URL, this.getJson())
            .then(response =>{ 
                if(response.ok){
                    this.querySelector('vaadin-grid').dataProvider = (params, callback) =>{
                        response.json().then(
                            json => callback(json, json.length)
                        );
                    }
                    this.showDialog("Produto salvo com sucesso!");
                    this.cleanFields();
                 }              
            }).catch(erro =>{
                 this.showDialog("Erro na conexão como Servidor!");
                console.log(erro.message);
            });
        }     
    }
    editar(){
        let descricaoTextfield = this.querySelector('#descricao'); 
        if(descricaoTextfield.validate()){
            this.service.putServices(this.URL, this.getJson())
            .then(response =>{ 
                if(response.ok){
                    this.querySelector('vaadin-grid').dataProvider = (params, callback) =>{
                        response.json().then(
                            json => callback(json, json.length)
                        );
                    }
                    this.showDialog("Produto alterado com sucesso!");
                    this.cleanFields();
                }              
            }).catch(erro =>{
                this.showDialog("Erro na conexão como Servidor!");
                console.log(erro.message);
            });
        }       
    }
    deletar(){
        if(this.querySelector('#id').value !== ''){
            this.service.deleteServices(this.URL, this.getJson())
            .then(response =>{ 
                if(response.ok){
                    this.querySelector('vaadin-grid').dataProvider = (params, callback) =>{
                        response.json().then(
                            json => callback(json, json.length)
                         );
                    }     
                    this.showDialog("produto delatado com sucesso!");
                    this.cleanFields();
                }              
            }).catch(erro =>{
                this.showDialog("Erro na conexão como Servidor!");
                console.log(erro.message);
            });   
        }        
    }
    cancelar(){
        this.cleanFields();
    }
    findByDescricao(){
        this.querySelector('vaadin-grid').dataProvider = (params, callback)=>{
            this.service.getServices(`resources/produtosFindByDescricao/${this.querySelector('#findDescricao').value}`).then(
            (json) =>{ 
                callback(json, json.length)
                this.querySelector('#findDescricao').value='';
            });
        }
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
    cleanFields(){
        this.querySelector('#id').value='';
        this.querySelector('#descricao').value='';
        this.querySelector('#referencia').value='';
        this.querySelector('#custo').value='';
        this.querySelector('#venda').value='';
        this.querySelector('#quantidade').value=1;       
    }
    getJson(){
        const produto = new Produto(this.querySelector('#id').value, this.querySelector('#descricao').value.trim(),
            this.querySelector('#referencia').value, this.querySelector('#custo').value, this.querySelector('#venda').value,
            this.querySelector('#quantidade').value,this.querySelector('vaadin-combo-box').value);   
        return produto.json;
    }
    attachComboBox(){
        //customElements.whenDefined('vaadin-combo-box').then(_ =>{
        //    this.service.getServicesJson("").then(json =>{
        //         this.querySelector('vaadin-combo-box').items = json;
        //    });
       // });
        this.querySelector('vaadin-combo-box').dataProvider = (params, callback)=>{
            this.service.getServicesJson("resources/categorias").then(
                json => callback(json, json.length));
        }
    }
}
customElements.define('vapp-produtos-view', ProdutosView);