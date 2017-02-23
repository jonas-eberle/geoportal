<ns0:StyledLayerDescriptor xmlns:ns0="http://www.opengis.net/sld" xmlns:ns2="http://www.opengis.net/se" xmlns:ns3="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd">
  <ns0:NamedLayer>
    <ns2:Name>GW2_LULCC_Jordan_Azraq_1975_1990</ns2:Name>
    <ns0:UserStyle>
      <ns2:Name>GW2_LULCC_Jordan_Azraq_1975_1990</ns2:Name>
      <ns2:FeatureTypeStyle>
      <ns2:Rule>
          <ns2:Name>LCF2 - Urban residential sprawl</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF2 - Urban residential sprawl</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>SEGMENT_ID</ns3:PropertyName>
              <ns3:Literal>2</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ff0044</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ff0044</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF22 - Urban diffuse residential sprawl</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF22 - Urban diffuse residential sprawl</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>SEGMENT_ID</ns3:PropertyName>
              <ns3:Literal>22</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#a80000</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#a80000</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF221 - Urban diffuse residential sprawl against wetlands</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF221 - Urban diffuse residential sprawl against wetlands</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>SEGMENT_ID</ns3:PropertyName>
              <ns3:Literal>221</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#730000</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#730000</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF3 - Sprawl of economic sites and infrastructures </ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF3 - Sprawl of economic sites and infrastructures </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>SEGMENT_ID</ns3:PropertyName>
              <ns3:Literal>3</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#f5f5f5</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#f5f5f5</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF31 - Sprawl of industrial and commercial sites</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF31 - Sprawl of industrial and commercial sites</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>SEGMENT_ID</ns3:PropertyName>
              <ns3:Literal>31</ns3:Literal>
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
          <ns2:Name>LCF32 - Sprawl of transport networks</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF32 - Sprawl of transport networks</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>SEGMENT_ID</ns3:PropertyName>
              <ns3:Literal>32</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#969696</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#969696</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF34 - Sprawl of airports</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF34 - Sprawl of airports</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>SEGMENT_ID</ns3:PropertyName>
              <ns3:Literal>34</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#000000</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#000000</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF5 - Extension of agriculture land use</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF5 - Extension of agriculture land use</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>SEGMENT_ID</ns3:PropertyName>
              <ns3:Literal>5</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#e4fa94</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#e4fa94</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF521 - Intensive conversion from semi-natural land to agriculture</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF521 - Intensive conversion from semi-natural land to agriculture</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>SEGMENT_ID</ns3:PropertyName>
              <ns3:Literal>521</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#49c225</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#49c225</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF53 - Conversion from wetlands and waters to agriculture</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF53 - Conversion from wetlands and waters to agriculture</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>SEGMENT_ID</ns3:PropertyName>
              <ns3:Literal>53</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#0a5248</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#0a5248</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF62 - Withdrawal of farming without significant woodland creation</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF62 - Withdrawal of farming without significant woodland creation</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>SEGMENT_ID</ns3:PropertyName>
              <ns3:Literal>62</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#30cf92</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#30cf92</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF81 - Water bodies (dams and reservoirs) creation </ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF81 - Water bodies (dams and reservoirs) creation </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>SEGMENT_ID</ns3:PropertyName>
              <ns3:Literal>81</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#14afe6</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#14afe6</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF82 - Water bodies (reservoirs) management </ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF82 - Water bodies (reservoirs) management </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>SEGMENT_ID</ns3:PropertyName>
              <ns3:Literal>82</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#0078b8</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#0078b8</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF9 - Changes resulting from natural phenomena</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF9 - Changes resulting from natural phenomena</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>SEGMENT_ID</ns3:PropertyName>
              <ns3:Literal>9</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#dfd4e6</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#dfd4e6</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF91 - Semi-natural creation and rotation</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF91 - Semi-natural creation and rotation</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>SEGMENT_ID</ns3:PropertyName>
              <ns3:Literal>91</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#d4b3e8</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#d4b3e8</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF912 - Semi-natural rotation</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF912 - Semi-natural rotation</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>SEGMENT_ID</ns3:PropertyName>
              <ns3:Literal>912</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#db73d6</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#db73d6</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF9122 - Wetland creation in dry semi-natural and natural land cover types</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF9122 - Wetland creation in dry semi-natural and natural land cover types</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>SEGMENT_ID</ns3:PropertyName>
              <ns3:Literal>9122</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#be7fad</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#be7fad</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF9123 - Wetland uptake from dry semi-natural and natural land cover types</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF9123 - Wetland uptake from dry semi-natural and natural land cover types</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>SEGMENT_ID</ns3:PropertyName>
              <ns3:Literal>9123</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#bf63ed</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#bf63ed</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF913 - Extension of water courses (natural erosion and artificial works)</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF913 - Extension of water courses (natural erosion and artificial works)</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>SEGMENT_ID</ns3:PropertyName>
              <ns3:Literal>913</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#a75df0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#a75df0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF99 - Other changes and unknown</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF99 - Other changes and unknown</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>SEGMENT_ID</ns3:PropertyName>
              <ns3:Literal>99</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#300082</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#300082</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
      </ns2:FeatureTypeStyle>
    </ns0:UserStyle>
  </ns0:NamedLayer>
</ns0:StyledLayerDescriptor>