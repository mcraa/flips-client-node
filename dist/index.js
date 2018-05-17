"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Flips {
    constructor(config) {
        this.features = [];
        if (config.url) {
            const http = require('https');
            http.get(config.url, (response) => {
                let data = '';
                response.on('data', (chunk) => {
                    data += chunk;
                });
                response.on('end', () => {
                    this.features = (JSON.parse(data));
                });
            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });
        }
        if (config.envvar) {
            if (Array.isArray(config.envvar)) {
                for (let feature of config.envvar) {
                    if (!this.features.some(f => f.feature === feature)) {
                        this.features.push({ feature: feature, switchedOn: true });
                    }
                }
            }
        }
        if (config.json) {
            for (let feature of config.json.features) {
                if (!this.features.some(f => f.feature === feature.feature)) {
                    this.features.push(feature);
                }
            }
        }
    }
    on(featureKey) {
        return (target, propertyName, descriptor) => {
            let method = descriptor.value;
            if (this.features.some(v => v.feature === featureKey && v.switchedOn)) {
                // switch on
            }
            else {
                // switch off                
                descriptor.value = () => false;
            }
        };
    }
    choice(featureKey, fallback) {
        return (target, propertyName, descriptor) => {
            if (this.features.some(v => v.feature === featureKey && v.switchedOn)) {
                // on
            }
            else {
                // fallback
                descriptor.value = fallback;
            }
        };
    }
    by(featureKey) {
        return this.features.some(f => f.feature === featureKey && f.switchedOn);
    }
}
exports.default = Flips;
//# sourceMappingURL=index.js.map