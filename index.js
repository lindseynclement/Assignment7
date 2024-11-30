"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Graph_1 = require("./Graph");
var FFT_1 = require("./FFT");
var RLE_1 = require("./RLE");
// Create nodes
var alice = new Graph_1.Node("Alice");
var bob = new Graph_1.Node("Bob");
var carol = new Graph_1.Node("Carol");
alice.addConnection(bob);
bob.addConnection(carol);
// Send RLE-compressed message
console.log("Testing RLE Compression...");
alice.sendMessage(bob, "aaaabbbcc", "RLE");
console.log("Bob's Inbox:", bob.inbox);
console.log("Decompressed RLE:", (0, RLE_1.rleDecompress)(bob.inbox[0].body));
// Send FFT-compressed message with 50% lossiness
console.log("\nTesting FFT Compression with 50% Lossiness...");
alice.sendMessage(carol, "Hello, FFT compression!", "FFT", { lossiness: 0.5 });
console.log("Carol's Inbox:", carol.inbox);
console.log("Decompressed FFT:", (0, FFT_1.fftDecompress)(carol.inbox[0].body));
// Send FFT-compressed message with 80% lossiness
console.log("\nTesting FFT Compression with 80% Lossiness...");
alice.sendMessage(carol, "This is a test message for FFT.", "FFT", { lossiness: 0.8 });
console.log("Carol's Inbox (after second FFT):", carol.inbox);
console.log("Decompressed FFT (80% Lossiness):", (0, FFT_1.fftDecompress)(carol.inbox[1].body));
// Verify RLE and FFT work independently
console.log("\nVerifying Independent Operations...");
alice.sendMessage(bob, "More RLE testing!", "RLE");
alice.sendMessage(carol, "More FFT testing with 20% loss!", "FFT", { lossiness: 0.2 });
console.log("Bob's Inbox (additional RLE):", bob.inbox);
console.log("Decompressed RLE (additional):", (0, RLE_1.rleDecompress)(bob.inbox[1].body));
console.log("Carol's Inbox (additional FFT):", carol.inbox);
console.log("Decompressed FFT (20% Lossiness):", (0, FFT_1.fftDecompress)(carol.inbox[2].body));
