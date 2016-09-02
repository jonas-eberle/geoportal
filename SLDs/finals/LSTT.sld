<?xml version="1.0" ?>
<sld:StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:sld="http://www.opengis.net/sld">
    <sld:UserLayer>
        <sld:LayerFeatureConstraints>
            <sld:FeatureTypeConstraint/>
        </sld:LayerFeatureConstraints>
        <sld:UserStyle>
            <sld:Name>SWOS_LSTtrend</sld:Name>
            <sld:Title/>
            <sld:FeatureTypeStyle>
                <sld:Name/>
                <sld:Rule>
                    <sld:RasterSymbolizer>
                        <sld:Geometry>
                            <ogc:PropertyName>grid</ogc:PropertyName>
                        </sld:Geometry>
                        <sld:Opacity>1</sld:Opacity>
                        <sld:ColorMap type="ramp">
                            <sld:ColorMapEntry color="#0300b7" label="6" opacity="1.0" quantity="-6"/>
                            <sld:ColorMapEntry color="#2c7bb6" label="-4" opacity="1.0" quantity="-4"/>
                            <sld:ColorMapEntry color="#abd9e9" label="-2" opacity="1.0" quantity="-2"/>
                            <sld:ColorMapEntry color="#ffffbf" label="0" opacity="1.0" quantity="0"/>
                            <sld:ColorMapEntry color="#ff9538" label="2" opacity="1.0" quantity="2"/>
                            <sld:ColorMapEntry color="#d7711c" label="4" opacity="1.0" quantity="4"/>
                            <sld:ColorMapEntry color="#b50021" label="6" opacity="1.0" quantity="6"/>
                        </sld:ColorMap>
                    </sld:RasterSymbolizer>
                </sld:Rule>
            </sld:FeatureTypeStyle>
        </sld:UserStyle>
    </sld:UserLayer>
</sld:StyledLayerDescriptor>
