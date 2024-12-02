"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;

var RLE_1 = require("./RLE");
var FFT_1 = require("./FFT");
var RSA_1 = require("./RSA");

var Node = (function () {
    function Node(id) {
        this.id = id;
        this.connections = [];
        this.inbox = [];

        var _a = RSA_1.generateRSAKeyPair(), publicKey = _a.publicKey, privateKey = _a.privateKey;
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }
    Node.prototype.addConnection = function (node) {
        this.connections.push(node);
    };
    Node.prototype.sendMessage = function (receiver, message, method, options) {
        var compressedBody;
        var metadata;
        if (method === "RLE") {
            // RLE logic (imported from RLE.ts)
            compressedBody = (0, RLE_1.rleCompress)(message);
            metadata = { compressionType: "RLE", originalLength: message.length };
        }
        else if (method === "FFT") {
            // FFT logic (imported from FFT.ts)
            var lossiness = (options === null || options === void 0 ? void 0 : options.lossiness) || 0.5;
            compressedBody = (0, FFT_1.fftCompress)(message, lossiness);
            metadata = { compressionType: "FFT", originalLength: message.length, lossiness: lossiness };
        } else if (method === "RSA") {
            // Encrypt messages with the RSA public key
            compressedBody = RSA_1.encryptMessage(this.publicKey, message);
            metadata = { compressionType: "RSA", originalLength: message.length };
        } else if (method === "SIGNED") {
            // Sign messages with the     RSA private key
            var signature = RSA_1.signMessage(this.privateKey, message);
            compressedBody = Buffer.concat([Buffer.from(message), signature]); // Send message + signature
            metadata = { compressionType: "SIGNED", originalLength: message.length };
        } else {
            throw new Error("Unsupported compression method");
        }
        var msg = {
            sender: this.id,
            receiver: receiver.id,
            metadata: metadata,
            body: compressedBody,
        };
        receiver.receiveMessage(msg);
    };
    Node.prototype.receiveMessage = function (message) {
        // If the message is encrypted, decrypt it
        if (message.metadata.compressionType === "RSA") {
            message.body = RSA_1.decryptMessage(this.privateKey, message.body);
        }

        // If the message is signed, verify signature
        if (message.metadata.compressionType === "SIGNED") {
            var body = message.body.slice(0, message.body.length - 256); // Remove signature from body
            var signature = message.body.slice(-256); // Get the last 256 bytes as the signature
            var isValid = RSA_1.verifySignature(this.publicKey, body.toString(), signature);

            if (isValid) {
                console.log("Signature verified successfully.");
            } else {
                console.log("Signature verification failed.");
            }
        }
        
        this.inbox.push(message);
    };
    
    return Node;
}());

exports.Node = Node;
