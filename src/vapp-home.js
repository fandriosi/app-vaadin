import {PolymerElement, html} from '@polymer/polymer';

export default class VappHome extends PolymerElement{
  
    static get template(){
        return html `
           <h2>Home</h2>
           <p>Paragraph at home</p>`     
    }
}
customElements.define('vapp-home',VappHome);

