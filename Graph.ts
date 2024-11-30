import { rleCompress } from "./RLE";
import { fftCompress } from "./FFT";

export type Metadata = {
    compressionType: "RLE" | "FFT"; //add in other compression types here
    originalLength: number;
    lossiness?: number;
  };
  
  export type Message = {
    sender: string;
    receiver: string;
    metadata: Metadata;
    body: string | number[];
  };
  
  export class Node {
    id: string;
    connections: Node[];
    inbox: Message[];
  
    constructor(id: string) {
      this.id = id;
      this.connections = [];
      this.inbox = [];
    }
  
    addConnection(node: Node) {
      this.connections.push(node);
    }
  
    sendMessage(receiver: Node, message: string, method: "RLE" | "FFT", options?: { lossiness?: number }) {
      let compressedBody: string | number[];
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
      this.inbox.push(message);
    }
  }
  