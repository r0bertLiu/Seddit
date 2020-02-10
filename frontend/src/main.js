/**
 * Written by A. Hinds with Z. Afzal 2018 for UNSW CSE.
 * 
 * Updated 2019.
 */

// import your own scripts here.
import createBanner from './Banner.js';
import createFeed from './Feed.js';

// your app must take an apiUrl as an argument --
// this will allow us to verify your apps behaviour with 
// different datasets.
function initApp(apiUrl) {
  // set the inital state of app to unlogged in

  if (!(localStorage.logged_in)){
    localStorage.logged_in = 0;
  }
  let root_div = document.getElementById("root");
  createBanner(root_div);
  createFeed(root_div);
  // var footer_elem = document.createElement('footer');
  // var footer_p = document.createElement('p');
  // footer_p.appendChild(document.createTextNode('Comp9044 Assignment2, Author: Yubai Liu, z5143109'))
  // footer_elem.appendChild(footer_p);
  // root_div.appendChild(footer_elem);
}

export default initApp;