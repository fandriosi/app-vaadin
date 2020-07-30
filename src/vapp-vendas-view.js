import {html, render} from 'lit-html/lit-html';
import '@vaadin/vaadin-form-layout';
import '@vaadin/vaadin-text-field/vaadin-text-area';
import '@vaadin/vaadin-text-field/vaadin-text-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-date-picker';
import Service from '../util/services';
import DataFormat from '../util/data';
import '../beans/produtos';
import Produtos from '../beans/produtos';

export default class VappVendas extends HTMLElement{
    

    constructor(){
        super();    
        this.service = new Service();       
    }
    connectedCallback(){
        this.callServer();
        this.loadingGrid();
        this.attachDate();
        this.attachComboBox();
    }
    callServer(){
        const templete = html `
        <vaadin-form-layout>
            <vaadin-text-field label="Código" disabled="true" style="width: 100%;" placeholder="Código" id="id"></vaadin-text-field>
            <vaadin-text-field label="Quantidade" id="quantidade"></vaadin-text-field>
            <vaadin-date-picker label="Data da Compra" id="dataCompra"></vaadin-date-picker>
            <vaadin-date-picker label="Data Pagamento" id="dataPagamento"></vaadin-date-picker>
            <vaadin-combo-box label="Cliente" item-label-path="nome" item-value-path="id" id="clientes"></vaadin-combo-box>
            <vaadin-form-item>
                <vaadin-text-field  style="width: 70%;" placeholder="Buscar por Descrição do Produto" id="findDescricao" clear-button-visible></vaadin-text-field>
                <vaadin-button theme="primary" id="btnFindByDescricao" @click=${_ => this.findByDescricao()}><iron-icon icon="vaadin:search"></iron-icon></vaadin-button>
            </vaadin-form-item>
            <vaadin-combo-box label="Produto" item-label-path="descricao" item-value-path="id" id="produtos"></vaadin-combo-box>
            <vaadin-form-item>
                <vaadin-button theme="primary" @click=${_ => this.salvar()} id="btnSalvar">Iniciar Venda</vaadin-button>
                <vaadin-button theme="primary" @click=${_ =>this.editar()} id="btnEditar">Contiunar Vendendo</vaadin-button>
                <vaadin-button theme="primary" @click=${_ => this.deletar()} id="btnExcluir">Excluir Produto</vaadin-button>                
                <vaadin-button theme="primary" @click=${_ =>this.cancelar()} id="btnCancelar">Encerrar Venda</vaadin-button>
            </vaadin-form-item>
        </vaadin-form-layout>
        <vaadin-grid>
            <vaadin-grid-column path="id" header="Código" width="15%"></vaadin-grid-column>
            <vaadin-grid-column path="descricao" header="Descrição"></vaadin-grid-column>
            <vaadin-grid-column path= "categoria.descricao" header="Categoria"></vaadin-grid-column>
            <vaadin-grid-column path="codigoBarra" header="Referência"></vaadin-grid-column>
            <vaadin-grid-column path="precoCusto" header="Preço de Custo"></vaadin-grid-column>
            <vaadin-grid-column path="preco" header="Preço"></vaadin-grid-column>
        </vaadin-grid>
        </vaadin-form-layout>`
        render(templete, this);
    }
    salvar(){
        let descricaoTextfield = this.querySelector('#descricao');    
        if(descricaoTextfield.validate()){
            this.service.postServices("http://localhost:8080/resources/venda", this.getJson())
            .then(response =>{ 
                if(response.ok){
                    this.querySelector('vaadin-grid').dataProvider = (params, callback) =>{
                        response.json().then(
                            json => callback(json, json.length)
                        );
                    }
                    this.showDialog("Venda salva com sucesso!");
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

    }
    editar(){

    }
    cancelar(){

    }
    findByDescricao(){
        let descricaoTextfield = this.querySelector('#findDescricao');    
        let data = JSON.stringify({descricao: descricaoTextfield.value});
        this.service.postServices("http://localhost:8080/resources/produtosFindByDescricao", data)
        .then(response =>{ 
            if(response.ok){
                this.querySelector('#produtos').clearCache();
                this.querySelector('#produtos').dataProvider = (params, callback) =>{
                    response.json().then( json => callback(json, json.length));
                }
                descricaoTextfield.value="";
            }              
        }).catch(erro =>{
            this.showDialog("Erro na conexão como Servidor!");
            console.log(erro.message);
        });  
    }
    attachDate(){
        this.querySelector('#dataCompra').i18n=DataFormat.data;
        this.querySelector('#dataPagamento').i18n=DataFormat.data;
    }
    attachComboBox(){
        customElements.whenDefined('vaadin-combo-box').then(_ =>{
            this.querySelector('#clientes').dataProvider = (params, callback) =>{
                this.service.getServicesJson("http://localhost:8080/resources/clientes").then(
                    json => callback(json, json.length)
                );
            } 
        });
    }
    loadingGrid(){        
        const grid = this.querySelector('vaadin-grid');
        grid.dataProvider =(params, callback) =>{
            this.service.getServices("http://localhost:8080/resources/vendas").then(
                json => callback(json, json.length));
        }                
    }    
}
customElements.define('vapp-vendas-view',VappVendas);

