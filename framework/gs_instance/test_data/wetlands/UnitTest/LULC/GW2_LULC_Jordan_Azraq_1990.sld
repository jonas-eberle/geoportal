<ns0:StyledLayerDescriptor xmlns:ns0="http://www.opengis.net/sld" xmlns:ns2="http://www.opengis.net/se" xmlns:ns3="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd">
  <ns0:NamedLayer>
    <ns2:Name>GW2_LULC_Jordan_Azraq_1990</ns2:Name>
    <ns0:UserStyle>
      <ns2:Name>GW2_LULC_Jordan_Azraq_1990</ns2:Name>
      <ns2:FeatureTypeStyle>
      <ns2:Rule>
          <ns2:Name>CLC 112: Discontinuous urban fabric</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 112: Discontinuous urban fabric</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>Class</ns3:PropertyName>
              <ns3:Literal>112</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ff0000</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ff0000</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 121: Industrial or commercial units</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 121: Industrial or commercial units</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>Class</ns3:PropertyName>
              <ns3:Literal>121</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#cc4df2</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#cc4df2</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 122: Road and rail networks and associated land</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 122: Road and rail networks and associated land</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>Class</ns3:PropertyName>
              <ns3:Literal>122</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#cc0000</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#cc0000</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 124: Airports</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 124: Airports</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>Class</ns3:PropertyName>
              <ns3:Literal>124</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#e6cce6</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#e6cce6</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 212: Permanently irrigated land</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 212: Permanently irrigated land</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>Class</ns3:PropertyName>
              <ns3:Literal>212</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ffff00</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ffff00</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 32: Shrub and/or herbaceous vegetation association</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 32: Shrub and/or herbaceous vegetation association</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>Class</ns3:PropertyName>
              <ns3:Literal>32</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#d3ffbe</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#d3ffbe</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 33: Open spaces with little or no vegetation</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 33: Open spaces with little or no vegetation</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>Class</ns3:PropertyName>
              <ns3:Literal>33</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#b2b2b2</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#b2b2b2</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 331: Beaches, dunes, and sand plains</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 331: Beaches, dunes, and sand plains</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>Class</ns3:PropertyName>
              <ns3:Literal>331</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#e6e6e6</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#e6e6e6</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 333: Sparsely vegetated areas</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 333: Sparsely vegetated areas</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>Class</ns3:PropertyName>
              <ns3:Literal>333</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ccffcc</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ccffcc</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 411: Inland marshes</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 411: Inland marshes</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>Class</ns3:PropertyName>
              <ns3:Literal>411</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#a6a6ff</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#a6a6ff</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 422: Salines</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 422: Salines</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>Class</ns3:PropertyName>
              <ns3:Literal>422</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#e6e6ff</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#e6e6ff</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 5113: Seasonal/intermittent/irregular rivers/streams/creeks/wadis</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 5113: Seasonal/intermittent/irregular rivers/streams/creeks/wadis</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>Class</ns3:PropertyName>
              <ns3:Literal>5113</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#00e5f1</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#00e5f1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 5124: Seasonal/intermittent saline/brackish/alkaline lakes and flats</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 5124: Seasonal/intermittent saline/brackish/alkaline lakes and flats</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>Class</ns3:PropertyName>
              <ns3:Literal>5124</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#8fe5ca</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#8fe5ca</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        </ns2:FeatureTypeStyle>
    </ns0:UserStyle>
  </ns0:NamedLayer>
</ns0:StyledLayerDescriptor>