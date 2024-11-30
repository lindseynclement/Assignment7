export function fftCompress(message: string, lossiness: number): number[] {
    if (lossiness < 0 || lossiness > 1) {
      throw new Error("Lossiness must be a number between 0 and 1.");
    }
  
    const numericMessage = message.split("").map(char => char.charCodeAt(0));
    const transformed = numericMessage.map((value, index) => 
      value * Math.cos((index * Math.PI) / numericMessage.length)
    );
  
    const cutoff = Math.floor((1 - lossiness) * transformed.length);
    return transformed.slice(0, cutoff);
  }
  
  export function fftDecompress(compressedMessage: number[]): string {
    return compressedMessage
      .map(value => String.fromCharCode(Math.round(value)))
      .join("");
  }
  