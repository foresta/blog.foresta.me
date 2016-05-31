/*
 * Ripple Effect for material design
 */
export default class RippleEffect
{
    constructor (btn) {
        this.btn = btn
        this.setListener()
    }

    setListener() {
        this.btn.addEventListener('mousedown', (e) => {
            e.preventDefault()
            let clientX = e.clientX
            let clientY = e.clientY

            let effect = document.createElement('div')
            effect.classList.add('ripple-effect')
            effect.style.position = 'absolute'
            effect.style.top = clientY
            effect.style.left = clientX
            effect.style.width = '10px'
            effect.style.height = '10px'
            effect.style.backgroundColor = 'red'
            this.btn.appendChild(effect)

            console.log("on mouse down :("+ clientX + "," + clientY + ")")
        });

        this.btn.addEventListener('touchstart', (e) => {
            e.preventDefault()
            let clientX = e.changedTouches[0].clientX
            let clientY = e.changedTouches[0].clientY

            console.log("touch started :("+ clientX + "," + clientY + ")")
        })
    }
}
