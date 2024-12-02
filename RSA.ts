import * as forge from "node-forge";

// Generate RSA key pair (public and private keys)
export function generateRSAKeyPair() {
  const keypair = forge.pki.rsa.generateKeyPair(2048);
  return { publicKey: keypair.publicKey, privateKey: keypair.privateKey };
}

// Encrypt a message with the public key
export function encryptMessage(publicKey: forge.pki.PublicKey, message: string): Buffer {
  return publicKey.encrypt(message, 'RSA-OAEP');
}

// Decrypt a message with the private key
export function decryptMessage(privateKey: forge.pki.PrivateKey, encryptedMessage: Buffer): string {
  return privateKey.decrypt(encryptedMessage, 'RSA-OAEP');
}

// Sign a message with the private key
export function signMessage(privateKey: forge.pki.PrivateKey, message: string): Buffer {
  const md = forge.md.sha256.create();
  md.update(message);
  return privateKey.sign(md);
}

// Verify a message signature with the public key
export function verifySignature(publicKey: forge.pki.PublicKey, message: string, signature: Buffer): boolean {
  const md = forge.md.sha256.create();
  md.update(message);
  return publicKey.verify(md.digest().bytes(), signature);
}
