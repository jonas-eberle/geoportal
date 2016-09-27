<ns0:StyledLayerDescriptor xmlns:ns0="http://www.opengis.net/sld" xmlns:ns2="http://www.opengis.net/se" xmlns:ns3="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd">
                  <ns0:NamedLayer>
                    <ns2:Name>NAME</ns2:Name>
                    <ns0:UserStyle>
                      <ns2:Name>NAME</ns2:Name>
                      <ns2:FeatureTypeStyle>
                      <ns2:Rule>
          <ns2:Name>1 Urban</ns2:Name>
          <ns2:Description>
            <ns2:Title>1 Urban</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L1</ns3:PropertyName>
              <ns3:Literal>1</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ff4242</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ff4242</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>11 Urban Fabric etc.</ns2:Name>
          <ns2:Description>
            <ns2:Title>11 Urban Fabric etc.</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L2</ns3:PropertyName>
              <ns3:Literal>11</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#be00</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#be00</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>111 Dense to medium dense urban</ns2:Name>
          <ns2:Description>
            <ns2:Title>111 Dense to medium dense urban</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>111</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#be00</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#be00</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>1111 Continuous urban fabric</ns2:Name>
          <ns2:Description>
            <ns2:Title>1111 Continuous urban fabric</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>1111</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#e604d</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#e604d</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>1112 Dense urban fabric </ns2:Name>
          <ns2:Description>
            <ns2:Title>1112 Dense urban fabric </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>1112</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#be00</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#be00</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>1113 Indust. or comerc. Units</ns2:Name>
          <ns2:Description>
            <ns2:Title>1113 Indust. or comerc. Units</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>1113</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ff00</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ff00</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>112 Low density Urban Fabric</ns2:Name>
          <ns2:Description>
            <ns2:Title>112 Low density Urban Fabric</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>112</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ff7f7f</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ff7f7f</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>12 Transport</ns2:Name>
          <ns2:Description>
            <ns2:Title>12 Transport</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L2</ns3:PropertyName>
              <ns3:Literal>12</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>121 Transport</ns2:Name>
          <ns2:Description>
            <ns2:Title>121 Transport</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>121</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>1211 Road and ass. land</ns2:Name>
          <ns2:Description>
            <ns2:Title>1211 Road and ass. land</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>1211</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>1212 Rails and ass. land</ns2:Name>
          <ns2:Description>
            <ns2:Title>1212 Rails and ass. land</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>1212</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#5a5a5a</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#5a5a5a</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>1213 Port areas</ns2:Name>
          <ns2:Description>
            <ns2:Title>1213 Port areas</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>1213</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>1214 Airports</ns2:Name>
          <ns2:Description>
            <ns2:Title>1214 Airports</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>1214</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>13 Mineral extraction etc.</ns2:Name>
          <ns2:Description>
            <ns2:Title>13 Mineral extraction etc.</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L2</ns3:PropertyName>
              <ns3:Literal>13</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#724e3a</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#724e3a</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>131 Min. extract., dump, constr. sites</ns2:Name>
          <ns2:Description>
            <ns2:Title>131 Min. extract., dump, constr. sites</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>131</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#724e3a</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#724e3a</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>132 Land without current use</ns2:Name>
          <ns2:Description>
            <ns2:Title>132 Land without current use</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>132</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#874646</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#874646</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>14 Green urban + sports + leisure </ns2:Name>
          <ns2:Description>
            <ns2:Title>14 Green urban + sports + leisure </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L2</ns3:PropertyName>
              <ns3:Literal>14</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#8cdc0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#8cdc0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>141 Green urban areas</ns2:Name>
          <ns2:Description>
            <ns2:Title>141 Green urban areas</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>142 Sports + leisure facilities</ns2:Name>
          <ns2:Description>
            <ns2:Title>142 Sports + leisure facilities</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>2 Croplands</ns2:Name>
          <ns2:Description>
            <ns2:Title>2 Croplands</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L1</ns3:PropertyName>
              <ns3:Literal>2</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>21 Arable land</ns2:Name>
          <ns2:Description>
            <ns2:Title>21 Arable land</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L2</ns3:PropertyName>
              <ns3:Literal>21</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>211 Non-irrig. arable land</ns2:Name>
          <ns2:Description>
            <ns2:Title>211 Non-irrig. arable land</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>212 Greenhouses</ns2:Name>
          <ns2:Description>
            <ns2:Title>212 Greenhouses</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>212</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#bebe64</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#bebe64</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>213 Irrig. arable land and rice</ns2:Name>
          <ns2:Description>
            <ns2:Title>213 Irrig. arable land and rice</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>213</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ffff0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ffff0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>213 Irrig. arable land and rice</ns2:Name>
          <ns2:Description>
            <ns2:Title>213 Irrig. arable land and rice</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>213</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#ffff0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#ffff0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>22 Permanent crops</ns2:Name>
          <ns2:Description>
            <ns2:Title>22 Permanent crops</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L2</ns3:PropertyName>
              <ns3:Literal>22</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#f2cb7f</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#f2cb7f</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>221 Vineyards</ns2:Name>
          <ns2:Description>
            <ns2:Title>221 Vineyards</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>221</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#e6800</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#e6800</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>222 Fruit trees and berry plant.</ns2:Name>
          <ns2:Description>
            <ns2:Title>222 Fruit trees and berry plant.</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>2221 High stem fruit trees</ns2:Name>
          <ns2:Description>
            <ns2:Title>2221 High stem fruit trees</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>2221</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#f2cb7f</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#f2cb7f</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>2222 Low stem fruit trees and berry plant.</ns2:Name>
          <ns2:Description>
            <ns2:Title>2222 Low stem fruit trees and berry plant.</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>2222</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>223 Olive groves</ns2:Name>
          <ns2:Description>
            <ns2:Title>223 Olive groves</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>223</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#e6a60</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#e6a60</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>23 Heterogeneous agricultural areas</ns2:Name>
          <ns2:Description>
            <ns2:Title>23 Heterogeneous agricultural areas</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L2</ns3:PropertyName>
              <ns3:Literal>23</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>231 Annual crops associat. with perman. crops</ns2:Name>
          <ns2:Description>
            <ns2:Title>231 Annual crops associat. with perman. crops</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>231</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>232 Complex cultivation patterns</ns2:Name>
          <ns2:Description>
            <ns2:Title>232 Complex cultivation patterns</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>232</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>233 Land occupied by agriculture + natural vegetation</ns2:Name>
          <ns2:Description>
            <ns2:Title>233 Land occupied by agriculture + natural vegetation</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>233</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>234 Agro-forestry T.C.D. greater than 30%</ns2:Name>
          <ns2:Description>
            <ns2:Title>234 Agro-forestry T.C.D. greater than 30%</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>234</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>235 Agro-forestry T.C.D. less than 30%</ns2:Name>
          <ns2:Description>
            <ns2:Title>235 Agro-forestry T.C.D. less than 30%</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>235</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>3 Woodland and Forests</ns2:Name>
          <ns2:Description>
            <ns2:Title>3 Woodland and Forests</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L1</ns3:PropertyName>
              <ns3:Literal>3</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#08b0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#08b0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>31 Broadleaved forest</ns2:Name>
          <ns2:Description>
            <ns2:Title>31 Broadleaved forest</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L2</ns3:PropertyName>
              <ns3:Literal>31</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#80ff0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#80ff0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>311 Broadleaved forest (T.C.D. greater than 80%)</ns2:Name>
          <ns2:Description>
            <ns2:Title>311 Broadleaved forest (T.C.D. greater than 80%)</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>311</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#81bd0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#81bd0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>311 Species associations </ns2:Name>
          <ns2:Description>
            <ns2:Title>311 Species associations </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>311</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#81bd0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#81bd0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>312 Broadleaved forest (T.C.D. 50 - 80%)</ns2:Name>
          <ns2:Description>
            <ns2:Title>312 Broadleaved forest (T.C.D. 50 - 80%)</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>312</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#81d10</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#81d10</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>312 Species associations </ns2:Name>
          <ns2:Description>
            <ns2:Title>312 Species associations </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>312</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#81d10</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#81d10</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>313 Broadleaved forest (T.C.D. 30 - 50%)</ns2:Name>
          <ns2:Description>
            <ns2:Title>313 Broadleaved forest (T.C.D. 30 - 50%)</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>313</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#81e50</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#81e50</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>313 Species associations </ns2:Name>
          <ns2:Description>
            <ns2:Title>313 Species associations </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>313</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#81e50</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#81e50</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>314 Broadleaved forest (T.C.D. 10 - 30%)</ns2:Name>
          <ns2:Description>
            <ns2:Title>314 Broadleaved forest (T.C.D. 10 - 30%)</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>314</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#80ff0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#80ff0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>314 Species associations </ns2:Name>
          <ns2:Description>
            <ns2:Title>314 Species associations </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>314</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#80ff0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#80ff0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>32 Coniferous forest</ns2:Name>
          <ns2:Description>
            <ns2:Title>32 Coniferous forest</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L2</ns3:PropertyName>
              <ns3:Literal>32</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#0a60</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#0a60</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>321 Coniferous forest (T.C.D. greater than 80%)</ns2:Name>
          <ns2:Description>
            <ns2:Title>321 Coniferous forest (T.C.D. greater than 80%)</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>321</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#0640</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#0640</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>321 Species associations </ns2:Name>
          <ns2:Description>
            <ns2:Title>321 Species associations </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>321</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#0640</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#0640</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>322 Coniferous forest (T.C.D. 50 - 80%)</ns2:Name>
          <ns2:Description>
            <ns2:Title>322 Coniferous forest (T.C.D. 50 - 80%)</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>322</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#0770</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#0770</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>322 Species associations </ns2:Name>
          <ns2:Description>
            <ns2:Title>322 Species associations </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>322</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#0770</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#0770</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>323 Coniferous forest (T.C.D. 30 - 50%)</ns2:Name>
          <ns2:Description>
            <ns2:Title>323 Coniferous forest (T.C.D. 30 - 50%)</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>323</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#08b0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#08b0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>323 Species associations </ns2:Name>
          <ns2:Description>
            <ns2:Title>323 Species associations </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>323</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#08b0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#08b0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>324 Coniferous forest (T.C.D. 10 - 30%)</ns2:Name>
          <ns2:Description>
            <ns2:Title>324 Coniferous forest (T.C.D. 10 - 30%)</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>324</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#0a60</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#0a60</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>324 Species associations </ns2:Name>
          <ns2:Description>
            <ns2:Title>324 Species associations </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>324</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#0a60</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#0a60</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>33 Mixed forest</ns2:Name>
          <ns2:Description>
            <ns2:Title>33 Mixed forest</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L2</ns3:PropertyName>
              <ns3:Literal>33</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#4dff0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#4dff0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>331 Mixed forest (T.C.D. greater than 80%)</ns2:Name>
          <ns2:Description>
            <ns2:Title>331 Mixed forest (T.C.D. greater than 80%)</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>331</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#439f0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#439f0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>331 Species associations </ns2:Name>
          <ns2:Description>
            <ns2:Title>331 Species associations </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>331</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#439f0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#439f0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>332 Mixed forest (T.C.D. 50 - 80%)</ns2:Name>
          <ns2:Description>
            <ns2:Title>332 Mixed forest (T.C.D. 50 - 80%)</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>332</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#43b30</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#43b30</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>332 Species associations </ns2:Name>
          <ns2:Description>
            <ns2:Title>332 Species associations </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>332</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#43b30</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#43b30</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>333 Mixed forest (T.C.D. 30 - 50%)</ns2:Name>
          <ns2:Description>
            <ns2:Title>333 Mixed forest (T.C.D. 30 - 50%)</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>333</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#43c70</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#43c70</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>332 Species associations </ns2:Name>
          <ns2:Description>
            <ns2:Title>332 Species associations </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>332</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#43c70</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#43c70</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>334 Mixed forest (T.C.D. 10 - 30%)</ns2:Name>
          <ns2:Description>
            <ns2:Title>334 Mixed forest (T.C.D. 10 - 30%)</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>334</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#4dff0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#4dff0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>334 Species associations </ns2:Name>
          <ns2:Description>
            <ns2:Title>334 Species associations </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>334</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#4dff0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#4dff0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>34 Transitional woodland scrub</ns2:Name>
          <ns2:Description>
            <ns2:Title>34 Transitional woodland scrub</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L2</ns3:PropertyName>
              <ns3:Literal>34</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#a6f20</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#a6f20</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>341 Transitional woodland scrub</ns2:Name>
          <ns2:Description>
            <ns2:Title>341 Transitional woodland scrub</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>341</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#a6f20</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#a6f20</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>35 Damaged forests</ns2:Name>
          <ns2:Description>
            <ns2:Title>35 Damaged forests</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L2</ns3:PropertyName>
              <ns3:Literal>35</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#03e0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#03e0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>351 Damaged forests</ns2:Name>
          <ns2:Description>
            <ns2:Title>351 Damaged forests</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>351</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#03e0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#03e0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>4 Grassland</ns2:Name>
          <ns2:Description>
            <ns2:Title>4 Grassland</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L1</ns3:PropertyName>
              <ns3:Literal>4</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>41 Managed grassland</ns2:Name>
          <ns2:Description>
            <ns2:Title>41 Managed grassland</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L2</ns3:PropertyName>
              <ns3:Literal>41</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>411 Managed grassland</ns2:Name>
          <ns2:Description>
            <ns2:Title>411 Managed grassland</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>411</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>4111 Manag. grasslands without trees+scrubs (T.C.D. less than 30%)</ns2:Name>
          <ns2:Description>
            <ns2:Title>4111 Manag. grasslands without trees+scrubs (T.C.D. less than 30%)</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>4111</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>4112 Manag. grasslands with trees+scrubs (T.C.D. greater than 30%)</ns2:Name>
          <ns2:Description>
            <ns2:Title>4112 Manag. grasslands with trees+scrubs (T.C.D. greater than 30%)</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>4112</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>42 Natural grasslands prevailingly without trees+scrubs</ns2:Name>
          <ns2:Description>
            <ns2:Title>42 Natural grasslands prevailingly without trees+scrubs</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L2</ns3:PropertyName>
              <ns3:Literal>42</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#dff24e</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#dff24e</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>421 Natural grasslands prevailingly without trees+scrubs (T.C.D. less  30%)</ns2:Name>
          <ns2:Description>
            <ns2:Title>421 Natural grasslands prevailingly without trees+scrubs (T.C.D. less  30%)</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>421</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#dff24e</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#dff24e</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>421 Species associations </ns2:Name>
          <ns2:Description>
            <ns2:Title>421 Species associations </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>421</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#dff24e</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#dff24e</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>422 Natural grasslands with trees+scrubs (T.C.D. greater than 30%)</ns2:Name>
          <ns2:Description>
            <ns2:Title>422 Natural grasslands with trees+scrubs (T.C.D. greater than 30%)</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>422</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>422 Species associations </ns2:Name>
          <ns2:Description>
            <ns2:Title>422 Species associations </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>422</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>5 Heathland and scrub</ns2:Name>
          <ns2:Description>
            <ns2:Title>5 Heathland and scrub</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L1</ns3:PropertyName>
              <ns3:Literal>5</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>51 Moors and heathland</ns2:Name>
          <ns2:Description>
            <ns2:Title>51 Moors and heathland</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L2</ns3:PropertyName>
              <ns3:Literal>51</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>511 Moors and heathland</ns2:Name>
          <ns2:Description>
            <ns2:Title>511 Moors and heathland</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>511</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>52 Sclerophyllous vegetation</ns2:Name>
          <ns2:Description>
            <ns2:Title>52 Sclerophyllous vegetation</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L2</ns3:PropertyName>
              <ns3:Literal>52</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>521 Sclerophyllous vegetation</ns2:Name>
          <ns2:Description>
            <ns2:Title>521 Sclerophyllous vegetation</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>521</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>6 Sparsely vegetated land</ns2:Name>
          <ns2:Description>
            <ns2:Title>6 Sparsely vegetated land</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L1</ns3:PropertyName>
              <ns3:Literal>6</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>61 Sparsely vegetated areas</ns2:Name>
          <ns2:Description>
            <ns2:Title>61 Sparsely vegetated areas</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L2</ns3:PropertyName>
              <ns3:Literal>61</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>611 Sparsely vegetated areas</ns2:Name>
          <ns2:Description>
            <ns2:Title>611 Sparsely vegetated areas</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>611</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>62 Bare soil, rock, perennial snow and ice</ns2:Name>
          <ns2:Description>
            <ns2:Title>62 Bare soil, rock, perennial snow and ice</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L2</ns3:PropertyName>
              <ns3:Literal>62</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>621 Beaches, dunes, sands</ns2:Name>
          <ns2:Description>
            <ns2:Title>621 Beaches, dunes, sands</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>621</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>6211 Beaches</ns2:Name>
          <ns2:Description>
            <ns2:Title>6211 Beaches</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>6211</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>6212 Dunes</ns2:Name>
          <ns2:Description>
            <ns2:Title>6212 Dunes</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>6212</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#cce5cc</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#cce5cc</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>6213 River banks</ns2:Name>
          <ns2:Description>
            <ns2:Title>6213 River banks</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>6213</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#bdd6bd</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#bdd6bd</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>622 Bare rocks, burnt areas, glaciers and perpetual snow</ns2:Name>
          <ns2:Description>
            <ns2:Title>622 Bare rocks, burnt areas, glaciers and perpetual snow</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>622</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#c7d1c7</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#c7d1c7</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>6221 Bare rocks</ns2:Name>
          <ns2:Description>
            <ns2:Title>6221 Bare rocks</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>6221</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>6222 Burnt areas</ns2:Name>
          <ns2:Description>
            <ns2:Title>6222 Burnt areas</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>6222</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#000</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#000</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>6223 Glaciers and perpetual snow</ns2:Name>
          <ns2:Description>
            <ns2:Title>6223 Glaciers and perpetual snow</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>6223</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>7 Wetlands</ns2:Name>
          <ns2:Description>
            <ns2:Title>7 Wetlands</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L1</ns3:PropertyName>
              <ns3:Literal>7</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>71 Inland marshes</ns2:Name>
          <ns2:Description>
            <ns2:Title>71 Inland marshes</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L2</ns3:PropertyName>
              <ns3:Literal>71</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>711 Inland freshwater marshes</ns2:Name>
          <ns2:Description>
            <ns2:Title>711 Inland freshwater marshes</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>711</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>711 Inland freshwater marshes</ns2:Name>
          <ns2:Description>
            <ns2:Title>711 Inland freshwater marshes</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>711</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>7111 Inland fresh marshes without reeds</ns2:Name>
          <ns2:Description>
            <ns2:Title>7111 Inland fresh marshes without reeds</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>7111</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>7112 Inland fresh marshes with reeds</ns2:Name>
          <ns2:Description>
            <ns2:Title>7112 Inland fresh marshes with reeds</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>7112</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#9595f0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#9595f0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>712 Inland saline marshes</ns2:Name>
          <ns2:Description>
            <ns2:Title>712 Inland saline marshes</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>712</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#8686c2</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#8686c2</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>712 Inland saline marshes</ns2:Name>
          <ns2:Description>
            <ns2:Title>712 Inland saline marshes</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>712</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#8686c2</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#8686c2</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>7121 Inland saline marshes without reeds</ns2:Name>
          <ns2:Description>
            <ns2:Title>7121 Inland saline marshes without reeds</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>7121</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#8686c2</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#8686c2</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>7122 Inland saline marshes with reeds</ns2:Name>
          <ns2:Description>
            <ns2:Title>7122 Inland saline marshes with reeds</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>7122</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#7777b3</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#7777b3</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>72 Peat bogs</ns2:Name>
          <ns2:Description>
            <ns2:Title>72 Peat bogs</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L2</ns3:PropertyName>
              <ns3:Literal>72</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>721 Peat bogs</ns2:Name>
          <ns2:Description>
            <ns2:Title>721 Peat bogs</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>721</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>721 Peat bogs</ns2:Name>
          <ns2:Description>
            <ns2:Title>721 Peat bogs</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>721</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>7211 Explored peat bog</ns2:Name>
          <ns2:Description>
            <ns2:Title>7211 Explored peat bog</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>7211</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>7212 Unexplored peat bogs</ns2:Name>
          <ns2:Description>
            <ns2:Title>7212 Unexplored peat bogs</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>7212</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#646ee5</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#646ee5</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>8 Lagoons, coastal wetl. and estuar.</ns2:Name>
          <ns2:Description>
            <ns2:Title>8 Lagoons, coastal wetl. and estuar.</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L1</ns3:PropertyName>
              <ns3:Literal>8</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#90c7f0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#90c7f0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>81 Maritime wetlands</ns2:Name>
          <ns2:Description>
            <ns2:Title>81 Maritime wetlands</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L2</ns3:PropertyName>
              <ns3:Literal>81</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#90c7f0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#90c7f0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>811 Salt marshes and salines</ns2:Name>
          <ns2:Description>
            <ns2:Title>811 Salt marshes and salines</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>811</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#90c7f0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#90c7f0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>8111 Salt marshes without reeds</ns2:Name>
          <ns2:Description>
            <ns2:Title>8111 Salt marshes without reeds</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>8111</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#90c7f0</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#90c7f0</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>8112 Salt marshes with reeds</ns2:Name>
          <ns2:Description>
            <ns2:Title>8112 Salt marshes with reeds</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>8112</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#81b3db</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#81b3db</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>8113 Salines</ns2:Name>
          <ns2:Description>
            <ns2:Title>8113 Salines</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>8113</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#649fc7</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#649fc7</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>812 Intertidal flats</ns2:Name>
          <ns2:Description>
            <ns2:Title>812 Intertidal flats</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>812</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>812 Intertidal flats</ns2:Name>
          <ns2:Description>
            <ns2:Title>812 Intertidal flats</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>812</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>83 Marine waters</ns2:Name>
          <ns2:Description>
            <ns2:Title>83 Marine waters</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L2</ns3:PropertyName>
              <ns3:Literal>83</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#0ffa6</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#0ffa6</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>83 Marine waters</ns2:Name>
          <ns2:Description>
            <ns2:Title>83 Marine waters</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L2</ns3:PropertyName>
              <ns3:Literal>83</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#0ffa6</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#0ffa6</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>831 Coastal lagoons</ns2:Name>
          <ns2:Description>
            <ns2:Title>831 Coastal lagoons</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>831</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#0ffa6</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#0ffa6</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>831 Coastal lagoons</ns2:Name>
          <ns2:Description>
            <ns2:Title>831 Coastal lagoons</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>831</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#0ffa6</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#0ffa6</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>832 Estuaries</ns2:Name>
          <ns2:Description>
            <ns2:Title>832 Estuaries</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>832</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>9 Rivers and Lakes</ns2:Name>
          <ns2:Description>
            <ns2:Title>9 Rivers and Lakes</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L1</ns3:PropertyName>
              <ns3:Literal>9</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#0ccf2</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#0ccf2</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>91 Water courses</ns2:Name>
          <ns2:Description>
            <ns2:Title>91 Water courses</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L2</ns3:PropertyName>
              <ns3:Literal>91</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#0ccf2</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#0ccf2</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>911 Interconnected running water courses</ns2:Name>
          <ns2:Description>
            <ns2:Title>911 Interconnected running water courses</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>911</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#0ccf2</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#0ccf2</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>912 Separated water bodies </ns2:Name>
          <ns2:Description>
            <ns2:Title>912 Separated water bodies </ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>912</ns3:Literal>
            </ns3:PropertyIsEqualTo>
          </ns3:Filter>
          <ns2:PolygonSymbolizer>
            <ns2:Fill>
              <ns2:SvgParameter name="fill">#43dbea</ns2:SvgParameter>
            </ns2:Fill>
            <ns2:Stroke>
              <ns2:SvgParameter name="stroke">#43dbea</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-width">1</ns2:SvgParameter>
              <ns2:SvgParameter name="stroke-linejoin">bevel</ns2:SvgParameter>
            </ns2:Stroke>
          </ns2:PolygonSymbolizer>
        </ns2:Rule><ns2:Rule>
          <ns2:Name>931 Lakes and reservoirs</ns2:Name>
          <ns2:Description>
            <ns2:Title>931 Lakes and reservoirs</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>931</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>9311 Natural water bodies</ns2:Name>
          <ns2:Description>
            <ns2:Title>9311 Natural water bodies</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>9311</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>9312 Artificial water bodies</ns2:Name>
          <ns2:Description>
            <ns2:Title>9312 Artificial water bodies</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>9312</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>10 Marine (other)</ns2:Name>
          <ns2:Description>
            <ns2:Title>10 Marine (other)</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L2</ns3:PropertyName>
              <ns3:Literal>10</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>101 Marine (other)</ns2:Name>
          <ns2:Description>
            <ns2:Title>101 Marine (other)</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L3</ns3:PropertyName>
              <ns3:Literal>101</ns3:Literal>
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
        </ns2:Rule><ns2:Rule>
          <ns2:Name>1011 Marine (other)</ns2:Name>
          <ns2:Description>
            <ns2:Title>1011 Marine (other)</ns2:Title>
          </ns2:Description>
          <ns3:Filter>
            <ns3:PropertyIsEqualTo>
              <ns3:PropertyName>MAES_L4</ns3:PropertyName>
              <ns3:Literal>1011</ns3:Literal>
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
        </ns2:Rule></ns2:FeatureTypeStyle>
                    </ns0:UserStyle>
                  </ns0:NamedLayer>
                </ns0:StyledLayerDescriptor>