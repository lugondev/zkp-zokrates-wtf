const fs = require('fs')
const path = require("path")

function readFile(path) {
    const isExists = fs.existsSync(path)
    if (!isExists) return ""
    return fs.readFileSync(path, 'utf8')
}

function readFileBuffer(path) {
    const isExists = fs.existsSync(path)
    if (!isExists) return []
    const content = fs.readFileSync(path)
    return new Uint8Array(content)
}

function readSenderZok() {
    const pathZok = path.join(__dirname, "../sender/sender.zok")
    return readFile(pathZok)
}

function readReceiverZok() {
    const pathZok = path.join(__dirname, "../receiver/receiver.zok")
    return readFile(pathZok)
}

function readReceiverProvingKey() {
    const pathKey = path.join(__dirname, "../receiver/proving.key")
    return readFileBuffer(pathKey)
}

function readReceiverVerificationKey() {
    const pathKey = path.join(__dirname, "../receiver/verification.key")
    const content = readFile(pathKey)
    return JSON.parse(content)
}

function readSenderProvingKey() {
    const pathKey = path.join(__dirname, "../sender/proving.key")
    return readFileBuffer(pathKey)
}

function readSenderVerificationKey() {
    const pathKey = path.join(__dirname, "../sender/verification.key")
    const content = readFile(pathKey)
    return JSON.parse(content)
}


module.exports = {
    readSenderZok,
    readReceiverZok,
    readReceiverProvingKey,
    readReceiverVerificationKey,
    readSenderProvingKey,
    readSenderVerificationKey,
}

