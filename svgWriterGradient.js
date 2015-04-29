// Copyright (c) 2015 Adobe Systems Incorporated. All rights reserved.
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

/* Help write the gradients */

(function () {
    "use strict";

    var svgWriterUtils = require("./svgWriterUtils.js"),
        Tag = require("./svgWriterTag.js"),
        round10k = svgWriterUtils.round10k,
        gradientStops = {},
        getTransform = svgWriterUtils.getTransform;

    var offsetX = 0,
        offsetY = 0;

    function removeDups(lines) {
        var out = [lines[0]];
        for (var i = 1; i < lines.length; i++) {
            if (lines[i - 1].toString() != lines[i].toString()) {
                out.push(lines[i]);
            }
        }
        return out;
    }
    var self = {
        gradientStopsReset: function () {
            gradientStops = {};
        },
        getLinearGradientInternal: function (ctx, gradient, tag, link, lines, gradientID) {
            var x1 = gradient.x1 + offsetX,
                x2 = gradient.x2 + offsetX,
                y1 = gradient.y1 + offsetY,
                y2 = gradient.y2 + offsetY,
                attr = {
                    x1: x1,
                    y1: y1,
                    x2: x2,
                    y2: y2,
                    gradientTransform: getTransform(gradient.transform)
                };
            if (link) {
                attr["xlink:href"] = "#" + link.id;
                tag.setAttributes(attr);
            } else {
                gradientStops[lines] = {
                    id: gradientID,
                    x1: x1,
                    y1: y1,
                    x2: x2,
                    y2: y2,
                    gradientTransform: getTransform(gradient.transform)
                };
                attr.gradientUnits = "userSpaceOnUse";
                tag.setAttributes(attr);
                tag.children = removeDups(lines);
            }
        },
        getRadialGradientInternal: function (ctx, gradient, tag, link, lines, gradientID) {
            var cx = gradient.cx + offsetX,
                cy = gradient.cy + offsetY,
                fx = gradient.fx ? gradient.fx + offsetX : cx,
                fy = gradient.fy ? gradient.fy + offsetY : cy,
                r = gradient.r,
                attr = {
                    cx: cx,
                    cy: cy,
                    r: r,
                    gradientTransform: getTransform(gradient.transform)
                };
            if (isFinite(fx) && fx != cx) {
                attr.fx = fx;
            }
            if (isFinite(fy) && fy != cy) {
                attr.fy = fy;
            }
            if (link) {
                attr["xlink:href"] = "#" + link.id;
                tag.setAttributes(attr);
            } else {
                gradientStops[lines] = {
                    id: gradientID,
                    cx: cx,
                    cy: cy,
                    fx: fx,
                    fy: fy,
                    r: r,
                    gradientTransform: getTransform(gradient.transform)
                };
                attr.gradientUnits = "userSpaceOnUse";
                tag.setAttributes(attr);
                tag.children = removeDups(lines);
            }
        },
        writeGradient: function (ctx, styleBlock, gradient, flavor) {
            var omIn = ctx.currentOMNode,
                gradientID = ctx.ID.getUnique(gradient.type + "-gradient"),
                stops = gradient.stops,
                gradientSpace = gradient.gradientSpace,
                fingerprint = "",
                stp,
                lines = [],
                link,
                tag = new Tag(gradient.type + "Gradient", {
                    id: gradientID
                });

            offsetX = (ctx._shiftContentX || 0) + (ctx._shiftCropRectX || 0);
            offsetY = (ctx._shiftContentY || 0) + (ctx._shiftCropRectY || 0);

            if (!stops) {
                console.warn("encountered gradient with no stops");
                return;
            }

            for (var i = 0, ii = stops.length; i < ii; ++i) {
                stp = stops[i];
                lines.push(new Tag("stop", {
                    offset: stp.offset,
                    "stop-color": stp.color,
                    "stop-opacity": isFinite(stp.color.a) ? stp.color.a : 1
                }));
            }

            link = gradientStops[lines];
            if (gradient.type == "linear") {
                self.getLinearGradientInternal(ctx, gradient, tag, link, lines, gradientID);
            } else {
                self.getRadialGradientInternal(ctx, gradient, tag, link, lines, gradientID);
            }

            fingerprint = JSON.stringify({
                cx: round10k(gradient.cx),
                cy: round10k(gradient.cy),
                x1: round10k(gradient.x1),
                y1: round10k(gradient.y1),
                x2: round10k(gradient.x2),
                y2: round10k(gradient.y2),
                fx: round10k(gradient.fx),
                fy: round10k(gradient.fy),
                r: round10k(gradient.r),
                transform: gradient.transform,
                stops: stops,
                gradientSpace: gradientSpace
            });

            ctx.omStylesheet.define(gradient.type + "-gradient-" + flavor, omIn.id, gradientID, tag, fingerprint);
            styleBlock = ctx.omStylesheet.getStyleBlock(omIn, ctx.ID.getUnique);
            gradientID = ctx.omStylesheet.getDefine(omIn.id, gradient.type + "-gradient-" + flavor).defnId;
            styleBlock.addRule(flavor, "url(#" + gradientID + ")");
        }
    };

    module.exports = self;

}());
