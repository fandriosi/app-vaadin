import {PolymerElement, html} from '@polymer/polymer';

export default class VappPage2 extends PolymerElement{
    static get template(){
        return html `
           <h2>Page 2</h2>
           <p>Paragraph at home</p>`     
    }
}
customElements.define('vapp-page2',VappPage2);