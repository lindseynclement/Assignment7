export function rleCompress(message: string): string {
    let compressed = "";
    let count = 1;
  
    for (let i = 1; i < message.length; i++) {
      if (message[i] === message[i - 1]) {
        count++;
      } else {
        compressed += message[i - 1] + count;
        count = 1;
      }
    }
  
    compressed += message[message.length - 1] + count;
    return compressed;
  }
  
  export function rleDecompress(compressed: string): string {
    let decompressed = "";
    for (let i = 0; i < compressed.length; i += 2) {
      const char = compressed[i];
      const count = parseInt(compressed[i + 1], 10);
      decompressed += new Array(count + 1).join(char);

    }
    return decompressed;
  }
  