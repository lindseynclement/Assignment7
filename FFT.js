"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fftCompress = fftCompress;
exports.fftDecompress = fftDecompress;
function fftCompress(message, lossiness) {
    if (lossiness < 0 || lossiness > 1) {
        throw new Error("Lossiness must be a number between 0 and 1.");
    }
    var numericMessage = message.split("").map(function (char) { return char.charCodeAt(0); });
    var transformed = numericMessage.map(function (value, index) {
        return value * Math.cos((index * Math.PI) / numericMessage.length);
    });
    var cutoff = Math.floor((1 - lossiness) * transformed.length);
    return transformed.slice(0, cutoff);
}
function fftDecompress(compressedMessage) {
    return compressedMessage
        .map(function (value) { return String.fromCharCode(Math.round(value)); })
        .join("");
}
