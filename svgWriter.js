// Copyright (c) 2014 Adobe Systems Incorporated. All rights reserved.
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

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, bitwise: true */
/*global define: true, require: true, module: true */

/* given an svgOM, generate SVG */

(function () {
	"use strict";

    var buffer = require("buffer"),
        util = require("./utils.js"),
        svgWriterUtils = require("./svgWriterUtils.js"),
        svgWriterStroke = require("./svgWriterStroke.js"),
        svgWriterFill = require("./svgWriterFill.js"),
        svgWriterFx = require("./svgWriterFx.js"),
        svgWriterText = require("./svgWriterText.js"),
        svgWriterPreprocessor = require("./svgWriterPreprocessor.js"),
        svgWriterIDs = require("./svgWriterIDs.js"),
        SVGWriterContext = require("./svgWriterContext.js");
    
    function getFormatContext(svgOM, cfg, errors) {
        return new SVGWriterContext(svgOM, cfg, errors);
    }
    
    var toString = svgWriterUtils.toString,
        write = svgWriterUtils.write,
        writeln = svgWriterUtils.writeln,
        writeAttrIfNecessary = svgWriterUtils.writeAttrIfNecessary,
        writeTransformIfNecessary = svgWriterUtils.writeTransformIfNecessary,
        writeClassIfNeccessary = svgWriterUtils.writeClassIfNeccessary,
        writePositionIfNecessary = svgWriterUtils.writePositionIfNecessary,
        encodedText = svgWriterUtils.encodedText,
        indent = svgWriterUtils.indent,
        undent = svgWriterUtils.undent,
        writeLength = svgWriterUtils.writeLength,
        componentToHex = svgWriterUtils.componentToHex,
        rgbToHex = svgWriterUtils.rgbToHex,
        writeColor = svgWriterUtils.writeColor,
        round1k = svgWriterUtils.round1k,
        writeTextPath = svgWriterUtils.writeTextPath,
        writeTSpan = svgWriterText.writeTSpan,
        mergeTSpans = svgWriterText.mergeTSpans;

    function gWrap(ctx, id, fn) {
        var useTrick = false;
        
        if (!svgWriterFx.hasFx(ctx) || !svgWriterStroke.hasStroke(ctx)) {
            if (useTrick) {
                ctx._assignNextId = true;
            }
            ctx.omStylesheet.writePredefines(ctx);
            fn(useTrick);
            return;
        }
        write(ctx, ctx.currentIndent + "<g id=\"" + id + "\"");
        
        //if we have a filter chain and a stroke we may need to pull out another trick
        //the filter goes on the <g> and then the shape is replicated with use
        useTrick = true;
        
        //signal the shape to make an ID...
        ctx._assignNextId = true;
        
        // Any fill operation needs to move up here.
        write(ctx, " style=\"fill: "
            + ctx.omStylesheet.getStyleBlock(ctx.currentOMNode).getPropertyValue('fill') + ";"
            + " filter: " + ctx.omStylesheet.getStyleBlock(ctx.currentOMNode).getPropertyValue('filter') + ";\"");

        //do we need to wrap the use and other G in a G so they can be treated as one thing?        
        writeln(ctx, ">");
        indent(ctx);
        ctx.omStylesheet.writePredefines(ctx);
        fn(useTrick);
        undent(ctx);
        writeln(ctx, ctx.currentIndent + "</g>");
        if (useTrick) {
            writeln(ctx, ctx.currentIndent + "<use xlink:href=\"#" + ctx._lastID + "\" style=\"stroke: " + ctx.omStylesheet.getStyleBlock(ctx.currentOMNode).getPropertyValue('stroke') + "; fill: none; filter: none;\"/>");
        }
    }

    var rnd = Math.round;

    function writeIDIfNecessary(ctx, baseName) {
        var id;
        if (ctx._assignNextId) {
            id = svgWriterIDs.getUnique(baseName);
            write(ctx, " id=\"" + id + "\"");
            ctx._lastID = id;
            ctx._assignNextId = false;
        }
    }

    function writeLayerNode(ctx, sibling, siblingsLength) {
        var omIn = ctx.currentOMNode;
        
        //TBD: in some cases people might want to export their hidden layers so they can turn them on interactively
        if (!omIn.visible) { // && !ctx.config.writeInvisibleLayers) {
            return;
        }
        
        // Decide what type of layer it is and write that type...
        switch (omIn.type) {
            case "background":

                // FIXME: What to do with this?
                
                break;
            case "shape":

                if (!omIn.shapeBounds) {
                    console.warn("Shape has no boundaries.");
                    return;
                }
                gWrap(ctx, omIn.id, function (useTrick) {

                    var bnds = omIn.originBounds || omIn.shapeBounds,
                        top = parseFloat(bnds.top),
                        right = parseFloat(bnds.right),
                        bottom = parseFloat(bnds.bottom),
                        left = parseFloat(bnds.left),
                        w = right - left,
                        h = bottom - top,
                        oReturn = {};

                    switch(omIn.shape) {
                        case "circle":
                            write(ctx, ctx.currentIndent + "<circle");
                            
                            writeIDIfNecessary(ctx, "circle");
                            
                            writeAttrIfNecessary(ctx, "cx", rnd(left + w / 2), "0", "");
                            writeAttrIfNecessary(ctx, "cy", rnd(top + h / 2), "0", "");
                            writeAttrIfNecessary(ctx, "r", rnd(h / 2), "0", "");

                            writeClassIfNeccessary(ctx);

                            if (useTrick) {
                                write(ctx, " style=\"stroke: inherit; filter: none; fill: inherit;\"");
                            }
                            
                            writeln(ctx, "/>");
                            break;
                            
                         case "ellipse":
                            write(ctx, ctx.currentIndent + "<ellipse");
                            
                            writeIDIfNecessary(ctx, "ellipse");
                            
                            writeAttrIfNecessary(ctx, "cx", rnd(left + w / 2), "0", "");
                            writeAttrIfNecessary(ctx, "cy", rnd(top + h / 2), "0", "");
                            writeAttrIfNecessary(ctx, "rx", rnd(w / 2), "0", "");
                            writeAttrIfNecessary(ctx, "ry", rnd(h / 2), "0", "");

                            writeClassIfNeccessary(ctx);

                            if (useTrick) {
                                write(ctx, " style=\"stroke: inherit; filter: none; fill: inherit;\"");
                            }

                            writeTransformIfNecessary(ctx, "transform", omIn.transform, omIn.transformTX, omIn.transformTY);
                            
                            writeln(ctx, "/>");
                            break;
                            
                         case "path":
                            write(ctx, ctx.currentIndent + '<path d="' + util.optimisePath(omIn.pathData) + '"');
                            
                            writeIDIfNecessary(ctx, 'path');
                            writeClassIfNeccessary(ctx);

                            if (useTrick) {
                                write(ctx, ' style="stroke: inherit; filter: none; fill: inherit;"');
                            }
                            
                            writeln(ctx, '/>');
                            break;
                            
                         case "rect":
                            write(ctx, ctx.currentIndent + "<rect");
                            
                            writeIDIfNecessary(ctx, "rect");
                            
                            writeAttrIfNecessary(ctx, "x", rnd(left), "0", "");
                            writeAttrIfNecessary(ctx, "y", rnd(top), "0", "");
                            writeAttrIfNecessary(ctx, "width", rnd(w), "0", "");
                            writeAttrIfNecessary(ctx, "height", rnd(h), "0", "");
                            if (omIn.shapeRadii) {
                                var r = parseInt(omIn.shapeRadii[0], 10);
                                writeAttrIfNecessary(ctx, "rx", rnd(r), "0", "");
                                writeAttrIfNecessary(ctx, "ry", rnd(r), "0", "");
                            }

                            writeClassIfNeccessary(ctx);

                            if (useTrick) {
                                write(ctx, " style=\"stroke: inherit; filter: none; fill: inherit;\"");
                            }

                            writeTransformIfNecessary(ctx, "transform", omIn.transform, omIn.transformTX, omIn.transformTY);
                            
                            writeln(ctx, "/>");
                            break;
                            
                         default:
                            console.log("NOT HANDLED DEFAULT " + omIn.shape);
                            break;
                    }
                });

                break;
            case "tspan": {
                writeTSpan(ctx, sibling, omIn);

                if (omIn.children.length) {
                    mergeTSpans(ctx, sibling, omIn.children);
                }


                if (omIn.text) {
                    write(ctx, encodedText(omIn.text));
                }
                write(ctx, "</tspan>");
                
                if (omIn.style && omIn.style["_baseline-script"] === "super") {
                    ctx._nextTspanAdjustSuper = true;
                }
                
                break;
            }
            case "text":
                gWrap(ctx, omIn.id, function () {
                    
                    var children = ctx.currentOMNode.children,
                        rightAligned = false,
                        centered = false,
                        i,
                        bndsFx,
                        bndsNat,
                        bndsAlt,
                        bndsDy,
                        bndsDyAlt,
                        pxWidth = omIn.textBounds.right - omIn.textBounds.left,
                        pxHeight = omIn.textBounds.bottom - omIn.textBounds.top;
                    
                    if (children && children.length > 0 &&
                        children[0].style && children[0].style["text-anchor"] === "end") {
                        rightAligned = true;
                    } else if (children && children.length > 0 &&
                        children[0].style && children[0].style["text-anchor"] === "middle") {
                        centered = true;
                    }
                    
                    write(ctx, ctx.currentIndent + "<text");

                    
                    if (rightAligned) {
                        writeAttrIfNecessary(ctx, "x", "100", 0, "%");
                        omIn.position.x = 0;
                        writePositionIfNecessary(ctx, omIn.position);
                    } else {
                        writePositionIfNecessary(ctx, omIn.position);
                    }
                    
                    if (centered && omIn.transform) {
                        omIn.transformTX += pxWidth;
                        omIn.transformTY += pxHeight;
                    }
                    
                    writeClassIfNeccessary(ctx);

                    writeTransformIfNecessary(ctx, "transform", omIn.transform, omIn.transformTX, omIn.transformTY);
                    write(ctx, ">");

                    ctx._nextTspanAdjustSuper = false;
                    ctx.omStylesheet.writePredefines(ctx);
                    
                    for (i = 0; i < children.length; i++) {
                        ctx.currentOMNode = children[i];
                        writeSVGNode(ctx, i, children.length);
                    }
                    writeln(ctx, "</text>");
                });

                break;
            case "textPath": {
                var offset = 0,
                    styleBlock = ctx.omStylesheet.getStyleBlock(ctx.currentOMNode);

                write(ctx, "<textPath");

                if (!ctx.hasWritten(omIn, "text-path-attr")) {
                    ctx.didWrite(omIn, "text-path-attr");
                    var textPathDefn = ctx.omStylesheet.getDefine(omIn.id, "text-path");
                    if (textPathDefn) {
                        write(ctx, " xlink:href=\"#" + textPathDefn.defnId + "\"");
                    } else {
                        console.log("text-path with no def found");
                    }
                }
                if (styleBlock.hasProperty("text-anchor")) {
                    offset = {middle: 50, end: 100}[styleBlock.getPropertyValue("text-anchor")] || 0;
                }
                writeAttrIfNecessary(ctx, "startOffset", offset, 0, "%");
                writeln(ctx, ">");
                
                indent(ctx);
                ctx.omStylesheet.writePredefines(ctx);
                var children = ctx.currentOMNode.children;
                for (var iTextChild = 0; iTextChild < children.length; iTextChild++) {
                    write(ctx, ctx.currentIndent);
                    var childNodeText = children[iTextChild];
                    ctx.currentOMNode = childNodeText;
                    writeSVGNode(ctx, iTextChild, children.length);
                    write(ctx, ctx.terminator);
                }
                undent(ctx);
                write(ctx, ctx.currentIndent + "</textPath>");
                break;
            }
            case "generic":
                if (!omIn.shapeBounds) {
                    console.warn("Shape has no boundaries.");
                    return;
                }
                gWrap(ctx, omIn.id, function () {
                    var top = parseInt(omIn.shapeBounds.top, 10),
                        right = parseInt(omIn.shapeBounds.right, 10),
                        bottom = parseInt(omIn.shapeBounds.bottom, 10),
                        left = parseInt(omIn.shapeBounds.left, 10),
                        w = right - left,
                        h = bottom - top;

                    write(ctx, ctx.currentIndent + "<image xlink:href=\"" + omIn.pixel + "\"");

                    // FIXME: The PS imported image already has all fx effects applied.
                    // writeClassIfNeccessary(ctx);

                    writeAttrIfNecessary(ctx, "x", left, "0", "");
                    writeAttrIfNecessary(ctx, "y", top, "0", "");
                    writeAttrIfNecessary(ctx, "width", w, "0", "");
                    writeAttrIfNecessary(ctx, "height", h, "0", "");

                    writeln(ctx, "/>");
                });

                break;
            case "group":

                write(ctx, ctx.currentIndent + "<g id=\"" + omIn.id + "\"");
                writeClassIfNeccessary(ctx);
                writeln(ctx, ">");
                indent(ctx);
                ctx.omStylesheet.writePredefines(ctx);
                var childrenGroup = ctx.currentOMNode.children;
                for (var iGroupChild = 0; iGroupChild < childrenGroup.length; iGroupChild++) {
                    var groupChildNode = childrenGroup[iGroupChild];
                    ctx.currentOMNode = groupChildNode;
                    writeSVGNode(ctx, iGroupChild, childrenGroup.length);
                }
                undent(ctx);
                writeln(ctx, ctx.currentIndent + "</g>");

                break;
            default:
                console.log("ERROR: Unknown omIn.type = " + omIn.type);
                break;
        }
    }
    
    function writeSVGNode(ctx, sibling, siblingsLength) {

        var omIn = ctx.currentOMNode;
        
        if (omIn === ctx.svgOM) {
            
            var i,
                children = ctx.currentOMNode.children,
                childNode,
                hasRules,
                hasDefines,
                preserveAspectRatio = ctx.config.preserveAspectRatio || "none",
                scale = ctx.config.scale || 1,
                left = round1k(omIn.viewBox.left),
                top = round1k(omIn.viewBox.top),
                
                width = Math.abs(omIn.viewBox.right - omIn.viewBox.left),
                height = Math.abs(omIn.viewBox.bottom - omIn.viewBox.top),
                scaledW = isFinite(ctx.config.targetWidth) ? round1k(scale * ctx.config.targetWidth) : round1k(scale * width),
                scaledH = isFinite(ctx.config.targetHeight) ? round1k(scale * ctx.config.targetHeight) : round1k(scale * height);
            
            width = round1k(width);
            height = round1k(height);
            
            write(ctx, '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"');
            write(ctx, ' preserveAspectRatio="' + preserveAspectRatio + '"');
            writeAttrIfNecessary(ctx, "x", omIn.offsetX, "0", "px");
            writeAttrIfNecessary(ctx, "y", omIn.offsetY, "0", "px");
            write(ctx, ' width="' + scaledW + '" height="' + scaledH + '"');
            
            write(ctx, ' viewBox="' + left + ' ' + top + ' ');
            write(ctx, width + ' ');
            write(ctx, height + '"');
            
            writeln(ctx, '>');
            indent(ctx);
            
            // Write the style sheet.
            hasRules = !ctx.usePresentationAttribute && ctx.omStylesheet.hasRules();
            hasDefines = ctx.omStylesheet.hasDefines();

            if (hasRules || hasDefines) {
                svgWriterUtils.gradientStopsReset();
                writeln(ctx, ctx.currentIndent + "<defs>");
                indent(ctx);
                
                !ctx.usePresentationAttribute && ctx.omStylesheet.writeSheet(ctx);
                
                if (hasRules && hasDefines) {
                    write(ctx, ctx.terminator);
                }
                ctx.omStylesheet.writeDefines(ctx);

                undent(ctx);
                writeln(ctx, ctx.currentIndent + "</defs>");
            }
            
            for (i = 0; i < children.length; i++) {
                childNode = children[i];
                ctx.currentOMNode = childNode;
                writeSVGNode(ctx, i, children.length, children.length);
            }
            
            undent(ctx);
            ctx.currentOMNode = omIn;
            writeln(ctx, "</svg>");
        } else {
            writeLayerNode(ctx, sibling, siblingsLength);
        }
    }
    
    
	function print(svgOM, opt, errors) {
        
        var ctx = getFormatContext(svgOM, opt || {}, errors);
        svgWriterIDs.reset();
        try {
            svgWriterPreprocessor.processSVGOM(ctx);
            ctx.omStylesheet.consolidateStyleBlocks();
            writeSVGNode(ctx);
        } catch (ex) {
            console.error("Ex: " + ex);
            console.log(ex.stack);
        }
		return toString(ctx);
	}



	module.exports.printSVG = print;
}());
