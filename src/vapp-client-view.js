import {html, render} from 'lit-html/lit-html.js';
import '@vaadin/vaadin-form-layout' ;
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-grid';
import Service from '../util/services';
export default class ClienteView extends HTMLElement{
    constructor(){
        super();
        this.service = new Service();
        this.loadingGrid();
    }
    connectedCallback(){
        this.callService();
        this.attachListener();
        this.loadingGrid();
        console.log('connectCallback')
    }
    callService(){
        const templete = html `
        <vaadin-form-layout>
            <vaadin-text-field label="Nome" id="nome"></vaadin-text-field>
            <vaadin-form-item>
                <vaadin-button theme="primary">Salvar</vaadin-button>
            </vaadin-form-item>
        </vaadin-form-layout>
        <vaadin-grid>
            <vaadin-grid-column path="id" header="Código"></vaadin-grid-column>
            <vaadin-grid-column path="nome" header="Nome"></vaadin-grid-column>
        </vaadin-grid>`;
        render(templete, this);
    }    
    attachListener(){
        const button = this.querySelector('vaadin-button');
        button.addEventListener('click', _ =>{
            this.salvar();
        });
    }
    salvar(){
        const nome = this.querySelector('#nome');
        const data = {nome: nome.value};
        this.service.postServices("http://localhost:8080/clientes", data)
        .then(response =>{ 
            console.log('response',response);
            this.loadingGrid();
            const textfield = this.querySelector('vaadin-text-field');
            console.log('campo',textfield.value);
        });
    }
    loadingGrid(){
        customElements.whenDefined('vaadin-grid').then(_ =>{
            const grid = this.querySelector('vaadin-grid');
          //  grid.dataProvider = (params, callback) =>{
          //      fetch("")
          //      .then(response => response.json()).then(
         //           json => callback(json, json.length));
         //
            grid.dataProvider =(params, callback) =>{
                this.service.getServices("http://localhost:8080/clientes")
                .then(data => callback(data, data.length));
            }
        });
    }
}
customElements.define('cliente-view',ClienteView);

