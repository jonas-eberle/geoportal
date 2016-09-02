<ns0:StyledLayerDescriptor xmlns:ns0="http://www.opengis.net/sld" xmlns:ns2="http://www.opengis.net/se" xmlns:ns3="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" units="mm" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd">
  <ns0:NamedLayer>
    <ns2:Name>1975_1990_LULCC</ns2:Name>
    <ns0:UserStyle>
      <ns2:Name>1975_1990_LULCC</ns2:Name>
      <ns2:FeatureTypeStyle>
        <ns2:Rule>
          <ns2:Name>LCF1 - Urban land management</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF1 - Urban land management</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF1</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ffd9e8</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ffd9e8</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF11 - Urban development/infilling</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF11 - Urban development/infilling</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF11</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ffccff</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ffccff</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF12 - Recycling of developed urban land</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF12 - Recycling of developed urban land</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF12</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#f08db1</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#f08db1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF13 - Development of green urban areas</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF13 - Development of green urban areas</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF13</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#de5489</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#de5489</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF131 - Extension of green urban areas over wetlands and waters </ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF131 - Extension of green urban areas over wetlands and waters </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF131</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#c70063</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#c70063</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF2 - Urban residential sprawl</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF2 - Urban residential sprawl</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF2</ns3:Literal>
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
          <ns2:Name>LCF21 - Urban dense residential sprawl</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF21 - Urban dense residential sprawl</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF21</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#db6945</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#db6945</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF211 - Urban dense resiential sprawl against wetlands and waters</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF211 - Urban dense resiential sprawl against wetlands and waters</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF211</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#d65445</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#d65445</ns2:SvgParameter>
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
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF22</ns3:Literal>
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
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF221</ns3:Literal>
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
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF3</ns3:Literal>
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
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF31</ns3:Literal>
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
          <ns2:Name>LCF311 - Sprawl of industrial and commercial sites over wetlands and waters</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF311 - Sprawl of industrial and commercial sites over wetlands and waters</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF311</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#c8c8c8</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#c8c8c8</ns2:SvgParameter>
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
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF32</ns3:Literal>
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
          <ns2:Name>LCF321 - Sprawl of transport networks over wetlands and waters</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF321 - Sprawl of transport networks over wetlands and waters</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF321</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#6e6e6e</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#6e6e6e</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF33 - Sprawl of harbours</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF33 - Sprawl of harbours</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF33</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#3c3c3c</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#3c3c3c</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF331 - Sprawl of harbours over wetlands and waters</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF331 - Sprawl of harbours over wetlands and waters</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF331</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#1e1e1e</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#1e1e1e</ns2:SvgParameter>
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
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF34</ns3:Literal>
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
          <ns2:Name>LCF341 - Sprawl of airports over wetlands and waters </ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF341 - Sprawl of airports over wetlands and waters </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF341</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#000050</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#000050</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF35 - Sprawl of mines and quarrying areas</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF35 - Sprawl of mines and quarrying areas</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF35</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#758f94</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#758f94</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF351 - Sprawl of mines and quarrying areas over wetlands and waters</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF351 - Sprawl of mines and quarrying areas over wetlands and waters</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF351</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#3d8f8f</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#3d8f8f</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF36 - Sprawl of dump sites: Non-urban land uptake by waste dump sites </ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF36 - Sprawl of dump sites: Non-urban land uptake by waste dump sites </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF36</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#007582</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#007582</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF361 - Sprawl of dump sites over wetlands and waters</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF361 - Sprawl of dump sites over wetlands and waters</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF361</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#004c73</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#004c73</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF37 - Extension over non-urban land of areas under construction</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF37 - Extension over non-urban land of areas under construction</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF37</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#446589</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#446589</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF371 - Extension over  wetlands and waters of areas under construction</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF371 - Extension over  wetlands and waters of areas under construction</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF371</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#444f89</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#444f89</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF38  - Sprawl of sport and leisure facilities</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF38  - Sprawl of sport and leisure facilities</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF38</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#004da8</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#004da8</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF381 - Sprawl of sport and leisure facilities over wetlands and waters</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF381 - Sprawl of sport and leisure facilities over wetlands and waters</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF381</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#002673</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#002673</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF4 - Agriculture internal conversions </ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF4 - Agriculture internal conversions </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF4</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ffffe6</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ffffe6</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF41 - Extension of set aside fallow land and pasture</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF41 - Extension of set aside fallow land and pasture</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF41</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ffffbe</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ffffbe</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF411 - Uniform extension of set aside fallow land and pasture</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF411 - Uniform extension of set aside fallow land and pasture</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF411</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ffff82</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ffff82</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF412 - Diffuse extension of set aside fallow land and pasture</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF412 - Diffuse extension of set aside fallow land and pasture</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF412</ns3:Literal>
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
          <ns2:Name>LCF42 - Internal conversions between annual crops</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF42 - Internal conversions between annual crops</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF42</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#f0f550</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#f0f550</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF421 - Conversion from arable land to permanent irrigation perimeters</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF421 - Conversion from arable land to permanent irrigation perimeters</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF421</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#fae600</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#fae600</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF422 - Other internal conversions of arable land</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF422 - Other internal conversions of arable land</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF422</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#fad200</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#fad200</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF43 - Internal conversions between permanent crops</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF43 - Internal conversions between permanent crops</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF43</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#fab400</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#fab400</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF431 - Conversion from olives groves to vineyards and orchards</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF431 - Conversion from olives groves to vineyards and orchards</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF431</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ffa200</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ffa200</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF432 - Conversion from vineyards and orchards to olive groves</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF432 - Conversion from vineyards and orchards to olive groves</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF432</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ff8c00</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ff8c00</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF433 - Other conversions between vineyards and orchards</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF433 - Other conversions between vineyards and orchards</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF433</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#fade9d</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#fade9d</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF44 - Conversion from permanent crops to arable land</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF44 - Conversion from permanent crops to arable land</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF44</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#fce468</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#fce468</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF441 - Conversion from permanent crops to permanent irrigation perimeters</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF441 - Conversion from permanent crops to permanent irrigation perimeters</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF441</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#facd50</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#facd50</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF442 - Conversion from vineyards and orchards to non-irrigated arable land</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF442 - Conversion from vineyards and orchards to non-irrigated arable land</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF442</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ebbd50</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ebbd50</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF443 - Conversion from olive groves to non-irrigated arable land</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF443 - Conversion from olive groves to non-irrigated arable land</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF443</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#dba650</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#dba650</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF444 - Diffuse conversion from permanent crops to arable land</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF444 - Diffuse conversion from permanent crops to arable land</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF444</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#d19969</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#d19969</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF45 - Conversion from arable land to permanent crops</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF45 - Conversion from arable land to permanent crops</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF45</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#e09026</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#e09026</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF451 - Conversion from arable land to vineyards and orchards</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF451 - Conversion from arable land to vineyards and orchards</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF451</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ad732b</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ad732b</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF452 - Conversion from arable land to olive groves</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF452 - Conversion from arable land to olive groves</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF452</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ad542b</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ad542b</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF453 - Diffuse conversion from arable land to permanent crops</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF453 - Diffuse conversion from arable land to permanent crops</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF453</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#895a44</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#895a44</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF46 - Conversion from pasture to arable and permanent crops</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF46 - Conversion from pasture to arable and permanent crops</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF46</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#b55e18</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#b55e18</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF461 - Conversion from pasture to permanent irrigation perimeters</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF461 - Conversion from pasture to permanent irrigation perimeters</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF461</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#894444</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#894444</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF462 - Intensive conversion from pasture to non-irrigated arable land and permanent crops</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF462 - Intensive conversion from pasture to non-irrigated arable land and permanent crops</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF462</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#91330a</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#91330a</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF463 - Diffuse conversion from pasture to arable and permanent crops</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF463 - Diffuse conversion from pasture to arable and permanent crops</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF463</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#614c00</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#614c00</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF47 - Extension of agro-forestry</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF47 - Extension of agro-forestry</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF47</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#6b0000</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#6b0000</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF48 - Other conversions from agriculture mosaics to arable land and permanent crops</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF48 - Other conversions from agriculture mosaics to arable land and permanent crops</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF48</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#634244</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#634244</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF481 - Other conversions from agriculture mosaics to permanent crops</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF481 - Other conversions from agriculture mosaics to permanent crops</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF481</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#464033</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#464033</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF482 - Other conversions from agriculture mosaics to arable land </ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF482 - Other conversions from agriculture mosaics to arable land </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF482</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#2b2b1f</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#2b2b1f</ns2:SvgParameter>
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
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF5</ns3:Literal>
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
          <ns2:Name>LCF51 - Conversion from forest to agriculture</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF51 - Conversion from forest to agriculture</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF51</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#d2f241</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#d2f241</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF511 - Intensive conversion from forest to agriculture</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF511 - Intensive conversion from forest to agriculture</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF511</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#c4d90e</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#c4d90e</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF512 - Diffuse conversion from forest to agriculture</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF512 - Diffuse conversion from forest to agriculture</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF512</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#94c900</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#94c900</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF52 - Conversion from semi-natural land to agriculture</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF52 - Conversion from semi-natural land to agriculture</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF52</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#94e300</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#94e300</ns2:SvgParameter>
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
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF521</ns3:Literal>
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
          <ns2:Name>LCF522 - Diffuse conversion from semi-natural land to agriculture</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF522 - Diffuse conversion from semi-natural land to agriculture</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF522</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#2c9645</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#2c9645</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF523 - Conversions from agriculture-nature mosaics to continuous agriculture</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF523 - Conversions from agriculture-nature mosaics to continuous agriculture</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF523</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#0a6948</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#0a6948</ns2:SvgParameter>
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
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF53</ns3:Literal>
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
          <ns2:Name>LCF54 - Conversion from developed areas to agriculture</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF54 - Conversion from developed areas to agriculture</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF54</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#113024</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#113024</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF6 - Withdrawal of farming</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF6 - Withdrawal of farming</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF6</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#cbf5ea</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#cbf5ea</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF61 - Withdrawal of farming with woodland creation</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF61 - Withdrawal of farming with woodland creation</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF61</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#99e8ca</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#99e8ca</ns2:SvgParameter>
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
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF62</ns3:Literal>
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
          <ns2:Name>LCF63 - Withdrawal of farming in favour of wetlands and waters </ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF63 - Withdrawal of farming in favour of wetlands and waters </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF63</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#30b092</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#30b092</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF7 - Forests creation and management</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF7 - Forests creation and management</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF7</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#d7f0af</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#d7f0af</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF71 - Conversion from transitional woodland to forest</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF71 - Conversion from transitional woodland to forest</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF71</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#bfccb8</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#bfccb8</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF72 - Forest creation, afforestation</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF72 - Forest creation, afforestation</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF72</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#acbf7e</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#acbf7e</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF721 - Forest creation and afforestation take place on all previously wetlands and waters </ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF721 - Forest creation and afforestation take place on all previously wetlands and waters </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF721</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#829151</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#829151</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF73 - Forests internal conversions</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF73 - Forests internal conversions</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF73</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#827f51</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#827f51</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF74 - Recent felling and transition</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF74 - Recent felling and transition</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF74</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#606b2d</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#606b2d</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF8 - Water bodies creation and management</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF8 - Water bodies creation and management</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF8</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#00c5ff</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#00c5ff</ns2:SvgParameter>
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
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF81</ns3:Literal>
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
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF82</ns3:Literal>
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
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF9</ns3:Literal>
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
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF91</ns3:Literal>
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
          <ns2:Name>LCF911 - Semi-natural creation</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF911 - Semi-natural creation</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF911</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ca91eb</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ca91eb</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF9111 - Wetland creation in land previously used by human activities</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF9111 - Wetland creation in land previously used by human activities</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF9111</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ca87eb</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ca87eb</ns2:SvgParameter>
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
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF912</ns3:Literal>
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
          <ns2:Name>LCF9121 - Wetland and waters rotation</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF9121 - Wetland and waters rotation</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF9121</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#be75cc</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#be75cc</ns2:SvgParameter>
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
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF9122</ns3:Literal>
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
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF9123</ns3:Literal>
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
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF913</ns3:Literal>
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
          <ns2:Name>LCF92 - Forests and shrubs fires</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF92 - Forests and shrubs fires</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF92</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#8c3af0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#8c3af0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF92 - Forests and shrubs fires</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF92 - Forests and shrubs fires</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF93</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#700cf0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#700cf0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>LCF94 - Decrease in permanent snow and glaciers cover (due to climate change)LCF94</ns2:Name>
          <ns2:Description>
            <ns2:Title>LCF94 - Decrease in permanent snow and glaciers cover (due to climate change)LCF94</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF94</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#5c00bf</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#5c00bf</ns2:SvgParameter>
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
              <ns3:PropertyName>ChangeCode</ns3:PropertyName>
              <ns3:Literal>LCF99</ns3:Literal>
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