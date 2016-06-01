/*
 * Ripple Effect for material design
 */
export default class RippleEffect
{
    constructor (btn) {
        this.btn = btn
        this.setListener()
    }

    effect(x, y) {
       let effectElm = document.createElement('div')
       effectElm.classList.add('ripple-effect')
       effectElm.style.top = y
       effectElm.style.left = x
       this.btn.insertBefore(effectElm, this.btn.firstChild)
    }

    setListener() {
        this.btn.addEventListener('mousedown', (e) => {
            e.preventDefault()
            let x = e.offsetX
            let y = e.offsetY

            this.effect(x,y);
       });

        this.btn.addEventListener('touchstart', (e) => {
            e.preventDefault()
            let clientX = e.changedTouches[0].clientX
            let clientY = e.changedTouches[0].clientY

            console.log("touch started :("+ clientX + "," + clientY + ")")
        })
    }
}
