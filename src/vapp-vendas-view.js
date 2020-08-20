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
export default class VappVendas extends HTMLElement{
    
    constructor(){
        super();    
        this.produtosVendidos = new Array();        
        this.service = new Service();     
        this.storage = new Storage('produtos');  
    }
    connectedCallback(){
        this.callServer();
        this.attachDate();
        this.attachComboBox();
        this.athachInputListener();
    }
    callServer(){
        const templete = html `
        <vaadin-dialog aria-label="simple"></vaadin-dialog>
        <vaadin-form-layout>
            <vaadin-text-field label="Código" disabled="true" style="width: 100%;" placeholder="Código" id="id"></vaadin-text-field>            
            <vaadin-date-picker required label="Data da Compra" id="dataCompra" error-message="A data da Compra não pode ser nulo!"></vaadin-date-picker>
            <vaadin-date-picker required label="Data Pagamento" id="dataPagamento" error-message="A data do Pagamento não pode ser nulo!"></vaadin-date-picker>
            <vaadin-number-field label="Valor Pago" maxlength="8" placeholder="Valor Pago" id="valorPago"><div slot="prefix">R$</div></vaadin-number-field>
            <vaadin-combo-box required label="Cliente" item-label-path="nome" item-value-path="id" id="clientes" error-message="O Cliente não pode ser nulo!"></vaadin-combo-box>
            <vaadin-form-item>
                <vaadin-text-field  style="width: 70%;" placeholder="Buscar por Descrição do Produto" id="findDescricao" clear-button-visible></vaadin-text-field>
                <vaadin-button theme="primary" id="btnFindByDescricao" @click=${_ => this.findByDescricao()}><iron-icon icon="vaadin:search"></iron-icon></vaadin-button>
            </vaadin-form-item>
            <vaadin-combo-box required label="Produto" item-label-path="descricao" item-value-path="id" id="produtos" error-message="O produto não pode ser nulo!"></vaadin-combo-box>
            <vaadin-integer-field required min="1" max="100" has-controls label="Quantidade" id="quantidade"></vaadin-integer-field>
            <vaadin-number-field label="Valor Total" maxlength="8" placeholder="Valor Total" id="total" readonly="true"><div slot="prefix">R$</div></vaadin-number-field>
            <vaadin-form-item>
                <vaadin-button theme="primary" @click=${_ => this.iniciarVenda()} id="btnSalvar">Iniciar Venda</vaadin-button>
                <vaadin-button theme="primary" @click=${_ =>this.continuarVenda()} id="btnEditar">Contiunar Vendendo</vaadin-button>
                <vaadin-button theme="primary" @click=${_ => this.deletar()} id="btnExcluir">Excluir Produto</vaadin-button>                
                <vaadin-button theme="primary" @click=${_ =>this.encerrarVenda()} id="btnCancelar">Encerrar Venda</vaadin-button>
            </vaadin-form-item>
        </vaadin-form-layout>
        <vaadin-grid>
            <vaadin-grid-column path="produto.id" header="Código Produto" width="10%"></vaadin-grid-column>
            <vaadin-grid-column path="produto.descricao" header="Descrição" width="10%"></vaadin-grid-column>
            <vaadin-grid-column path="produto.categoria.descricao" header="Categoria"></vaadin-grid-column>
            <vaadin-grid-column path="produto.codigoBarra" header="Referência"></vaadin-grid-column>
            <vaadin-grid-column path="produto.preco" header="Preço"></vaadin-grid-column>
            <vaadin-grid-column path="quantidade" header="Quantidade"></vaadin-grid-column>
        </vaadin-grid>
        </vaadin-form-layout>`
        render(templete, this);
    }
    iniciarVenda(){
        if(this.querySelector('#dataCompra').validate() && this.querySelector('#dataPagamento').validate() && 
            this.querySelector('#produtos').validate() && this.querySelector('#clientes').validate()&& this.querySelector('#quantidade').validate()){
                this.service.getServices("http://localhost:8080/resources/produto/"+this.querySelector('#produtos').value)
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
                this.disabledInsercao(false);
                this.editionField(false);
            })
        }
    }
    deletar(){
        this.service.deleteServices("http://localhost:8080/resources/venda", this.getJson())
            .then(response =>{ 
                if(response.ok){
                    this.querySelector('vaadin-grid').dataProvider = (params, callback) =>{
                        response.json().then(
                            json => callback(json, json.length)
                         );
                    }     
                    this.showDialog("Venda delatada com sucesso!");
                    this.editionField(true);
                    this.disabledInsercao(true);
                }              
            }).catch(erro =>{
                this.showDialog("Erro na conexão como Servidor!");
                console.log(erro.message);
            });  
    }
    continuarVenda(){
        if(this.querySelector('#produtos').validate() && this.querySelector('#quantidade').validate()){
            this.service.getServices("http://localhost:8080/resources/produto/"+this.querySelector('#produtos').value)
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
            this.disabledInsercao(false);
            this.editionField(false);
            });
        }
    }
    encerrarVenda(){
        this.service.postServices("http://localhost:8080/resources/venda",this.getJson())
        .then(response =>{
            if(response.ok){
                this.showDialog("Venda salva com sucesso!");
                this.querySelector('vaadin-grid').dataProvider = (params, callback) =>{
                    response.json().then(json => callback(json, json.length))
                }
            }
        }).catch(erro =>{
            this.showDialog("Erro na conexão como Servidor!");
            console.log(erro.message);
        });  
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
    athachInputListener(){
        this.querySelector('#quantidade').addEventListener('click', _ =>{
            this.service.getServicesJson('http://localhost:8080/resources/produto/'+ this.querySelector('#produtos').value)
            .then(json =>{
                if(this.querySelector('#quantidade').value > json.quantidade){
                    this.showDialog('Quantidade excede o total dos produtos em Estoque');
                    if(this.querySelector('#id').value === 0){
                        this.querySelector('#btnSalvar').disabled=true;
                    }else{
                        this.querySelector('#btnSalvar').disabled=true;
                        this.querySelector('#btnEditar').disabled=true;
                    }
                    
                }else{
                    if(this.querySelector('#id').value === 0){
                        this.querySelector('#btnSalvar').disabled=false;
                    }else{
                        this.querySelector('#btnEditar').disabled=false;
                    }                    
                }
            });
        });
    }
    editionField(option){
        let dtCompraField = this.querySelector('#dataCompra');
        let dtPagamentoField = this.querySelector('#dataPagamento');
        let valorPagoField = this.querySelector('#valorPago');
        let clientesField = this.querySelector('#clientes');
        let quantidadeField = this.querySelector('#quantidade');
        if(option){
            idField.value = "";
            dtCompraField.value = "";
            dtPagamentoField.value= "";
            valorPagoField.value= "";
            quantidadeField.value=1;
        }else{
            dtCompraField.readonly = true;
            dtPagamentoField.readonly = true;
            clientesField.readonly= true;
        }
    }
    attachDate(){
        this.querySelector('#dataCompra').i18n=DataFormat.data;
        this.querySelector('#dataPagamento').i18n=DataFormat.data;
    }
    attachComboBox(){
        customElements.whenDefined('vaadin-combo-box').then(_ =>{
            this.querySelector('#clientes').dataProvider = (params, callback) =>{
                this.service.getServicesJson("http://localhost:8080/resources/clientes")
                .then(json => console.log(callback(json, json.length)));
            } 
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
        console.log(this.querySelector('#produtos').value);
        const venda = new Venda(this.querySelector('#id').value, this.querySelector('#dataCompra').value, 
            this.querySelector('#dataPagamento').value,0,this.querySelector('#valorPago').value, this.querySelector('#quantidade').value,
            this.querySelector('#clientes').value, this.produtosVendidos);         
        return venda.json;
    }
    disabledInsercao(option){
        let buttonSalvar = this.querySelector('#btnSalvar');
        let buttonExcluir = this.querySelector('#btnExcluir');
        let buttonEditar = this.querySelector('#btnEditar');
        if(option){
            buttonExcluir.disabled=true;
            buttonSalvar.disabled=false;
            buttonEditar.disabled=true;
        }else{
            buttonExcluir.disabled=true;
            buttonSalvar.disabled=true;
            buttonEditar.disabled=false;
        }
    }
}
customElements.define('vapp-vendas-view',VappVendas);

