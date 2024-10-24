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
var client_1 = require("@prisma/client");
require("dotenv/config");
var prisma = new client_1.PrismaClient();
// For this seed script, we will create a few products and currencies
// that we will use to demonstrate the API functionality
// This is a fake collection address. In a real scenario, this would be the address of the product's collection address.
var collectionAddress = '0x809eda0107b274c3904c8fb91c1ee3a2778affb0';
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var bgt, productId1, productId2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.currency.upsert({
                        where: { name: 'BGT' },
                        update: {},
                        create: {
                            name: 'BGT',
                            type: 'crypto'
                        }
                    })];
                case 1:
                    bgt = _a.sent();
                    productId1 = 'vi7age4ku18qynwbk4wx90ge';
                    return [4 /*yield*/, prisma.product.upsert({
                            where: { id: productId1 },
                            update: {},
                            create: {
                                id: productId1,
                                collectionAddress: collectionAddress,
                                contractType: 'ERC721',
                                stockQuantity: 5000,
                                productPrices: {
                                    create: [
                                        {
                                            currency_name: bgt.name,
                                            amount: 10
                                        }
                                    ]
                                }
                            }
                        })];
                case 2:
                    _a.sent();
                    productId2 = 'jtwrclpj0v1zab865ne893hb';
                    return [4 /*yield*/, prisma.product.upsert({
                            where: { id: productId2 },
                            update: {},
                            create: {
                                id: productId2,
                                collectionAddress: collectionAddress,
                                contractType: 'ERC721',
                                stockQuantity: 50,
                                productPrices: {
                                    create: [
                                        {
                                            currency_name: bgt.name,
                                            amount: 20
                                        },
                                    ]
                                }
                            }
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .then(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })
    .catch(function (e) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.error(e);
                return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                process.exit(1);
                return [2 /*return*/];
        }
    });
}); });
