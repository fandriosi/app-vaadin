export default class DataFormat{
    static get data(){
        Sugar.Date.setLocale('pt');
        return {
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
}