var expect = require('chai').expect;
var Flips = require('../dist/index.js').default;

describe('Flips function tests', () => {
    it('should populate features', () => {        
        var flipped = new Flips({json: {features: [{feature:"hello", switchedOn: true}]}});
        var resultOn = flipped.by('hello');
        var resultOff = flipped.by('nope');

        expect(resultOn).to.be.true;
        expect(resultOff).to.be.false;
    });    

    it('should do the flip', () => {        
        var flipped = new Flips({json: {features: [{feature:"hello", switchedOn: true}]}});
        
        class X {
            @flipped.on("hello")
            turnedon(){
                return true;
            }
        }

        class Y {
            @flipped.on("not")
            turnedon(){
                return true;
            }
        }

        var resultOn = new X().turnedon();
        var resultOff = new Y().turnedon();

        expect(resultOn).to.be.true;
        expect(resultOff).to.be.false;
    });    

    it('should choose', () => {        
        var flipped = new Flips({json: {features: [{feature:"hello", switchedOn: true}]}});
        
        class X {
            @flipped.choice("hello", () => false)
            turnedon(){
                return true;
            }
        }

        class Y {
            @flipped.choice("not", () => true)
            turnedon(){
                return false;
            }
        }

        var resultOn = new X().turnedon();
        var resultFallback = new Y().turnedon();

        expect(resultOn).to.be.true;
        expect(resultFallback).to.be.true;
    });    
});