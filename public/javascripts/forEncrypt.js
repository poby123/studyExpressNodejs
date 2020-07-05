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
