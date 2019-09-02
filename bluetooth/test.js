function hexCharCodeToStr(hexCharCodeStr) {
  　　var trimedStr = hexCharCodeStr.trim();
  　　var rawStr = 
  　　trimedStr.substr(0,2).toLowerCase() === "0x"
  　　? 
  　　trimedStr.substr(2) 
  　　: 
  　　trimedStr;
  　　var len = rawStr.length;
  　　if(len % 2 !== 0) {
  　　　　alert("Illegal Format ASCII Code!");
  　　　　return "";
  　　}
  　　var curCharCode;
  　　var resultStr = [];
  　　for(var i = 0; i < len;i = i + 2) {
  　　　　curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
  　　　　resultStr.push(String.fromCharCode(curCharCode));
  　　}
  　　return resultStr.join("");
  }
const test = '0xb80x5c0x490xd20x040xa30x400x710xa00xb50x350x850x3e0xb00x830x07'
const result = hexCharCodeToStr(test)

console.log('result')

console.log(result)