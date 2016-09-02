<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld
http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd" version="1.0.0">
<UserLayer>
    <Name>SWD_test</Name>
    <UserStyle>
        <Name>raster</Name>
        <FeatureTypeStyle>
            <FeatureTypeName>Feature</FeatureTypeName>
            <Rule>
                <RasterSymbolizer>
                    <Opacity>1.0</Opacity>
                           <ColorMap type="values">
           <ColorMapEntry color="#000000" quantity="0" label="Unclassified"/>
           <ColorMapEntry color="#0000ff" quantity="1" label="permanently flooded"/>
           <ColorMapEntry color="#7fffd4" quantity="2" label="temporarily flooded"/>
           <ColorMapEntry color="#ffff00" quantity="3" label="never flooded"/>
         </ColorMap>
                </RasterSymbolizer>
            </Rule>
        </FeatureTypeStyle>
    </UserStyle>
</UserLayer>
</StyledLayerDescriptor>
