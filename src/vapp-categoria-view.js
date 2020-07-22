import {html, render} from 'lit-html/lit-html';
import '@vaadin/vaadin-form-layout' ;
import '@vaadin/vaadin-custom-field';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-dialog';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-grid';
import Service from '../util/services';
import Categoria from '../beans/categoria'
export default class CategoriaView extends HTMLElement{
   
    constructor(){
        super();
        this.service = new Service();      
    }
    connectedCallback(){
        this.createTemplate(); 
        this.loadingGrid();
        this.fiedEventListener();        
        this.selectItemsEventListener();
        this.disabledInsercao(true);
    }
    createTemplate(){
        const templete = html `
        <vaadin-dialog aria-label="simple"></vaadin-dialog>
        <vaadin-form-layout>
            <vaadin-text-field label="Código" disabled="true" style="width: 100%;" placeholder="Código" id="id"></vaadin-text-field>
            <vaadin-text-field required style="width: 100%;" placeholder="Decrição" label="Descrição" id="descricao" error-message="A descrição da categoria é obrigatório!" clear-button-visible></vaadin-text-field>      
            <vaadin-form-item>
                <vaadin-button theme="primary" @click=${_ => this.salvar()} id="btnSalvar">Salvar</vaadin-button>
                <vaadin-button theme="primary" @click=${_ => this.deletar()} id="btnExcluir">Excluir</vaadin-button>
                <vaadin-button theme="primary" @click=${_ =>this.editar()} id="btnEditar">Editar</vaadin-button>
                <vaadin-button theme="primary" @click=${_ =>this.cancelar()} id="btnCancelar">Cancelar</vaadin-button>
            </vaadin-form-item>
        </vaadin-form-layout>
        <vaadin-grid>
            <vaadin-grid-column path="id" header="Código" width="15%"></vaadin-grid-column>
            <vaadin-grid-column path="descricao" header="Descrição"></vaadin-grid-column>
        </vaadin-grid>`;
        render(templete, this);
    } 
    fiedEventListener(){
        let descricaoTextfield = this.querySelector('#descricao');
        descricaoTextfield.addEventListener('click',_ =>{      
            this.disabledInsercao(true);
            this.editionField(false);
        }); 
    }
    selectItemsEventListener(){            
        const grid = this.querySelector('vaadin-grid');
        let idTextfield = this.querySelector('#id');
        let descricaoTextfield = this.querySelector('#descricao');  
        let btnExcluir = this.querySelector('#btnExcluir');      
        let btnEditar = this.querySelector('#btnEditar');
        let btnSalvar = this.querySelector('#btnSalvar');
        grid.addEventListener('active-item-changed', function(event){
            const item = event.detail.value;
            grid.selectedItems = item ? [item]:[];
            idTextfield.value=item.id;
            descricaoTextfield.value=item.descricao; 
            descricaoTextfield.readonly= true;       
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
            this.service.postServices("http://localhost:8080/resources/categoria", this.getJson())
            .then(response =>{ 
                if(response.ok){
                    this.loadingGrid();
                    this.showDialog("Categoria salva com sucesso!");
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
        let descricaoTextfield = this.querySelector('#descricao');
        if(descricaoTextfield.validate()){
            this.service.putServices("http://localhost:8080/resources/categoria", this.getJson())
                .then(response =>{ 
                    if(response.ok){
                        this.loadingGrid();
                        this.showDialog("Categoria alterada com sucesso!");
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
        this.service.deleteServices("http://localhost:8080/resources/categoria", this.getJson())
            .then(response =>{ 
                if(response.ok){
                    this.loadingGrid();       
                    this.showDialog("Categoria delatado com sucesso!");
                    this.editionField(true);
                        this.disabledInsercao(true);
                }              
            }).catch(erro =>{
                this.showDialog("Erro na conexão como Servidor!");
                console.log(erro.message);
            });   
    }
    loadingGrid(){        
        const grid = this.querySelector('vaadin-grid');
        grid.dataProvider =(params, callback) =>{
            this.service.getServices("http://localhost:8080/resources/categorias").then(
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
    cancelar(){
        this.editionField(true);
        this.disabledInsercao(true);
    }
    editionField(option){
        let idField = this.querySelector('#id');
        let descricaoField = this.querySelector('#descricao');
        if(option){
            idField.value = "";
            descricaoField.value = "";
        }else{
            descricaoField.readonly = false;
        }
        
    }
    getJson(){
        const categoria = new Categoria(this.querySelector('#id').value, this.querySelector('#descricao').value);
        console.log(categoria.json)
        return categoria.json;
    }
}
customElements.define('vapp-categoria-view', CategoriaView);