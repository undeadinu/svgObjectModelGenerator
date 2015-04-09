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

/* Help write the SVG */

(function () {
    "use strict";

    var Tag = require("./svgWriterTag.js");

    function SVGWriterFx() {

        var writeFilter = function (ctx, ele, previousEffect) {
            var name = ele.name,
                input = ele.input || [],
                children = ele.children || [],
                cur,
                i,
                ii;
            delete ele.name;
            delete ele.input;
            delete ele.children;

            if (typeof ele.x === "number") {
                ele.x += ctx._shiftContentX || 0;
            }
            if (typeof ele.y === "number") {
                ele.y += ctx._shiftContentY || 0;
            }

            for (i = 0, ii = input.length; i < ii; ++i) {
                if (input[i] != previousEffect) {
                    ele["in" + (i ? "2" : "")] = input[i];
                }
            }
            cur = new Tag(name, ele);

            for (i = 0, ii = children.length; i < ii; ++i) {
                cur.appendChild(writeFilter(ctx, children[i], i ? children[i - 1].result : ""));
            }
            return cur;
        };

        this.externalizeStyles = function (ctx) {
            var omIn = ctx.currentOMNode,
                fingerprint = "",
                filter,
                filterID,
                styleBlock,
                filterTag;

            if (!omIn.style || !omIn.style.filter) {
                return;
            }
            filter = omIn.style.filter;
            if (ctx.svgOM.global && ctx.svgOM.global.filters[filter]) {
                filterID = ctx.ID.getUnique("filter");
                ctx.currentOMNode = ctx.svgOM.global.filters[filter];
                fingerprint = JSON.stringify(ctx.currentOMNode.children);
                ctx.currentOMNode.name = "filter";
                filterTag = writeFilter(ctx, ctx.currentOMNode);
                ctx.currentOMNode = omIn;
                filterTag.setAttribute("id", filterID);
                ctx.omStylesheet.define("filter", omIn.id, filterID, filterTag, fingerprint);
            }

            styleBlock = ctx.omStylesheet.getStyleBlock(omIn, ctx.ID.getUnique);
            filterID = ctx.omStylesheet.getDefine(omIn.id, "filter").defnId;
            styleBlock.addRule("filter", "url(#" + filterID + ")");
        };
    }

    module.exports = new SVGWriterFx();

}());
