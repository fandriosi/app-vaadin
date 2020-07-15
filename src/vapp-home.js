import {html, render} from 'lit-html/lit-html';
import '@vaadin/vaadin-form-layout';
import '@vaadin/vaadin-text-field/vaadin-text-area';
import '@vaadin/vaadin-text-field/vaadin-text-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-date-picker';
import Service from '../util/services';

export default class VappHome extends HTMLElement{
    constructor(){
        super();    
        this.service = new Service();

    }
    connectedCallback(){
        this.callServer();
        this.loadingGrid();
        this.attachDate();
        this.attachListner();
        this.attachComboBox();
    }
    callServer(){
        const templete = html `
        <vaadin-form-layout>
            <vaadin-text-field label="Quantidade" id="quantidade"></vaadin-text-field>
            <vaadin-date-picker label="Data da Compra"></vaadin-date-picker>
            <vaadin-date-picker label="Data Pagamento"></vaadin-date-picker>
            <vaadin-combo-box label="Cliente" item-label-path="nome" item-value-path="id" id="clientes"></vaadin-combo-box>
            <vaadin-combo-box label="Produto" item-label-path="descricao" item-value-path="id" id="produtos"></vaadin-combo-box>
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
        </vaadin-grid>
        </vaadin-form-layout>`
        render(templete, this);
    }
    attachDate(){
        Sugar.Date.setLocale('pt');
        var datepicker = this.querySelector('vaadin-date-picker');
        datepicker.i18n = {
            week: 'semana',
            calendar: 'calendario',
            clear: 'limpar',
            today: 'hoje',
            cancel: 'cancelar',
            firstDayOfWeek: 1,
            monthNames:
                'janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro'.split('_'),
            weekdays: 'domingo_segunda-feira_terça-feira_quarta-feira_quinta-feira_sexta-feira_sabado'.split('_'),
            weekdaysShort: 'dom_seg_ter_qua_qui_sex_sab'.split('_'),
            formatDate: function(date) {
                // Sugar Date expects a native date. The `date` is in format `{ day: ..., month: ..., year: ... }`
                return Sugar.Date.format(Sugar.Date.create(date), '{short}');
            },
            formatTitle: function(monthName, fullYear) {
                return monthName + ' ' + fullYear;
            },
            parseDate: function(dateString) {
                const date = Sugar.Date.create(dateString);
                return {
                day: date.getDate(),
                month: date.getMonth(),
                year: date.getFullYear()
                };
            }
        };
    }
    attachListner(){
        customElements.whenDefined('vaadin-button').then(_ =>{
            let i = 0;
            let button = this.querySelector('vaadin-button')
            button.addEventListener('click', function() {
                console.log('click');
                button.nextElementSibling.textContent = ++i;
            });
        });
    }
    attachComboBox(){
        customElements.whenDefined('vaadin-combo-box').then(_ =>{
            let clienteComboBox = this.querySelector('#clientes');
            let produtoComboBox = this.querySelector('#produtos')
            this.service.getServicesJson("http://localhost:8080/clientes").then(json =>{
                clienteComboBox.items = json;
            });
            this.service.getServicesJson("http://localhost:8080/produtos").then(json =>{
                produtoComboBox.items = json;
            });
        });
    }
    loadingGrid(){        
        const grid = this.querySelector('vaadin-grid');
        grid.dataProvider =(params, callback) =>{
            this.service.getServices("http://localhost:8080/venda").then(
                json => console.log(json));
        }                
    }
}
customElements.define('vapp-home',VappHome);

