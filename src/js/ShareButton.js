/*
 * Share Button 
 */
export default class ShareButton {
    constructor (btn) {
        this.btn = btn;
        this.setListener();
    }

    setListener() {
        this.btn.addEventListener('click', (e) => {
           this.btn.classList.add('open')
           e.preventDefault()
        });
    }
}
