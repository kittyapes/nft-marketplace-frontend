// @ts-nocheck
// Initialize Authereum and add it to the window for pollyfilling
const Authereum = require('authereum');
const WalletLink = require('walletlink')

// Authereum
window.Authereum = Authereum;
window.WalletLink = WalletLink;