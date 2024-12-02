const forge = require('node-forge');

// Generate RSA key pair (public and private keys)
function generateRSAKeyPair() {
  const keypair = forge.pki.rsa.generateKeyPair(2048);
  return { publicKey: keypair.publicKey, privateKey: keypair.privateKey };
}

// Encrypt messages with public key
function encryptMessage(publicKey, message) {
  return publicKey.encrypt(message, 'RSA-OAEP');
}

// Decrypt messages with private key
function decryptMessage(privateKey, encryptedMessage) {
  return privateKey.decrypt(encryptedMessage, 'RSA-OAEP');
}

// Sign messages with private key
function signMessage(privateKey, message) {
  const md = forge.md.sha256.create();
  md.update(message);
  return privateKey.sign(md);
}

// Verify message signature with public key
function verifySignature(publicKey, message, signature) {
  const md = forge.md.sha256.create();
  md.update(message);
  return publicKey.verify(md.digest().bytes(), signature);
}

module.exports = { generateRSAKeyPair, encryptMessage, decryptMessage, signMessage, verifySignature };
