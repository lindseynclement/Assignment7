import { rleCompress } from "./RLE";
import { fftCompress } from "./FFT";
import { generateRSAKeyPair, encryptMessage, decryptMessage, signMessage, verifySignature } from "./RSA";

export type Metadata = {
    compressionType: "RLE" | "FFT" | "RSA" | "SIGNED"; //add in other compression types here
    originalLength: number;
    lossiness?: number;
  };
  
  export type Message = {
    sender: string;
    receiver: string;
    metadata: Metadata;
    body: string | number[] | Buffer;
  };
  
  export class Node {
    id: string;
    connections: Node[];
    inbox: Message[];
    private publicKey: forge.pki.PublicKey;
    private privateKey: forge.pki.PrivateKey;
  
    constructor(id: string) {
      this.id = id;
      this.connections = [];
      this.inbox = [];
      const { publicKey, privateKey } = generateRSAKeyPair();
      this.publicKey = publicKey;
      this.privateKey = privateKey;
    }
  
    addConnection(node: Node) {
      this.connections.push(node);
    }
  
    sendMessage(receiver: Node, message: string, method: "RLE" | "FFT" | "RSA" | "SIGNED", options?: { lossiness?: number }) {
      let compressedBody: string | number[] | Buffer;
      let metadata: Metadata;
  
      if (method === "RLE") {
        // RLE logic (imported from RLE.ts)
        compressedBody = rleCompress(message);
        metadata = { compressionType: "RLE", originalLength: message.length };
      } else if (method === "FFT") {
        // FFT logic (imported from FFT.ts)
        const lossiness = options?.lossiness || 0.5;
        compressedBody = fftCompress(message, lossiness);
        metadata = { compressionType: "FFT", originalLength: message.length, lossiness };
      } else if (method === "RSA") {
        compressedBody = encryptMessage(this.publicKey, message);
        metadata = { compressionType: "RSA", originalLength: message.length };
      } else if (method === "SIGNED") {
        const signature = signMessage(this.privateKey, message);
        compressedBody = Buffer.concat([Buffer.from(message), signature]); // Send message + signature
        metadata = { compressionType: "SIGNED", originalLength: message.length };
      } else {
        throw new Error("Unsupported compression method");
      }
  
      const msg: Message = {
        sender: this.id,
        receiver: receiver.id,
        metadata,
        body: compressedBody,
      };
  
      receiver.receiveMessage(msg);
    }
  
    receiveMessage(message: Message) {
    // If the message is encrypted, decrypt it
    if (message.metadata.compressionType === "RSA") {
      message.body = decryptMessage(this.privateKey, message.body as Buffer);
    }
        
    // If the message is signed, verify the signature
    if (message.metadata.compressionType === "SIGNED") {
      const body = (message.body as Buffer).slice(0, message.body.length - 256);
      const signature = (message.body as Buffer).slice(-256);
      const isValid = verifySignature(this.publicKey, body.toString(), signature);
      if (isValid) {
        console.log("Signature verified successfully.");
      } else {
        console.log("Signature verification failed.");
      }
    }
    
      this.inbox.push(message);
    }
  }
  
