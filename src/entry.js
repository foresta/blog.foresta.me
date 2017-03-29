import RippleEffect from "./js/RippleEffect"
import ShareButton  from "./js/ShareButton"
import SocialShare  from "./js/SocialShare"

let rippleBtns = document.querySelectorAll(".ripple")
Array.from(rippleBtns).forEach((btn) => {
    new RippleEffect(btn)
})

let shareBtns = document.querySelectorAll(".share-button")
Array.from(shareBtns).forEach((btn) => {
    new ShareButton(btn)
})

let socialShare = new SocialShare()
let socialBtns = document.querySelectorAll(".social-btns li a")
Array.from(socialBtns).forEach((btn) => {
    socialShare.attach(btn)
})
