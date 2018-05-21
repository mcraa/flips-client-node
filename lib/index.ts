
export interface FlipsConfig {
    url: string,
    envvar: string | Array<string>,
    json: FlipsJson
}

export interface FlipsJson {
    features: Array<Feature>
}

export interface Feature {
    feature: string,
    switchedOn: boolean
}

export default class Flips {
    public features: Array<Feature> = []

    constructor(config: FlipsConfig) {
        if (config.url){
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
            if (Array.isArray(config.envvar)){
                for(let feature of config.envvar){
                    if (!this.features.some(f => f.feature === feature)) {
                        if (process.env[feature]) {
                            this.features.push(<Feature>{feature: feature, switchedOn: true})
                        }
                    }
                }
            } else {
                if (!this.features.some(f => f.feature === config.envvar)) {
                    if (process.env[config.envvar]) {
                        this.features.push(<Feature>{feature: config.envvar, switchedOn: true})
                    }
                }
            }
        }

        if (config.json) {          
            for(let feature of config.json.features){
                if (!this.features.some(f => f.feature === feature.feature)) {
                    this.features.push(feature);
                }
            }            
        }
    }

    on(featureKey: string){
        return (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) => {
            let method = descriptor.value;

            if (this.features.some(v => v.feature === featureKey && v.switchedOn)) {
                // switch on
            } else {
                // switch off                
                descriptor.value = () => false;
            }

        }
    }

    choice(featureKey: string, fallback: any){
        return (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) => {
            if (this.features.some(v => v.feature === featureKey && v.switchedOn)) {
                // on
            } else {
                // fallback
                descriptor.value = fallback
            }
        }
    }

    by(featureKey: string) : boolean{
        return this.features.some(f => f.feature === featureKey && f.switchedOn)
    }
}