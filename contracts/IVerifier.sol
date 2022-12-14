// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

library Pairing {
    struct G1Point {
        uint X;
        uint Y;
    }
    // Encoding of field elements is: X[0] * z + X[1]
    struct G2Point {
        uint[2] X;
        uint[2] Y;
    }
}

interface IVerifier {
    struct Proof {
        Pairing.G1Point a;
        Pairing.G2Point b;
        Pairing.G1Point c;
    }

    function verifyTx(
        Proof memory proof, uint[4] memory input
    ) external view returns (bool r);
}
