import {PolymerElement, html} from '@polymer/polymer';
import {Router} from '@vaadin/router';

import '@vaadin/vaadin-app-layout/vaadin-app-layout';
import '@vaadin/vaadin-app-layout/vaadin-drawer-toggle';
import '@vaadin/vaadin-tabs/vaadin-tabs';
import '@vaadin/vaadin-tabs/vaadin-tab';
import '@vaadin/vaadin-icons/vaadin-icons';
import './vapp-home';
import './vapp-page2';
import './vapp-page3';

export default class VappMain extends PolymerElement{    
    ready(){      
      super.ready();
      const router = new Router(this.shadowRoot.getElementById('outlet'));
      router.setRoutes([
        {path: '/', component: 'vapp-home'},
        {path: '/page3', component: 'vapp-page3'},
        {path: '/page2', component: 'vapp-page2'},
      ]);
    }
    static get template(){
        return html `   
        <custom-style>
            <style include="lumo-typography lumo-color"></style>        
        </custom-style>         
        <vaadin-app-layout>
          <vaadin-drawer-toggle slot="navbar"></vaadin-drawer-toggle>
          <h2 slot="navbar">App Name</h2>
          <vaadin-tabs orientation="vertical" slot="drawer">
            <vaadin-tab>
              <a href="/">
                <iron-icon icon="vaadin:home"></iron-icon>
                 Page 1
              </a>
            </vaadin-tab>
            <vaadin-tab>
              <a href="page2">
                <iron-icon icon="vaadin:list"></iron-icon>
                  Page 2
              </a>
            </vaadin-tab>
            <vaadin-tab>
              <a href="page3">
                <iron-icon icon="vaadin:options"></iron-icon>
                Page 3
              </a>
            </vaadin-tab>
          </vaadin-tabs>
            <div id="outlet"></div>      
        </vaadin-app-layout>`
    }
}
customElements.define('vapp-main', VappMain);