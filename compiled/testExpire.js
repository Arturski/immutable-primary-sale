"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var API_URL = 'http://0.0.0.0:3000';
var API_KEY = 'your_hardcoded_api_key'; // Replace with the actual API key
var testExpireFlow = function () { return __awaiter(void 0, void 0, void 0, function () {
    var quoteResponse, authorizeResponse, reference, expireResponse, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, axios_1.default.post("".concat(API_URL, "/api/quote"), {
                        recipient_address: '0xdd9AAE1C317eE6EFEb0F3DB0A068e9Ed952a6CEB',
                        products: [
                            {
                                product_id: 1, // Adjust based on the actual product ID in your database
                                quantity: 1
                            }
                        ]
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': API_KEY
                        }
                    })];
            case 1:
                quoteResponse = _a.sent();
                console.log('Quote Response:', quoteResponse.data);
                return [4 /*yield*/, axios_1.default.post("".concat(API_URL, "/api/authorize"), {
                        recipient_address: '0xdd9AAE1C317eE6EFEb0F3DB0A068e9Ed952a6CEB',
                        currency: 'USDC',
                        products: [
                            {
                                product_id: 1, // Adjust based on the actual product ID in your database
                                quantity: 1
                            }
                        ]
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': API_KEY
                        }
                    })];
            case 2:
                authorizeResponse = _a.sent();
                console.log('Authorize Response:', authorizeResponse.data);
                reference = authorizeResponse.data.reference;
                return [4 /*yield*/, axios_1.default.post("".concat(API_URL, "/api/expire"), {
                        reference: reference
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': API_KEY
                        }
                    })];
            case 3:
                expireResponse = _a.sent();
                console.log('Expire Response:', expireResponse.data);
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                console.error('Error:', error_1.response ? error_1.response.data : error_1.message);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
testExpireFlow();