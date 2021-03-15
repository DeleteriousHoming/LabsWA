"use strict";

function fltwo(str){
    let newstr = str;
    if(str.length>=4)
        newstr = str.slice(0,2) + str.slice(str.length-2,str.length);
    
    return newstr;
}

let words = ["hello","this","is","an","example","spring"];

console.log(fltwo("spring"));

console.log(words.map((w)=>fltwo(w)));

"debugger";