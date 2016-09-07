<?xml version="1.0" encoding="UTF-8"?>
<sld:StyledLayerDescriptor xmlns:sld="http://www.opengis.net/sld"  xmlns:se="http://www.opengis.net/se" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld
http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd" version="1.0.0">
<sld:UserLayer>
    <se:Name>SWD_test</se:Name>
    <sld:UserStyle>
        <se:Name>raster</se:Name>
        <se:FeatureTypeStyle>
            <se:FeatureTypeName>Feature</se:FeatureTypeName>
            <se:Rule>
                <sld:RasterSymbolizer>
                    <se:Opacity>1.0</se:Opacity>
                           <se:ColorMap type="values">
           <se:ColorMapEntry color="#0000ff" quantity="1" label="permanently flooded"/>
           <se:ColorMapEntry color="#7fffd4" quantity="2" label="temporarily flooded"/>
           <se:ColorMapEntry color="#ffff00" quantity="3" label="never flooded"/>
         </se:ColorMap>
                </sld:RasterSymbolizer>
            </se:Rule>
        </se:FeatureTypeStyle>
    </sld:UserStyle>
</sld:UserLayer>
</sld:StyledLayerDescriptor>
