<ns0:StyledLayerDescriptor xmlns:ns0="http://www.opengis.net/sld" xmlns:ns2="http://www.opengis.net/se" xmlns:ns3="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" units="mm" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd">
  <ns0:NamedLayer>
    <ns2:Name>1975_LULC</ns2:Name>
    <ns0:UserStyle>
      <ns2:Name>1975_LULC</ns2:Name>
      <ns2:FeatureTypeStyle>
        <ns2:Rule>
          <ns2:Name>CLC 1: Artificial surfaces</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 1: Artificial surfaces</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>1</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#e600a9</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#e600a9</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 11: Urban fabric</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 11: Urban fabric</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>11</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#960024</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#960024</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 111: Continuous urban fabrics</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 111: Continuous urban fabrics</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>111</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#e6004d</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#e6004d</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 112: Discontinuous urban fabric</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 112: Discontinuous urban fabric</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
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
          <ns2:Name>CLC 12: Industrial, commercial and transport units</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 12: Industrial, commercial and transport units</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>12</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#e8beff</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#e8beff</ns2:SvgParameter>
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
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
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
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
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
          <ns2:Name>CLC 123: Port areas</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 123: Port areas</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>123</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#e6cccc</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#e6cccc</ns2:SvgParameter>
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
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
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
          <ns2:Name>CLC 13: Mine, dump and construction sites</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 13: Mine, dump and construction sites</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>13</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#a900e6</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#a900e6</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 131: Mineral extraction sites</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 131: Mineral extraction sites</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>131</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#a600cc</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#a600cc</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 1311: Excavations; gravel/brick/clay pits; borrow pits, mining pools</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 1311: Excavations; gravel/brick/clay pits; borrow pits, mining pools</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>1311</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#704489</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#704489</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 132: Dump sites</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 132: Dump sites</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>132</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#a64d00</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#a64d00</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 133: Construction sites</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 133: Construction sites</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>133</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ff4dff</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ff4dff</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 14: Artificial non-agricultural vegetated areas&#160;</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 14: Artificial non-agricultural vegetated areas&#160;</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>14</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ff73df</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ff73df</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 141: Green urban areas</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 141: Green urban areas</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>141</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ffa6ff</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ffa6ff</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 142: Sport and leisure facilities</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 142: Sport and leisure facilities</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>142</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ffe6ff</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ffe6ff</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 2: Agricultural areas</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 2: Agricultural areas</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>2</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ffffd2</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ffffd2</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 21: Arable land</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 21: Arable land</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>21</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ffff73</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ffff73</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 211: Non-irrigated arable land </ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 211: Non-irrigated arable land </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>211</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ffffa8</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ffffa8</ns2:SvgParameter>
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
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
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
          <ns2:Name>CLC 213: Rice fields</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 213: Rice fields</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>213</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#e6e600</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#e6e600</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 22: Permanent crops</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 22: Permanent crops</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>22</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#eb5500</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#eb5500</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 221: Vineyards</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 221: Vineyards</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>221</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#e68000</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#e68000</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 222: Fruit trees and berry plantations</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 222: Fruit trees and berry plantations</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>222</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#f2a64d</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#f2a64d</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 223: Olive groves</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 223: Olive groves</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>223</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#e6a600</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#e6a600</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 23: Pastures</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 23: Pastures</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>23</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#a8a800</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#a8a800</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 231: Pastures</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 231: Pastures</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>231</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#e6e64d</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#e6e64d</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 2313: Wet pastures</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 2313: Wet pastures</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>2313</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#8b890c</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#8b890c</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 24: Heterogeneous agricultural areas</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 24: Heterogeneous agricultural areas</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>24</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ffd37f</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ffd37f</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 241: Annual crops associated with permanent crops</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 241: Annual crops associated with permanent crops</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>241</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ffe6a6</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ffe6a6</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 242: Complex cultivation</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 242: Complex cultivation</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>242</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ffe64d</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ffe64d</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 243: Land principally occupied by agriculture, with significant areas of natural vegetation</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 243: Land principally occupied by agriculture, with significant areas of natural vegetation</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>243</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#e6cc4d</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#e6cc4d</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 244: Agro-forestry areas</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 244: Agro-forestry areas</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>244</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#f2cca6</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#f2cca6</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 3: Forests and semi-natural areas</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 3: Forests and semi-natural areas</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>3</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#00a884</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#00a884</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 31: Forests</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 31: Forests</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>31</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#70a800</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#70a800</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 311: Broad-leaved forest</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 311: Broad-leaved forest</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>311</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#80ff00</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#80ff00</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 3112: Wet forests including riparian</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 3112: Wet forests including riparian</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>3112</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#81d04c</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#81d04c</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 312: Coniferous forest</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 312: Coniferous forest</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>312</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#00a600</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#00a600</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 313: Mixed forest</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 313: Mixed forest</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>313</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#4dff00</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#4dff00</ns2:SvgParameter>
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
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
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
          <ns2:Name>CLC 321: Natural grassland</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 321: Natural grassland</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>321</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ccf24d</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ccf24d</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 322: Moors and heathland</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 322: Moors and heathland</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>322</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#a6ff80</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#a6ff80</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 323: Sclerophyllous vegetation</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 323: Sclerophyllous vegetation</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>323</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#a6e64d</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#a6e64d</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 324: Transitional woodland shrub</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 324: Transitional woodland shrub</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>324</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#a6f200</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#a6f200</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 3241: Shrub-dominated wetlands; shrub swamps, shrub-dominated freshwater marshes, shrub carr, alder thicket on inorganic soils</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 3241: Shrub-dominated wetlands; shrub swamps, shrub-dominated freshwater marshes, shrub carr, alder thicket on inorganic soils</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>3241</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#c7d79e</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#c7d79e</ns2:SvgParameter>
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
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
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
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
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
          <ns2:Name>CLC 3311: Sand, shingle or pebble shores; includes sand bars, spits and sandy islets; includes dune systems and humid dune slacks</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 3311: Sand, shingle or pebble shores; includes sand bars, spits and sandy islets; includes dune systems and humid dune slacks</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>3311</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#d7d7d7</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#d7d7d7</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 332: Bare rock</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 332: Bare rock</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>332</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#cccccc</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#cccccc</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 3321: Rocky marine shores; includes rocky offshore islands, sea cliffs</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 3321: Rocky marine shores; includes rocky offshore islands, sea cliffs</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>3321</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#bebebe</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#bebebe</ns2:SvgParameter>
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
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
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
          <ns2:Name>CLC 334: Burnt areas</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 334: Burnt areas</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>334</ns3:Literal>
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
          <ns2:Name>CLC 335: Glaciers and perpetual snow</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 335: Glaciers and perpetual snow</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>335</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#a6e6cc</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#a6e6cc</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 4: Wetlands</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 4: Wetlands</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>4</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#00a9e6</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#00a9e6</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 41: Inland wetlands</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 41: Inland wetlands</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>41</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#7a8ef5</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#7a8ef5</ns2:SvgParameter>
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
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
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
          <ns2:Name>CLC 4111: Reedbeds and high helophytes</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 4111: Reedbeds and high helophytes</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>4111</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#586afd</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#586afd</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 4114: Permanent saline/brackish/alkaline marshes/pools</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 4114: Permanent saline/brackish/alkaline marshes/pools</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>4114</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#0003af</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#0003af</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 4115: Seasonal/intermittent saline/brackish/alkaline marshes/pools</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 4115: Seasonal/intermittent saline/brackish/alkaline marshes/pools</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>4115</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#5767f8</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#5767f8</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 4116: Permanent freshwater marshes/pools; ponds (below 8 ha), marshes and swamps on inorganic soils; with emergent vegetation water-logged for at least most of the growing season</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 4116: Permanent freshwater marshes/pools; ponds (below 8 ha), marshes and swamps on inorganic soils; with emergent vegetation water-logged for at least most of the growing season</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>4116</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#0004e4</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#0004e4</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 4117: Seasonal/intermittent freshwater marshes/pools on inorganic soils; includes sloughs, potholes, seasonally flooded meadows, sedge marshes</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 4117: Seasonal/intermittent freshwater marshes/pools on inorganic soils; includes sloughs, potholes, seasonally flooded meadows, sedge marshes</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>4117</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#0074f0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#0074f0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 4118: Tundra wetlands; includes tundra pools, temporary waters from snowmelt</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 4118: Tundra wetlands; includes tundra pools, temporary waters from snowmelt</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>4118</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#0005fe</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#0005fe</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 4119: Freshwater springs</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 4119: Freshwater springs</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>4119</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#614af5</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#614af5</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 412: Peatbogs</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 412: Peatbogs</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>412</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#4d4dff</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#4d4dff</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 4121: Raised bogs</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 4121: Raised bogs</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>4121</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#4d4ffd</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#4d4ffd</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 4122: Blanket bogs</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 4122: Blanket bogs</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>4122</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#884dfd</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#884dfd</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 4123: Forested peatlands; peatswamp forests</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 4123: Forested peatlands; peatswamp forests</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>4123</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#5d35ae</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#5d35ae</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 42: Coastal wetlands</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 42: Coastal wetlands</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>42</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#d69dbc</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#d69dbc</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 421: Salt marshes</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 421: Salt marshes</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>421</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ccccff</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ccccff</ns2:SvgParameter>
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
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
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
          <ns2:Name>CLC 423: Intertidal flats</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 423: Intertidal flats</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>423</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#a6a6e6</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#a6a6e6</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 4231: Intertidal mud, sand or salt flats</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 4231: Intertidal mud, sand or salt flats</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>4231</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#a4a5e4</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#a4a5e4</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 4232: Intertidal forested wetlands; includes mangrove swamps, nipah swamps and tidal freshwater swamp forests </ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 4232: Intertidal forested wetlands; includes mangrove swamps, nipah swamps and tidal freshwater swamp forests </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>4232</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#c9c9e4</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#c9c9e4</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 5: Water bodies</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 5: Water bodies</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>5</ns3:Literal>
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
          <ns2:Name>CLC 51: Inland waters</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 51: Inland waters</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>51</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#0070ff</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#0070ff</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 511: Inland water courses</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 511: Inland water courses</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>511</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#00ccf2</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#00ccf2</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 5111: Permanent inland deltas</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 5111: Permanent inland deltas</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>5111</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#00d4f0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#00d4f0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 5112: Permanent rivers/streams/creeks; includes waterfalls</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 5112: Permanent rivers/streams/creeks; includes waterfalls</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>5112</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#86f7fd</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#86f7fd</ns2:SvgParameter>
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
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
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
          <ns2:Name>CLC 5114: Canals and drainage channels, ditches</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 5114: Canals and drainage channels, ditches</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>5114</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#0004e9</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#0004e9</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 512: Inland water bodies</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 512: Inland water bodies</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>512</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#80f2e6</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#80f2e6</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 5121: Permanent freshwater lakes (over 8 ha); includes large oxbow lakes</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 5121: Permanent freshwater lakes (over 8 ha); includes large oxbow lakes</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>5121</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#72e6aa</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#72e6aa</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 5122: Seasonal/intermittent freshwater lakes (over 8 ha); includes floodplain lakes</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 5122: Seasonal/intermittent freshwater lakes (over 8 ha); includes floodplain lakes</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>5122</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#8efef9</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#8efef9</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 5123: Permanent saline/brackish/alkaline lakes</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 5123: Permanent saline/brackish/alkaline lakes</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>5123</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#79caf3</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#79caf3</ns2:SvgParameter>
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
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
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
        <ns2:Rule>
          <ns2:Name>CLC 5125: Permanent freshwater lakes (over 8 ha) with aquatic bed vegetation; includes large oxbow lakes with aquatic bed vegetation</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 5125: Permanent freshwater lakes (over 8 ha) with aquatic bed vegetation; includes large oxbow lakes with aquatic bed vegetation</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>5125</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#9cd6db</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#9cd6db</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 5126: Seasonal/intermittent freshwater lakes (over 8 ha) with aquatic bed vegetation; includes floodplain lakes with aquatic bed vegetation</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 5126: Seasonal/intermittent freshwater lakes (over 8 ha) with aquatic bed vegetation; includes floodplain lakes with aquatic bed vegetation</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>5126</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#4b9c91</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#4b9c91</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 5127: Permanent saline/brackish/alkaline lakes with aquatic bed vegetation</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 5127: Permanent saline/brackish/alkaline lakes with aquatic bed vegetation</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>5127</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#1c96ad</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#1c96ad</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 5128: Seasonal/intermittent saline/brackish/alkaline lakes and flats with aquatic bed vegetation</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 5128: Seasonal/intermittent saline/brackish/alkaline lakes and flats with aquatic bed vegetation</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>5128</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#1c638a</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#1c638a</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 5129: Aquaculture (e.g., fish/shrimp) ponds</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 5129: Aquaculture (e.g., fish/shrimp) ponds</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>5129</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#0065c7</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#0065c7</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 5130: Ponds; includes farm ponds, stock ponds, small tanks; (generally below 8 ha)</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 5130: Ponds; includes farm ponds, stock ponds, small tanks; (generally below 8 ha)</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>5130</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#277faa</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#277faa</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 5131: Water storage areas; reservoirs/barrages/dams/impoundments (generally over 8 ha)</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 5131: Water storage areas; reservoirs/barrages/dams/impoundments (generally over 8 ha)</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>5131</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#0000cb</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#0000cb</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 5132: Wastewater treatment areas; sewage farms, settling ponds, oxidation basins, etc</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 5132: Wastewater treatment areas; sewage farms, settling ponds, oxidation basins, etc</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>5132</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#002790</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#002790</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 52: Marine waters</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 52: Marine waters</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>52</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#7af5ca</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#7af5ca</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 521: Coastal lagoons</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 521: Coastal lagoons</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>521</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#00ffa6</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#00ffa6</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 5211: Coastal brackish/saline lagoons; brackish to saline lagoons with at least one relatively narrow connection to the sea</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 5211: Coastal brackish/saline lagoons; brackish to saline lagoons with at least one relatively narrow connection to the sea</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>5211</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#00fea5</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#00fea5</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 5212: Coastal freshwater lagoons; includes freshwater delta lagoons</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 5212: Coastal freshwater lagoons; includes freshwater delta lagoons</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>5212</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#00da74</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#00da74</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 522: Estuaries</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 522: Estuaries</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>522</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#a6ffe6</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#a6ffe6</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 523: Sea and ocean</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 523: Sea and ocean</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>523</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#e6f2ff</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#e6f2ff</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 5231: Permanent shallow marine waters in most cases less than six metres deep at low tide; includes sea bays and straits</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 5231: Permanent shallow marine waters in most cases less than six metres deep at low tide; includes sea bays and straits</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>5231</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#e5f1fe</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#e5f1fe</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 5232: Marine subtidal aquatic beds; includes kelp beds, sea-grass beds, tropical marine meadows</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 5232: Marine subtidal aquatic beds; includes kelp beds, sea-grass beds, tropical marine meadows</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>5232</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#c7f9e4</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#c7f9e4</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
        <ns2:Rule>
          <ns2:Name>CLC 5233: Coral reefs</ns2:Name>
          <ns2:Description>
            <ns2:Title>CLC 5233: Coral reefs</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>CLC_L2</ns3:PropertyName>
              <ns3:Literal>5233</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#f1e7da</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#f1e7da</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule>
      </ns2:FeatureTypeStyle>
    </ns0:UserStyle>
  </ns0:NamedLayer>
</ns0:StyledLayerDescriptor>