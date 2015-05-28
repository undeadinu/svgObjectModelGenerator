module.exports = {
	"children": [
		{
			"type": "shape",
			"visible": true,
			"style": {
				"stroke": {
					"type": "none"
				},
				"fill": {
					"type": "solid",
					"color": {
						"r": 0,
						"g": 127,
						"b": 0,
						"a": 1
					}
				},
				"meta": {
					"PS": {
						"fx": {
							"dropShadowMulti": [
								{
									"enabled": true,
									"mode": "multiply",
									"color": {
										"r": 0,
										"g": 0,
										"b": 0,
										"a": 1
									},
									"opacity": 0.5,
									"useGlobalAngle": true,
									"localLightingAngle": {
										"value": 120,
										"units": "angleUnit"
									},
									"distance": 2,
									"chokeMatte": 0,
									"blur": 2,
									"noise": {
										"value": 0,
										"units": "percentUnit"
									},
									"antiAlias": false,
									"transferSpec": {
										"name": "Linear"
									},
									"layerConceals": true
								}
							],
							"gradientFillMulti": [
								{
									"enabled": true,
									"mode": "normal",
									"opacity": {
										"value": 19,
										"units": "percentUnit"
									},
									"gradient": {
										"name": "$$$/DefaultGradient/ForegroundToBackground=Foreground to Background",
										"gradientForm": "customStops",
										"interfaceIconFrameDimmed": 4096,
										"colors": [
											{
												"color": {
													"red": 0.124514,
													"green": 3,
													"blue": 0.023346
												},
												"type": "userStop",
												"location": 0,
												"midpoint": 50
											},
											{
												"color": {
													"red": 255,
													"green": 255,
													"blue": 255
												},
												"type": "userStop",
												"location": 4096,
												"midpoint": 50
											}
										],
										"transparency": [
											{
												"opacity": {
													"value": 100,
													"units": "percentUnit"
												},
												"location": 0,
												"midpoint": 50
											},
											{
												"opacity": {
													"value": 100,
													"units": "percentUnit"
												},
												"location": 4096,
												"midpoint": 50
											}
										]
									},
									"angle": {
										"value": 90,
										"units": "angleUnit"
									},
									"type": "linear",
									"reverse": false,
									"dither": false,
									"align": true,
									"scale": {
										"value": 100,
										"units": "percentUnit"
									},
									"offset": {
										"horizontal": {
											"value": 0,
											"units": "percentUnit"
										},
										"vertical": {
											"value": 0,
											"units": "percentUnit"
										}
									}
								}
							],
							"innerShadowMulti": [
								{
									"enabled": true,
									"mode": "overlay",
									"color": {
										"r": 0,
										"g": 0,
										"b": 0,
										"a": 1
									},
									"opacity": 0.75,
									"useGlobalAngle": true,
									"localLightingAngle": {
										"value": 120,
										"units": "angleUnit"
									},
									"distance": 1,
									"chokeMatte": 0,
									"blur": 0,
									"noise": {
										"value": 0,
										"units": "percentUnit"
									},
									"antiAlias": false,
									"transferSpec": {
										"name": "Linear"
									}
								}
							]
						}
					}
				},
				"filter": "filter-1"
			},
			"name": "Rectangle 1",
			"visualBounds": {
				"top": 185,
				"left": 262,
				"bottom": 250,
				"right": 458
			},
			"shape": {
				"type": "rect",
				"x": 263,
				"y": 185,
				"width": 193,
				"height": 61
			}
		}
	],
	"global": {
		"clipPaths": {},
		"filters": {
			"filter-1": {
				"filterUnits": "userSpaceOnUse",
				"children": [
					{
						"name": "feGaussianBlur",
						"result": "blur-1",
						"input": [
							"SourceAlpha"
						],
						"stdDeviation": 1.414
					},
					{
						"name": "feFlood",
						"result": "flood-1",
						"input": [],
						"flood-color": {
							"r": 0,
							"g": 0,
							"b": 0,
							"a": 1
						},
						"flood-opacity": 0.5
					},
					{
						"name": "feComposite",
						"result": "composite-1",
						"input": [
							"flood-1",
							"blur-1"
						],
						"operator": "in"
					},
					{
						"name": "feOffset",
						"result": "offset-1",
						"input": [
							"composite-1"
						],
						"dx": 0,
						"dy": 2
					},
					{
						"name": "feBlend",
						"result": "blend-1",
						"input": [
							"SourceGraphic",
							"offset-1"
						]
					},
					{
						"name": "feImage",
						"result": "image-1",
						"input": [],
						"x": 263,
						"y": 185,
						"width": 193,
						"height": 61,
						"preserveAspectRatio": "none",
						"xlink:href": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCIgd2lkdGg9IjE5MyIgaGVpZ2h0PSI2MSIgdmlld0JveD0iMCAwIDE5MyA2MSI+CiAgPGRlZnM+CiAgICA8c3R5bGU+CiAgICAgIC5jbHMtMSB7CiAgICAgICAgZmlsbDogdXJsKCNsaW5lYXItZ3JhZGllbnQtMSk7CiAgICAgICAgb3BhY2l0eTogMC4xOTsKICAgICAgfQogICAgPC9zdHlsZT4KCiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVudC0xIiB4MT0iOTYuNSIgeTE9IjYxIiB4Mj0iOTYuNSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMwMDAzMDAiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTkzIiBoZWlnaHQ9IjYxIiBjbGFzcz0iY2xzLTEiLz4KPC9zdmc+Cg=="
					},
					{
						"name": "feComposite",
						"result": "composite-2",
						"input": [
							"image-1",
							"SourceGraphic"
						],
						"operator": "in"
					},
					{
						"name": "feBlend",
						"result": "blend-2",
						"input": [
							"composite-2",
							"blend-1"
						],
						"mode": "normal"
					},
					{
						"name": "feGaussianBlur",
						"result": "blur-2",
						"input": [
							"SourceAlpha"
						],
						"stdDeviation": 0
					},
					{
						"name": "feFlood",
						"result": "flood-2",
						"input": [],
						"flood-color": {
							"r": 0,
							"g": 0,
							"b": 0,
							"a": 1
						},
						"flood-opacity": 0.75
					},
					{
						"name": "feComposite",
						"result": "composite-3",
						"input": [
							"flood-2",
							"blur-2"
						],
						"operator": "out"
					},
					{
						"name": "feOffset",
						"result": "offset-2",
						"input": [
							"composite-3"
						],
						"dx": 0,
						"dy": 1
					},
					{
						"name": "feComposite",
						"result": "composite-4",
						"input": [
							"offset-2",
							"SourceAlpha"
						],
						"operator": "in"
					},
					{
						"name": "feBlend",
						"result": "blend-3",
						"input": [
							"composite-4",
							"blend-2"
						],
						"mode": "overlay"
					}
				]
			}
		},
		"gradients": {},
		"masks": {},
		"patterns": {},
		"bounds": {
			"top": 0,
			"left": 0,
			"bottom": 600,
			"right": 800
		},
		"pxToInchRatio": 72
	},
	"artboards": {},
	"meta": {
		"PS": {
			"globalLight": {
				"angle": 90,
				"altitude": 30
			}
		}
	},
	"version": "0.1.0",
	"name": "Untitled-2"
}