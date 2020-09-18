import {html, render} from 'lit-html/lit-html';
import '@vaadin/vaadin-form-layout';
import '@vaadin/vaadin-text-field/vaadin-text-area';
import '@vaadin/vaadin-text-field/vaadin-text-field';
import '@vaadin/vaadin-text-field/vaadin-integer-field';
import '@vaadin/vaadin-text-field/vaadin-number-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-date-picker';
import '@vaadin/vaadin-dialog';
import Service from '../util/services';
import Venda from '../beans/venda';
export default class VappVenda extends HTMLElement{
    
    constructor(){
        super();    
        this.produtosVendidos = new Array();        
        this.service = new Service();   
        this.URL = "resources/vendas";
        //this.URL = "http://localhost:8080/resources/vendas";
    }
    connectedCallback(){
        this.callServer();
        this.loadingGrid();    
        this.selectItemsEventListener();
        this.attachComboBoxPagamentos();
    }
    callServer(){
        const templete = html `
        
        <vaadin-dialog aria-label="simple"></vaadin-dialog>
        <vaadin-form-layout>
            <vaadin-text-field label="Código" disabled="true" style="width: 100%;" placeholder="Código" id="id"></vaadin-text-field>            
            <vaadin-text-field disabled="true" label="Data da Compra" id="dataCompra"></vaadin-text-field>
            <vaadin-text-field disabled="true" label="Data Pagamento" id="dataPagamento" ></vaadin-text-field>
            <vaadin-number-field label="Valor Pago" maxlength="8" placeholder="Valor Pago" id="valorPago"><div slot="prefix">R$</div></vaadin-number-field>
            <vaadin-text-field disabled="true" label="Cliente" id="clientes"></vaadin-text-field>       
            <vaadin-combo-box required label="Tipo de Pagamento" item-label-path="descricao" item-value-path="id" id="tipoPagamento" error-message="O Tipo de Pagamento não pode ser nulo!"></vaadin-combo-box>
            <vaadin-number-field label="Valor Total" maxlength="8" placeholder="Valor Total" id="total" disabled="true"><div slot="prefix">R$</div></vaadin-number-field> 
            <vaadin-form-item>
                <vaadin-text-field  style="width: 70%;" placeholder="Busca cliente por Nome" id="findClienteByName" clear-button-visible></vaadin-text-field>
                <vaadin-button theme="primary" id="btnFindByDescricao" @click=${_ => this.findClientesByName()}><iron-icon icon="vaadin:search"></iron-icon></vaadin-button>
            </vaadin-form-item>
            <vaadin-form-item colspan="2">
                <h4>Produtos Vendidos</h4>
                <vaadin-grid id="grid-produtos">
                    <vaadin-grid-column path="id" header="Código" width="10%"></vaadin-grid-column>
                    <vaadin-grid-column path="produto.descricao" header="Produto" width="10%"></vaadin-grid-column>
                    <vaadin-grid-column path="produto.categoria.descricao" header="Categoria"></vaadin-grid-column>
                    <vaadin-grid-column path="quantidade" header="Quantidade"></vaadin-grid-column>   
                    <vaadin-grid-column path="produto.strPreco" header="Preço"></vaadin-grid-column>    
                </vaadin-grid>
            </vaadin-fomr-item>              
            <vaadin-form-item>
                <vaadin-button theme="primary" @click=${_ => this.salvar()} id="btnSalvar">Salvar</vaadin-button>
                <vaadin-button theme="primary" @click=${_ => this.delete()} id="btnExcluir">Excluir</vaadin-button> 
            </vaadin-form-item>
        </vaadin-form-layout>
        <h4>Lista de Vendas</h4>
        <vaadin-grid id="grid-vendas">            
            <vaadin-grid-column path="id" header="Código" width="10%"></vaadin-grid-column>
            <vaadin-grid-column path="clientes.nome" header="Cliente"></vaadin-grid-column>
            <vaadin-grid-column path="strDataCompra" header="Data da Compra" width="10%"></vaadin-grid-column>
            <vaadin-grid-column path="strDataRecebimento" header="Data Pagamento"></vaadin-grid-column>
            <vaadin-grid-column path="tipoPagamento" header="Tipo de Pagamento"></vaadin-grid-column>                       
            <vaadin-grid-column path="strValorTotal" header="Total"></vaadin-grid-column>  
            <vaadin-grid-column path="strValorPago" header="Valor Pago"></vaadin-grid-column>    
        </vaadin-grid>`
        render(templete, this);
    }
    loadingGrid(){        
        const grid = this.querySelector('#grid-vendas');
        grid.dataProvider =(params, callback) =>{
            this.service.getServices(this.URL).then((json) => {
                callback(json, json.length);
            });  
        }      
    }
    salvar(){
        if(this.querySelector('#id').value !== '' && this.querySelector('#tipoPagamento').validate()){
            this.service.putServices(this.URL, JSON.stringify({id: this.querySelector('#id').value,
                valorPago: this.querySelector('#valorPago').value, tipoPagamento: this.querySelector('#tipoPagamento').value}))
            .then(response =>{
                if(response.ok){
                    this.querySelector('#grid-vendas').dataProvider =(params, callback) =>{
                        response.json().then(
                            json => callback(json, json.length));
                    }
                    this.showDialog('Venda alterada com sucesso!');  
                    this.cleanField();
                }    
            }).catch(erro =>{
                console.log(erro.message);
            });
        }
    }
    delete(){
        if(this.querySelector('#id').value !== ''){
            this.service.deleteServices(this.URL, JSON.stringify({id: this.querySelector('#id').value}))
            .then(response =>{
                if(response.ok){
                    this.querySelector('#grid-vendas').dataProvider =(params, callback) =>{
                        response.json().then(
                            json => callback(json, json.length)
                        );
                    }
                    this.showDialog('Venda Excluida com sucesso!');
                    this.cleanField();
                }   
            }).catch(erro =>{
                console.error(erro.message);
            });
        }
    }
    cleanField(){
        this.querySelector('#id').value='';
        this.querySelector('#dataCompra').value='';
        this.querySelector('#dataPagamento').value='';
        this.querySelector('#valorPago').value='';
        this.querySelector('#clientes').value='';
        this.querySelector('#total').value='';
        this.querySelector('#grid-produtos').items=[];
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
    getJson(){
        const venda = new Venda(this.querySelector('#id').value, this.querySelector('#dataCompra').value, 
            this.querySelector('#dataPagamento').value,0,this.querySelector('#valorPago').value, this.querySelector('#quantidade').value,
            this.querySelector('#total').value, this.querySelector('#clientes').value, this.produtosVendidos);         
        return venda.json;
    }
    findClientesByName(){  
        this.service.getServices(`resources/findClientesByName/${this.querySelector('#findClienteByName').value}`)
        .then((json) =>{ 
            this.querySelector('#grid-vendas').clearCache();
            this.querySelector('#grid-vendas').dataProvider =(params, callback) =>{
                 callback(json, json.length)
            }
            this.querySelector('#findClienteByName').value='';     
        }).catch(erro =>{
            this.showDialog("Erro na conexão como Servidor!");
            console.log(erro.message);
        }); 
    }
    selectItemsEventListener(){            
        const grid = this.querySelector('#grid-vendas');
        let gridProdutos = this.querySelector('#grid-produtos'); 
        let dataCompraField = this.querySelector('#dataCompra');
        let idField = this.querySelector("#id");
        let dataPagamentoField = this.querySelector('#dataPagamento');
        let valorPagoField = this.querySelector('#valorPago');
        let clienteField = this.querySelector('#clientes');
        let totalField = this.querySelector('#total');
        let tipoPagamentoField = this.querySelector('#tipoPagamento');
        grid.addEventListener('active-item-changed', function(event){
            let item = event.detail.value;
            grid.selectedItems = item ? [item]:[];
            gridProdutos.clearCache();
            gridProdutos.items=item.produtosVendidos;    
            dataCompraField.value = new Date(item.dataCompra).toLocaleDateString('pt-br');
            dataPagamentoField.value= new Date(item.dataRecebimento).toLocaleDateString('pt-br');
            idField.value = item.id;
            valorPagoField.value = item.valorPago;
            clienteField.value = item.clientes.nome;
            tipoPagamentoField.value = 0;
            totalField.value = item.valorTotal.toFixed(2);
        });    
    }
    attachComboBoxPagamentos(){
        customElements.whenDefined('vaadin-combo-box').then(_ =>{
           this.service.getServicesJson(`${this.URL}/tipoPagamento`).then((json) =>{
                const data =[];
                json.forEach(function (item, indice, array) {
                    data.push({"id":indice,"descricao":item})
                })
                this.querySelector('#tipoPagamento').dataProvider = (params, callback)=>{
                    callback(data, data.length)
                };
           })              
        });
    }   
}
customElements.define('vapp-venda-view',VappVenda);

