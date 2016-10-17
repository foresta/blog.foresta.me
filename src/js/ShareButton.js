/*
 * Share Button
 */
export default class ShareButton {
    constructor (btn) {
        this.parentBtn = btn
        this.shareBtn = btn.getElementsByClassName('share')[0]
        this.socialBtns = btn.getElementsByClassName('social-btns')[0]
        this.isOpened = false

        this.setListener()
    }

    setListener() {
        this.shareBtn.addEventListener('click', (e) => {

          if (this.isOpened){
            this.parentBtn.classList.remove('open')
            this.shareBtn.classList.remove('open')
            this.socialBtns.classList.remove('open')

            this.parentBtn.classList.add('close')
            this.shareBtn.classList.add('close')
            this.socialBtns.classList.add('close')
          }
          else {
            this.parentBtn.classList.remove('close')
            this.shareBtn.classList.remove('close')
            this.socialBtns.classList.remove('close')

            this.parentBtn.classList.add('open')
            this.shareBtn.classList.add('open')
            this.socialBtns.classList.add('open')
          }

          this.isOpened = !this.isOpened;
          e.preventDefault()
        });
    }
}
