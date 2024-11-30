"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rleCompress = rleCompress;
exports.rleDecompress = rleDecompress;
function rleCompress(message) {
    var compressed = "";
    var count = 1;
    for (var i = 1; i < message.length; i++) {
        if (message[i] === message[i - 1]) {
            count++;
        }
        else {
            compressed += message[i - 1] + count;
            count = 1;
        }
    }
    compressed += message[message.length - 1] + count;
    return compressed;
}
function rleDecompress(compressed) {
    var decompressed = "";
    for (var i = 0; i < compressed.length; i += 2) {
        var char = compressed[i];
        var count = parseInt(compressed[i + 1], 10);
        decompressed += new Array(count + 1).join(char);
    }
    return decompressed;
}
