var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({__proto__: []} instanceof Array && function (d, b) {
                d.__proto__ = b;
            }) ||
            function (d, b) {
                for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);

        function __() {
            this.constructor = d;
        }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var EventEmitter = require("events").EventEmitter;
var Company = /** @class */ (function (_super) {
    __extends(Company, _super);

    function Company() {
        return _super.call(this) || this;
    }

    return Company;
}(EventEmitter));
var company = new Company();
// 监听事件 ..
var listener = function (args) {
    console.log("args is ".concat(JSON.stringify(args)));
};
company.addListener("one", listener);
company.emit("one", {value: "test", event: "one"});
setTimeout(function () {
    company.removeListener("one", listener);
}, 300);
