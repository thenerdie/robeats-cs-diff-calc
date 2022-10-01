const brain = require("brain.js")

const jumpstream = "0101" +
    "0100" +
    "0011" +
    "0100" +
    "1010"

const handstream = "0111" +
    "0100" +
    "1011" +
    "0100" +
    "1011" +
    "0100" +
    "1010" +
    "0101" +
    "1010"

const chordjack = ("0111" +
    "0110" +
    "0110" +
    "1101" +
    "1010" +
    "0111" +
    "0110" +
    "0110" +
    "1101" +
    "1010").repeat(20)

const net = new brain.NeuralNetwork();
net.train([
    {
        input: jumpstream,
        output: {
            jumpstream: 1
        }
    },
    {
        input: handstream,
        output: {
            handstream: 1
        }
    },
    {
        input: chordjack,
        output: {
            chordjack: 1
        }
    }
], {
    log: detail => console.log(detail)
});

const result = net.run(chordjack);

console.log(result);