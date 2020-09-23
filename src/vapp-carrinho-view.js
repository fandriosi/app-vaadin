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
import DataFormat from '../util/data';
import Venda from '../beans/venda';
import Storage from '../util/storage';
export default class VappCarrinho extends HTMLElement{
    
    constructor(){
        super();    
        this.produtosVendidos = new Array();        
        this.service = new Service();     
        this.storage = new Storage('produtos');  
        this.PRODUTO_URL = "resources/produtos";
        this.CLIENTE_URL = "resources/clientes";
        this.URL = "resources/vendas";
        //this.PRODUTO_URL = "http://localhost:8080/resources/produtos";
        //this.CLIENTE_URL = "http://localhost:8080/resources/clientes";
        //this.URL = "http://localhost:8080/resources/vendas";
    }
    connectedCallback(){
        this.callServer();
        this.attachDate();
        this.attachComboBox();
        this.athachInputListener();
        this.selectItemsEventListener();
        this.comparedDates();
        this.attachComboBoxPagamentos();
    }
    callServer(){
        const templete = html `
        <vaadin-dialog aria-label="simple"></vaadin-dialog>
        <vaadin-form-layout>
            <vaadin-text-field label="Código do Produto" disabled="true" style="width: 100%;" placeholder="Código" id="id"></vaadin-text-field>            
            <vaadin-date-picker required label="Data da Compra" id="dataCompra" error-message="A data da Compra não pode ser nulo!"></vaadin-date-picker>
            <vaadin-date-picker required label="Data Pagamento" id="dataPagamento" error-message="A data do Pagamento não pode ser nulo!"></vaadin-date-picker>
            <vaadin-number-field label="Valor Pago" maxlength="8" placeholder="Valor Pago" id="valorPago"><div slot="prefix">R$</div></vaadin-number-field>
            <vaadin-form-item>
                <vaadin-text-field label="Nome Cliente" style="width: 80%;" placeholder="Buscar por Nome do Cliente" id="findNome" clear-button-visible></vaadin-text-field>
                <vaadin-button theme="primary" id="btnFindNome" @click=${_ => this.findByNome()}><iron-icon icon="vaadin:search"></iron-icon></vaadin-button></br>
                <vaadin-combo-box required style="width: 100%;" label="Cliente" item-label-path="nome" item-value-path="id" id="clientes" error-message="O Cliente não pode ser nulo!"></vaadin-combo-box>
            </vaadin-form-item>            
            <vaadin-form-item>
                <vaadin-text-field label="Descrição do Produto" style="width: 80%;" placeholder="Buscar por Descrição do Produto" id="findDescricao" clear-button-visible></vaadin-text-field>
                <vaadin-button theme="primary" id="btnFindDescricao" @click=${_ => this.findByDescricao()}><iron-icon icon="vaadin:search"></iron-icon></vaadin-button></br>
                <vaadin-combo-box required label="Produto"  style="width: 100%;" item-label-path="descricao" item-value-path="id" id="produtos" error-message="O produto não pode ser nulo!"></vaadin-combo-box>
            </vaadin-form-item>            
            <vaadin-combo-box required label="Tipo de Pagamento" item-label-path="descricao" item-value-path="id" id="tipoPagamento" error-message="O Tipo de Pagamento não pode ser nulo!"></vaadin-combo-box>
            <vaadin-integer-field required min="1" max="100" has-controls label="Quantidade" id="quantidade"></vaadin-integer-field>
            <vaadin-form-item>
                <vaadin-number-field label="Valor Total" maxlength="8" placeholder="Valor Total" id="total" readonly="true"><div slot="prefix">R$</div></vaadin-number-field>
                <vaadin-number-field label="Desconto" maxlength="8" placeholder="Desconto" id="desconto"><div slot="prefix">R$</div></vaadin-number-field>
            </vaadin-form-item>            
            <vaadin-form-item>
                <vaadin-button theme="primary" @click=${_ => this.addProdutos()} id="btnSalvar">Adicionar Produto</vaadin-button>
                <vaadin-button theme="primary" @click=${_ => this.removerItem()} id="btnExcluir">Excluir Produto</vaadin-button>                
                <vaadin-button theme="primary" @click=${_ =>this.concluirVenda()} id="btnCancelar">Concluir Venda</vaadin-button>
                <vaadin-button theme="primary" @click=${_ =>this.cancelar()} id="btnCancelar">Cancelar Venda</vaadin-button>
            </vaadin-form-item>
        </vaadin-form-layout>
        <h4>Lista de Vendas</h4>
        <vaadin-grid>
            <vaadin-grid-column path="produto.id" header="Código Produto" width="10%"></vaadin-grid-column>
            <vaadin-grid-column path="produto.descricao" header="Descrição" width="10%"></vaadin-grid-column>
            <vaadin-grid-column path="produto.categoria.descricao" header="Categoria"></vaadin-grid-column>
            <vaadin-grid-column path="produto.codigoBarra" header="Referência"></vaadin-grid-column>            
            <vaadin-grid-column path="produto.strPreco" header="Preço"></vaadin-grid-column>
            <vaadin-grid-column path="quantidade" header="Quantidade"></vaadin-grid-column>
        </vaadin-grid>
        </vaadin-form-layout>`
        render(templete, this);
    }
    addProdutos(){
    if(this.comparedDates()){
        if(this.querySelector('#dataCompra').validate() && this.querySelector('#dataPagamento').validate() && 
            this.querySelector('#produtos').validate() && this.querySelector('#clientes').validate()&& this.querySelector('#quantidade').validate()){
                this.service.getServices(`${this.PRODUTO_URL}/${this.querySelector('#produtos').value}`)
                .then(json =>{
                    this.produtosVendidos.push({quantidade: this.querySelector('#quantidade').value,
                    produto:json});
                    this.querySelector('vaadin-grid').dataProvider =(params, callback) =>{
                        callback(this.produtosVendidos, this.produtosVendidos.length)    
                } 
                let total=0;
                this.produtosVendidos.forEach(function (item, indice, array) {
                    total= total+ item.produto.preco * item.quantidade;                        
                });
                this.querySelector('#total').value=total.toFixed(2);
                this.editionField(false);
            })
        }
    }else{
        this.showDialog("A Data do Pagamento não pode ser Menor que a Data da Compra!")
    }
        
    }
    removerItem(){
        this.produtosVendidos = this.produtosVendidos.filter((item)=>{
            return item.produto.id != this.querySelector('#id').value;
        });
        this.querySelector('vaadin-grid').dataProvider =(params, callback) =>{
            callback(this.produtosVendidos, this.produtosVendidos.length) 
        }   
        let total=0;
        if(this.produtosVendidos.length > 0){
            this.produtosVendidos.forEach(function (item, indice, array) {
                total= total+ item.produto.preco * item.quantidade;                        
            });
        }
        else{
            total = 0;
        }
        this.querySelector('#total').value=total.toFixed(2);
    }
    concluirVenda(){
        if(this.querySelector('#dataCompra').validate() && this.querySelector('#dataPagamento').validate() && 
            this.querySelector('#produtos').validate() && this.querySelector('#clientes').validate()&& this.querySelector('#quantidade').validate()
             && this.produtosVendidos.length > 0 && this.querySelector('#tipoPagamento').validate()){
            this.service.postServices(this.URL,this.getJson())
                .then(response =>{
                    if(response.ok){
                        this.showDialog("Venda salva com sucesso!");
                    }
                }).catch(erro =>{
                    this.showDialog("Erro na conexão como Servidor!");
                    console.log(erro.message);
            }); 
                this.cancelar();     
        }             
    }
    cancelar(){
        this.editionField(true);
        this.produtosVendidos = [];
        this.querySelector('vaadin-grid').clearCache();
    }
    findByDescricao(){         
        let descricao = this.querySelector('#findDescricao').value;
        if(descricao.trim()!=''){
            this.service.getServices(`${this.PRODUTO_URL}FindByDescricao/${descricao}`)
            .then((json) =>{ 
                this.querySelector('#produtos').clearCache();    
                this.querySelector('#produtos').dataProvider = (params, callback) =>{
                    callback(json, json.length);
                }
                this.querySelector('#findDescricao').value="";
                 
            })  
        }
        
    }
    findByNome(){ 
        let nome = this.querySelector('#findNome').value;
        if(nome.trim() != ''){
            this.service.getServices(`${this.CLIENTE_URL}FindByNome/${nome}`)
            .then((json) =>{ 
                this.querySelector('#clientes').clearCache();    
                this.querySelector('#clientes').dataProvider = (params, callback) =>{
                    callback(json, json.length);
                }
                this.querySelector('#findNome').value="";
                 
            }) 
        }        
    }
    comparedDates(){
        if(new Date(this.querySelector('#dataCompra').value).getTime() <=
            new Date(this.querySelector('#dataPagamento').value).getTime()){
            return true;
        }else{
            return false;
        };
    }
    athachInputListener(){
        this.querySelector('#quantidade').addEventListener('click', _ =>{
            this.service.getServicesJson(`${this.PRODUTO_URL}/${this.querySelector('#produtos').value}`)
            .then((json) =>{
                if(this.querySelector('#quantidade').value >= json.quantidade){
                    this.showDialog('Quantidade excede o total dos produtos em Estoque');
                    this.querySelector('#btnSalvar').disabled=true;
                }else{
                    this.querySelector('#btnSalvar').disabled=false;
                }
            });
        });
    }
    editionField(option){
        let idField = this.querySelector('#id');
        let dtCompraField = this.querySelector('#dataCompra');
        let dtPagamentoField = this.querySelector('#dataPagamento');
        let valorPagoField = this.querySelector('#valorPago');
        let clientesField = this.querySelector('#clientes');
        let quantidadeField = this.querySelector('#quantidade');
        let valorTotalField = this.querySelector('#total');
        let descontoField = this.querySelector('#desconto');
        let btnFindNome = this.querySelector('#btnFindNome');
        if(option){
            dtCompraField.readonly = false;
            dtPagamentoField.readonly = false;
            clientesField.readonly= false;
            idField.value = "";
            dtCompraField.value = "";
            dtPagamentoField.value= "";
            valorPagoField.value= "";
            valorTotalField.value="";
            descontoField.value ="";
            quantidadeField.value=0;
            btnFindNome.disabled= false;
        }else{
            dtCompraField.readonly = true;
            dtPagamentoField.readonly = true;
            clientesField.readonly= true;
            btnFindNome.disabled= true;
        }
    }
    attachDate(){
        this.querySelector('#dataCompra').i18n=DataFormat.data;
        this.querySelector('#dataPagamento').i18n=DataFormat.data;
    }
    attachComboBox(){
       this.querySelector('#clientes').dataProvider = (params, callback) =>{
            this.service.getServicesJson(this.CLIENTE_URL)
            .then(json => callback(json, json.length));
        } 
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
            this.querySelector('#dataPagamento').value,this.querySelector('#tipoPagamento').value,this.querySelector('#valorPago').value, 
            this.querySelector('#quantidade').value,this.querySelector('#total').value, this.querySelector('#desconto').value,
             this.querySelector('#clientes').value, this.produtosVendidos);         
        return venda.json;
    }
    selectItemsEventListener(){            
        const grid = this.querySelector('vaadin-grid');
        let idTextfield = this.querySelector('#id'); 
        grid.addEventListener('active-item-changed', function(event){
            let item = event.detail.value;
            grid.selectedItems = item ? [item]:[];
            if(item !== null){
                idTextfield.value=item.produto.id;
            }            
        });          
    }
}
customElements.define('vapp-carrinho-view',VappCarrinho);

