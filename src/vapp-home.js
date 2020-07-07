import {html, render} from 'lit-html/lit-html';
import '@vaadin/vaadin-form-layout';
import '@vaadin/vaadin-text-field/vaadin-text-area';
import '@vaadin/vaadin-text-field/vaadin-text-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-date-picker';

export default class VappHome extends HTMLElement{
    constructor(){
        super();       
        
    }
    connectedCallback(){
        this.callServer();
        this.attachDate();
        this.attachListner();
    }
    callServer(){
        const templete = html `
        <vaadin-form-layout>
            <vaadin-text-field label="First Name" value="Jane"></vaadin-text-field>
            <vaadin-text-field label="Last Name" value="Doe"></vaadin-text-field>
            <vaadin-text-field label="Email" value="jane.doe@example.com"></vaadin-text-field>
            <vaadin-date-picker label="Birthday"></vaadin-date-picker>
            <vaadin-text-area label="Bio" colspan="2" value="My name is Jane."></vaadin-text-area>
            <vaadin-button theme="primary" id="vaadin-button">Salvar</vaadin-button>
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
}
customElements.define('vapp-home',VappHome);

