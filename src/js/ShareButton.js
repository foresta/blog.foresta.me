/*
 * Share Button
 */
export default class ShareButton {
    constructor (btn) {
        this.shareBtn = btn.getElementsByClassName('share')[0]
        this.socialBtns = btn.getElementsByClassName('social-btns')[0]
        this.isOpened = false

        this.setListener()
    }

    setListener() {
        this.shareBtn.addEventListener('click', (e) => {
          if (this.isOpened){
            this.shareBtn.classList.add('close')
            this.socialBtns.classList.add('close')
          }
          else {
            this.shareBtn.classList.add('open')
            this.socialBtns.classList.add('open')
          }

          this.isOpened = !this.isOpened;
          e.preventDefault()
        });
    }
}
