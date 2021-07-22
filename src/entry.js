import "@babel/polyfill";

import RippleEffect from './js/RippleEffect';
import ShareButton from './js/ShareButton';
import SocialShare from './js/SocialShare';
import mermaid from 'mermaid';

let rippleBtns = document.querySelectorAll('.ripple');
Array.from(rippleBtns).forEach(btn => {
  new RippleEffect(btn);
});

let shareBtns = document.querySelectorAll('.share-button');
Array.from(shareBtns).forEach(btn => {
  new ShareButton(btn);
});

let socialShare = new SocialShare();
let socialBtns = document.querySelectorAll('.social-button a');
Array.from(socialBtns).forEach(btn => {
  socialShare.attach(btn);
});

mermaid.initialize({startOnLoad: true, theme: 'forest'});
