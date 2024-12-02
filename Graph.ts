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
    static nodes: { [id: string]: Node } = {};
  
    constructor(id: string) {
      this.id = id;
      this.connections = [];
      this.inbox = [];
      const { publicKey, privateKey } = generateRSAKeyPair();
      this.publicKey = publicKey;
      this.privateKey = privateKey;
      Node.nodes[id] = this;
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
      // Added code: Get sender's public key for verification
        const senderNode = Node.nodes[message.sender];
        if (senderNode) {
          const senderPublicKey = senderNode.publicKey;
          const isValid = verifySignature(senderPublicKey, body.toString(), signature);
          if (isValid) {
            console.log("Signature verified successfully.");
            
            // Added code: Check if this is a confirmation message
            try {
              const parsedBody = JSON.parse(body.toString());
              if (parsedBody.originalSignature && parsedBody.originalHash && parsedBody.confirmationHash && parsedBody.encryptedConfirmationHash) {
                // This is a confirmation message
                console.log("Received signed confirmation message.");
                
                // Verify the confirmation hash
                const confirmationHash = parsedBody.confirmationHash;
                const encryptedConfirmationHash = Buffer.from(parsedBody.encryptedConfirmationHash, 'base64');
                
                const isConfirmationValid = verifySignature(senderPublicKey, confirmationHash, encryptedConfirmationHash);
                if (isConfirmationValid) {
                  console.log("Confirmation message signature verified successfully.");
                  console.log(`Original Signature: ${parsedBody.originalSignature}`);
                  console.log(`Original Hash: ${parsedBody.originalHash}`);
                  console.log(`Confirmation Hash: ${parsedBody.confirmationHash}`);
                  console.log(`Encrypted Confirmation Hash: ${parsedBody.encryptedConfirmationHash}`);
                } else {
                  console.log("Confirmation message signature verification failed.");
                }
              } else {
                // Not a confirmation message; send confirmation
                // Added code: Send back signed confirmation message
                this.sendSignedConfirmation(senderNode, body.toString(), signature);
              }
            } catch (e) {
              // Not a JSON message; send confirmation
              // Added code: Send back signed confirmation message
              this.sendSignedConfirmation(senderNode, body.toString(), signature);
            }
          } else {
            console.log("Signature verification failed.");
          }
        } else {
          console.log("Sender node not found for signature verification.");
        }
      }   
      this.inbox.push(message);
    }

    // Helper function to compute SHA-256 hash
    computeHash(data: string): string {
      const md = forge.md.sha256.create();
      md.update(data);
      return md.digest().toHex();
    }

    // Method to send signed confirmation message
    sendSignedConfirmation(senderNode: Node, originalMessage: string, originalSignature: Buffer) {
      // Compute the original hash
      const originalHash = this.computeHash(originalMessage);

      // Prepare the confirmation message
      const confirmationMessage = `Message received and verified by ${this.id}.`;

      // Compute the hash of the confirmation message
      const confirmationHash = this.computeHash(confirmationMessage);

      // Sign the confirmation hash
      const encryptedConfirmationHash = signMessage(this.privateKey, confirmationHash);

      // Prepare the confirmation message body
      const confirmationBody = JSON.stringify({
        message: confirmationMessage,
        originalSignature: originalSignature.toString('base64'),
        originalHash: originalHash,
        confirmationHash: confirmationHash,
        encryptedConfirmationHash: encryptedConfirmationHash.toString('base64')
      });

      // Send the confirmation message back to the sender
      this.sendMessage(senderNode, confirmationBody, "SIGNED");
    }
  }
  
