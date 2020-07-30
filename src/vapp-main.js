import {PolymerElement, html} from '@polymer/polymer';
import {Router} from '@vaadin/router';

import '@vaadin/vaadin-app-layout/vaadin-app-layout';
import '@vaadin/vaadin-app-layout/vaadin-drawer-toggle';
import '@vaadin/vaadin-tabs/vaadin-tabs';
import '@vaadin/vaadin-tabs/vaadin-tab';
import '@vaadin/vaadin-icons/vaadin-icons';
import './vapp-vendas-view';
import './vapp-client-view';
import './vapp-produtos-veiw';
import './vapp-categoria-view';
import './vapp-estoque-view';

export default class VappMain extends PolymerElement{    
    ready(){      
      super.ready();
      const router = new Router(this.shadowRoot.getElementById('outlet'));
      router.setRoutes([
        {path: '/', component: 'vapp-vendas-view'},
        {path: '/Clinte', component: 'vapp-cliente-view'},
        {path: '/Produtos', component: 'vapp-produtos-view'},
        {path: '/Categoria', component: 'vapp-categoria-view'},
        {path: '/Estoque', component: 'vapp-estoque-view'},
      ]);
    }
    static get template(){
        return html `   
        <custom-style>
            <style include="lumo-typography lumo-color"></style>        
        </custom-style>         
        <vaadin-app-layout>
          <vaadin-drawer-toggle slot="navbar"></vaadin-drawer-toggle>
          <h2 slot="navbar">Be Modas</h2>
          <vaadin-tabs orientation="vertical" slot="drawer">
            <vaadin-tab>
              <a href="/">
                <iron-icon icon="vaadin:cart"></iron-icon>
                 Vendas
              </a>
            </vaadin-tab>
            <vaadin-tab>
              <a href="Clinte">
                <iron-icon icon="vaadin:list"></iron-icon>
                   <span>Clintes</span>
              </a>
            </vaadin-tab>
            <vaadin-tab>
              <a href="Produtos">
                <iron-icon icon="vaadin:shop"></iron-icon>
                <span>Produtos</span>
              </a>
            </vaadin-tab>
            <vaadin-tab>
              <a href="Categoria">
                <iron-icon icon="vaadin:cube"></iron-icon>
                Categorias
              </a>
            </vaadin-tab>
            <vaadin-tab>
              <a href="Estoque">
                <iron-icon icon="vaadin:cubes"></iron-icon>
                Estoque
              </a>
            </vaadin-tab>
          </vaadin-tab>
          </vaadin-tabs>
            <div id="outlet"></div>      
        </vaadin-app-layout>`
    }
}
customElements.define('vapp-main', VappMain);