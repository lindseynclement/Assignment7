import { Node } from "./Graph";
import { fftDecompress, fftCompress } from "./FFT";
import { rleCompress, rleDecompress } from "./RLE";

// Create nodes
const alice = new Node("Alice");
const bob = new Node("Bob");
const carol = new Node("Carol");

alice.addConnection(bob);
bob.addConnection(carol);

// Send RLE-compressed message
console.log("Testing RLE Compression...");
alice.sendMessage(bob, "aaaabbbcc", "RLE");
console.log("Bob's Inbox:", bob.inbox);
console.log("Decompressed RLE:", rleDecompress(bob.inbox[0].body as string));

// Send FFT-compressed message with 50% lossiness
console.log("\nTesting FFT Compression with 50% Lossiness...");
alice.sendMessage(carol, "Hello, FFT compression!", "FFT", { lossiness: 0.5 });
console.log("Carol's Inbox:", carol.inbox);
console.log("Decompressed FFT:", fftDecompress(carol.inbox[0].body as number[]));

// Send FFT-compressed message with 80% lossiness
console.log("\nTesting FFT Compression with 80% Lossiness...");
alice.sendMessage(carol, "This is a test message for FFT.", "FFT", { lossiness: 0.8 });
console.log("Carol's Inbox (after second FFT):", carol.inbox);
console.log("Decompressed FFT (80% Lossiness):", fftDecompress(carol.inbox[1].body as number[]));

// Verify RLE and FFT work independently
console.log("\nVerifying Independent Operations...");
alice.sendMessage(bob, "More RLE testing!", "RLE");
alice.sendMessage(carol, "More FFT testing with 20% loss!", "FFT", { lossiness: 0.2 });
console.log("Bob's Inbox (additional RLE):", bob.inbox);
console.log("Decompressed RLE (additional):", rleDecompress(bob.inbox[1].body as string));
console.log("Carol's Inbox (additional FFT):", carol.inbox);
console.log("Decompressed FFT (20% Lossiness):", fftDecompress(carol.inbox[2].body as number[]));

// Testing RSA Encryptions
console.log("Testing RSA Encryption...");
alice.sendMessage(bob, "This is a secret message!", "RSA");
console.log("Bob's Inbox (Encrypted):", bob.inbox);
console.log("Decrypted Message:", bob.inbox[0].body);

// Testing Signed Messages
console.log("\nTesting Signed Message...");
alice.sendMessage(bob, "Important message with signature", "SIGNED");
console.log("Bob's Inbox (Signed):", bob.inbox);

// Testing Signed Messages with Confirmation
console.log("\nTesting Signed Message with Confirmation...");
alice.sendMessage(bob, "Important message with signature", "SIGNED");
console.log("Alice's Inbox (After Confirmation):", alice.inbox);

