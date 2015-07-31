// Copyright (c) 2014, 2015 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/*global require: true, describe: true, it: true */

var expect = require("chai").expect,
    SVGStylesheet = require("../svgStylesheet.js");

describe("SVGStylesheet", function () {

    describe("our SVG stylesheet", function () {

        it("knows whether it has rules to write", function () {

            var sheet = new SVGStylesheet,
                styleBlock;

            expect(sheet.hasRules()).to.equal(false);

            styleBlock = sheet.getStyleBlock({className: "clsTest" });
            styleBlock.addRule("fill", "#ed3ecc");

            expect(sheet.hasRules()).to.equal(true);
        });


        it("knows whether it has defines to write", function () {
            var sheet = new SVGStylesheet;

            expect(sheet.hasDefines()).to.equal(false);

            sheet.def("testing…", function () {}, "fingerprint");

            expect(sheet.hasDefines()).to.equal(true);
        });


        it("knows how to extract similar rules from 2 blocks", function () {

            var sheet = new SVGStylesheet,
                blocks = [];

            blocks[0] = sheet.getStyleBlock({className: "clsTest1" });
            blocks[1] = sheet.getStyleBlock({className: "clsTest2" });

            blocks[0].addRule("fill", "#0f0");
            blocks[0].addRule("stroke", "#fff");
            blocks[0].addRule("opacity", "0.5");
            blocks[0].addRule("fill-opacity", "0.25");

            blocks[1].addRule("fill", "#0f0");
            blocks[1].addRule("opacity", "0.5");
            blocks[1].addRule("stroke", "#fff");
            blocks[1].addRule("stroke-opacity", "0.25");

            blocks = sheet.extract(blocks);

            blocks = blocks.map(function (block) {
                return block.toString("");
            });
            expect(blocks.join("")).to.equal(".clsTest1, .clsTest2 {\n  fill: #0f0;\n  stroke: #fff;\n  opacity: 0.5;\n}\n.clsTest1 {\n  fill-opacity: 0.25;\n}\n.clsTest2 {\n  stroke-opacity: 0.25;\n}\n");
        });

        it("knows how to extract similar rules from 3 blocks", function () {

            var sheet = new SVGStylesheet,
                blocks = [];

            blocks[0] = sheet.getStyleBlock({className: "clsTest1" });
            blocks[1] = sheet.getStyleBlock({className: "clsTest2" });
            blocks[2] = sheet.getStyleBlock({className: "clsTest3" });

            blocks[0].addRule("fill", "#0f0");
            blocks[0].addRule("stroke", "#fff");
            blocks[0].addRule("opacity", "0.5");
            blocks[0].addRule("fill-opacity", "0.25");

            blocks[1].addRule("fill", "#0f0");
            blocks[1].addRule("opacity", "0.5");
            blocks[1].addRule("stroke", "#fff");
            blocks[1].addRule("stroke-opacity", "0.25");

            blocks[2].addRule("fill", "#0f0");
            blocks[2].addRule("opacity", "0.25");
            blocks[2].addRule("stroke", "#fff");
            blocks[2].addRule("filter", "url(#filter)");
            blocks[2].addRule("stroke-opacity", "0.25");

            blocks = sheet.extract(blocks);

            blocks = blocks.map(function (block) {
                return block.toString("");
            });
            expect(blocks.join("")).to.equal(".clsTest1, .clsTest2, .clsTest3 {\n  fill: #0f0;\n  stroke: #fff;\n}\n.clsTest1, .clsTest2 {\n  opacity: 0.5;\n}\n.clsTest1 {\n  fill-opacity: 0.25;\n}\n.clsTest2, .clsTest3 {\n  stroke-opacity: 0.25;\n}\n.clsTest3 {\n  opacity: 0.25;\n  filter: url(#filter);\n}\n");
        });

        it("knows how to extract similar rules from 4 blocks", function () {

            var sheet = new SVGStylesheet,
                blocks = [];

            blocks[0] = sheet.getStyleBlock({className: "clsTest1" });
            blocks[1] = sheet.getStyleBlock({className: "clsTest2" });
            blocks[2] = sheet.getStyleBlock({className: "clsTest3" });
            blocks[3] = sheet.getStyleBlock({className: "clsTest4" });

            blocks[0].addRule("fill", "#000");
            blocks[0].addRule("stroke", "#fff");
            blocks[0].addRule("opacity", "0.5");
            blocks[0].addRule("fill-opacity", "0.25");

            blocks[1].addRule("fill", "#000");
            blocks[1].addRule("opacity", "0.5");
            blocks[1].addRule("stroke", "#fff");
            blocks[1].addRule("stroke-opacity", "0.25");

            blocks[2].addRule("fill", "#000");
            blocks[2].addRule("opacity", "0.25");
            blocks[2].addRule("stroke", "#fff");
            blocks[2].addRule("filter", "url(#filter)");
            blocks[2].addRule("stroke-opacity", "0.25");

            blocks[3].addRule("fill", "#000");
            blocks[3].addRule("opacity", "0.75");
            blocks[3].addRule("stroke", "#fff");
            blocks[3].addRule("fill-opacity", "0.25");

            blocks = sheet.extract(blocks);

            blocks = blocks.map(function (block) {
                return block.toString("");
            });
            expect(blocks.join("")).to.equal(".clsTest1, .clsTest2, .clsTest3, .clsTest4 {\n  stroke: #fff;\n}\n.clsTest1, .clsTest2 {\n  opacity: 0.5;\n}\n.clsTest1, .clsTest4 {\n  fill-opacity: 0.25;\n}\n.clsTest2, .clsTest3 {\n  stroke-opacity: 0.25;\n}\n.clsTest3 {\n  opacity: 0.25;\n  filter: url(#filter);\n}\n.clsTest4 {\n  opacity: 0.75;\n}\n");
        });



    });
});
