import {PolymerElement, html} from '@polymer/polymer';

export default class VappPage3 extends PolymerElement{
    static get template(){
        return html `
           <h2>Page 3</h2>
           <p>Paragraph at home</p>`     
    }
}
customElements.define('vapp-page3',VappPage3);