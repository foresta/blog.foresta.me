import RippleEffect from "./js/RippleEffect";
require("./scss/style.scss");

let rippleBtns = document.querySelectorAll(".ripple");
Array.from(rippleBtns).forEach((btn) => {
    new RippleEffect(btn);
});

