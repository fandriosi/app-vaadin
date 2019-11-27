import {html, PolymerElement} from '@polymer/polymer';
import '@vaadin/vaadin-form-layout';
import '@vaadin/vaadin-text-field/vaadin-text-area';
import '@vaadin/vaadin-text-field/vaadin-text-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-date-picker';

export default class VappHome extends PolymerElement{
    ready(){
        super.ready();     
        let i = 0;
        let button = this.shadowRoot.getElementById('vaadin-button')
        button.addEventListener('click', function() {
            button.nextElementSibling.textContent = ++i;
        });
        console.log('sugar', Sugar);
        Sugar.Date.setLocale('pt');
        var datepicker = this.shadowRoot.querySelector('vaadin-date-picker');
        console.log('data', datepicker);
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
    static get template(){
        return html `
        <vaadin-form-layout>
            <vaadin-text-field label="First Name" value="Jane"></vaadin-text-field>
            <vaadin-text-field label="Last Name" value="Doe"></vaadin-text-field>
            <vaadin-text-field label="Email" value="jane.doe@example.com"></vaadin-text-field>
            <vaadin-date-picker label="Birthday"></vaadin-date-picker>
            <vaadin-text-area label="Bio" colspan="2" value="My name is Jane."></vaadin-text-area>
            <vaadin-button theme="primary" id="vaadin-button">Salvar</vaadin-button>
        </vaadin-form-layout>`
    }
}
customElements.define('vapp-home',VappHome);

