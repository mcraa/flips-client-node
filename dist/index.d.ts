export interface FlipsConfig {
    url: string;
    envvar: string | Array<string>;
    json: FlipsJson;
}
export interface FlipsJson {
    features: Array<Feature>;
}
export interface Feature {
    feature: string;
    switchedOn: boolean;
}
export default class Flips {
    features: Array<Feature>;
    constructor(config: FlipsConfig);
    on(featureKey: string): (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) => void;
    choice(featureKey: string, fallback: any): (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) => void;
    by(featureKey: string): boolean;
}
