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
        this.URL = "resources/categorias";  
        //this.URL = "http://localhost:8080/resources/categorias";
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
            <vaadin-text-field required style="width: 100%;" placeholder="Decrição" label="Descrição" id="descricao" error-message="A descrição da categoria é obrigatório!" clear-button-visible></vaadin-text-field>      
            <vaadin-form-item>
                <vaadin-button theme="primary" @click=${_ => this.persist()} id="btnSalvar">Salvar</vaadin-button>
                <vaadin-button theme="primary" @click=${_ => this.deletar()} id="btnExcluir">Excluir</vaadin-button>
                <vaadin-button theme="primary" @click=${_ =>this.cancelar()} id="btnCancelar">Novo</vaadin-button>
            </vaadin-form-item>
        </vaadin-form-layout>
        <h4>Lista de Categorias</h4>
        <vaadin-grid>
            <vaadin-grid-column path="id" header="Código" width="15%"></vaadin-grid-column>
            <vaadin-grid-column path="descricao" header="Descrição"></vaadin-grid-column>
        </vaadin-grid>`;
        render(templete, this);
    } 
    selectItemsEventListener(){            
        const grid = this.querySelector('vaadin-grid');
        let idTextfield = this.querySelector('#id');
        let descricaoTextfield = this.querySelector('#descricao');  
        grid.addEventListener('active-item-changed', function(event){
            const item = event.detail.value;
            grid.selectedItems = item ? [item]:[];
            idTextfield.value=item.id;
            descricaoTextfield.value=item.descricao;
        });          
    }
    persist(){
        if(this.querySelector('#id').value !== ''){
            this.editar();
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
                    this.showDialog("Categoria salva com sucesso!");
                    this.cleanField();
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
                        this.showDialog("Categoria alterada com sucesso!");
                        this.cleanField();
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
                    this.showDialog("Categoria delatado com sucesso!");
                    this.cleanField();
                }              
            }).catch(erro =>{
                this.showDialog("Erro na conexão como Servidor!");
                console.log(erro.message);
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
    cancelar(){
        this.cleanField();
    }
    cleanField(){
        this.querySelector('#id').value ='';
        this.querySelector('#descricao').value='';        
    }
    getJson(){
        const categoria = new Categoria(this.querySelector('#id').value, this.querySelector('#descricao').value);
        return categoria.json;
    }
}
customElements.define('vapp-categoria-view', CategoriaView);