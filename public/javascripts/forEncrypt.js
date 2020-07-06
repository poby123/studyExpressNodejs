/*
  The file has dependence for
  <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js"></script>
*/
var crypt = {
  secret: "CIPHERKEY",
  encrypt: function(clear) {
    var cipher = CryptoJS.AES.encrypt(clear, crypt.secret);
    cipher = cipher.toString();
    return cipher;
  },
  decrypt: function(cipher) {
    var decipher = CryptoJS.AES.decrypt(cipher, crypt.secret);
    decipher = decipher.toString(CryptoJS.enc.Utf8);
    return decipher;
  }
};

function encrypting(text, inputBox) {
  var cipher = crypt.encrypt(text);
  inputBox.val(cipher);
}
// var crypt = {
//   encrypt: function(clear) {
//     var salt = CryptoJS.lib.WordArray.random(128/8);
//
//     var key512Bits = CryptoJS.PBKDF2(clear, salt, { keySize: 512/32 });
//     // console.log('key512Bits : ', key512Bits);
//
//     var key512BitsIterations = CryptoJS.PBKDF2(clear, salt, { keySize: 512/32, iterations: 10000 });
//     // console.log('key512Bits10000Iterations : ', key512Bits10000Iterations.toString(CryptoJS.enc.Base64));
//
//     var cipher = key512BitsIterations.toString(CryptoJS.enc.Base64)
//     // console.log('hash : ', cipher);
//     return [cipher, salt];
//   },
// };
//
// function encrypting(text, pwBox) {
//   var infoArray = crypt.encrypt(text);
//   console.log(infoArray);
//   console.log(infoArray[0]);
//   console.log(infoArray[1]);
//   //pwBox.val(cipher);
// }
