import tpl from './index.tpl';

export default class BtnGroupComponent {
    constructor () {
        this.name = 'BtnGroupComponent'
    }

    tpl () {
        const oDiv = document.createElement('div');
        oDiv.className = 'btn-group';
        oDiv.innerHTML = tpl();
        return oDiv;
    }
}