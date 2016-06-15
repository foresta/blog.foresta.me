import RippleEffect from "./js/RippleEffect"
import ShareButton  from "./js/ShareButton"

require("./scss/style.scss");

let rippleBtns = document.querySelectorAll(".ripple")
Array.from(rippleBtns).forEach((btn) => {
    new RippleEffect(btn)
})

let shareBtns = document.querySelectorAll(".share")
Array.from(shareBtns).forEach((btn) => {
    new ShareButton(btn)
})

