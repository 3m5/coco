/**
 * JavaScript (c) 2012 3m5. Media GmbH
 * File: Mocha.Coco.Model.js
 *
 * Description:
 *
 */

var Coco = require("../../../../../src/js/de/_3m5/Coco.Init.js");

var assert = require("assert")
describe('Coco.Model', function(){
    describe('#initialize()', function(){

        var model = new Coco.Model();

        it('should return -1 when the value is not present', function(){
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        })
    })
});