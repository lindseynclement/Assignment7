"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
var RLE_1 = require("./RLE");
var FFT_1 = require("./FFT");
var Node = /** @class */ (function () {
    function Node(id) {
        this.id = id;
        this.connections = [];
        this.inbox = [];
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
        }
        else {
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
        this.inbox.push(message);
    };
    return Node;
}());
exports.Node = Node;
