(function () {
    'use strict';

    angular
        .module('webgisApp.legend')
        .constant('lulcLegend', {
            'CLC': [
                ['1', '1', '1 Artificial surfaces', 'rgb(230,0,169)'],
                ['11', '2', '1.1 Urban fabric', 'rgb(150,0,36)'],
                ['111', '3', '1.1.1 Continuous urban fabrics', 'rgb(230,0,77)'],
                ['112', '3', '1.1.2 Discontinuous urban fabric', 'rgb(255,0,0)'],
                ['12', '2', '1.2 Industrial, commercial and transport units', 'rgb(232,190,255)'],
                ['121', '3', '1.2.1 Industrial or commercial units', 'rgb(204,77,242)'],
                ['122', '3', '1.2.2 Road and rail networks and associated land', 'rgb(204,0,0)'],
                ['123', '3', '1.2.3 Port areas', 'rgb(230,204,204)'],
                ['124', '3', '1.2.4 Airports', 'rgb(230,204,230)'],
                ['13', '2', '1.3 Mine, dump and construction sites', 'rgb(169,0,230)'],
                ['131', '3', '1.3.1 Mineral extraction sites', 'rgb(166,0,204)'],
                ['1311', '4', '1.3.1.1 Excavations, gravel/brick/clay pits, borrow pits, mining pools', 'rgb(112,68,137)'],
                ['132', '3', '1.3.2 Dump sites', 'rgb(166,77,0)'],
                ['133', '3', '1.3.3 Construction sites', 'rgb(255,77,255)'],
                ['14', '2', '1.4 Artificial non-agricultural vegetated areasÂ ', 'rgb(255,115,223)'],
                ['141', '3', '1.4.1 Green urban areas', 'rgb(255,166,255)'],
                ['142', '3', '1.4.2 Sport and leisure facilities', 'rgb(255,230,255)'],
                ['2', '1', '2 Agricultural areas', 'rgb(255,255,210)'],
                ['21', '2', '2.1 Arable land', 'rgb(255,255,115)'],
                ['211', '3', '2.1.1 Non-irrigated arable land ', 'rgb(255,255,168)'],
                ['212', '3', '2.1.2 Permanently irrigated land', 'rgb(255,255,0)'],
                ['213', '3', '2.1.3 Rice fields', 'rgb(230,230,0)'],
                ['22', '2', '2.2 Permanent crops', 'rgb(255,85,0)'],
                ['221', '3', '2.2.1 Vineyards', 'rgb(230,128,0)'],
                ['222', '3', '2.2.2 Fruit trees and berry plantations', 'rgb(242,166,77)'],
                ['223', '3', '2.2.3 Olive groves', 'rgb(230,166,0)'],
                ['23', '2', '2.3 Pastures', 'rgb(168,168,0)'],
                ['231', '3', '2.3.1 Pastures', 'rgb(230,230,77)'],
                ['2313', '4', '2.3.1.3 Wet pastures', 'rgb(139,137,12)'],
                ['24', '2', '2.4 Heterogeneous agricultural areas', 'rgb(255,211,127)'],
                ['241', '3', '2.4.1 Annual crops associated with permanent crops', 'rgb(255,230,166)'],
                ['242', '3', '2.4.2 Complex cultivation', 'rgb(255,230,77)'],
                ['243', '3', '2.4.3 Land principally occupied by agriculture, with significant areas of natural vegetation', 'rgb(230,204,77)'],
                ['244', '3', '2.4.4 Agro-forestry areas', 'rgb(242,204,166)'],
                ['3', '1', '3 Forests and semi-natural areas', 'rgb(0,168,132)'],
                ['31', '2', '3.1 Forests', 'rgb(112,168,0)'],
                ['311', '3', '3.1.1 Broad-leaved forest', 'rgb(128,255,0)'],
                ['3112', '3', '3.1.1.2 Wet forests including riparian', 'rgb(129,208,76)'],
                ['312', '4', '3.1.2 Coniferous forest', 'rgb(0,166,0)'],
                ['313', '3', '3.1.3 Mixed forest', 'rgb(77,255,0)'],
                ['32', '2', '3.2 Shrub and/or herbaceous vegetation association', 'rgb(211,255,190)'],
                ['321', '3', '3.2.1 Natural grassland', 'rgb(204,242,77)'],
                ['322', '3', '3.2.2 Moors and heathland', 'rgb(166,255,128)'],
                ['323', '3', '3.2.3 Sclerophyllous vegetation', 'rgb(166,230,77)'],
                ['324', '3', '3.2.4 Transitional woodland shrub', 'rgb(166,242,0)'],
                ['3241', '3', '3.2.4.1 Shrub-dominated wetlands, shrub swamps, shrub-dominated freshwater marshes, shrub carr, alder thicket on inorganic soils', 'rgb(199,215,158)'],
                ['33', '2', '3.3 Open spaces with little or no vegetation', 'rgb(178,178,178)'],
                ['331', '3', '3.3.1 Beaches, dunes, and sand plains', 'rgb(230,230,230)'],
                ['3311', '4', '3.3.1.1 Sand, shingle or pebble shores, includes sand bars, spits and sandy islets, includes dune systems and humid dune slacks', 'rgb(215,215,215)'],
                ['332', '3', '3.3.2 Bare rock', 'rgb(204,204,204)'],
                ['3321', '4', '3.3.2.1 Rocky marine shores, includes rocky offshore islands, sea cliffs', 'rgb(190,190,190)'],
                ['333', '3', '3.3.3 Sparsely vegetated areas', 'rgb(204,255,204)'],
                ['334', '3', '3.3.4 Burnt areas', 'rgb(0,0,0)'],
                ['335', '3', '3.3.5 Glaciers and perpetual snow', 'rgb(166,230,204)'],
                ['4', '1', '4 Wetlands', 'rgb(0,169,230)'],
                ['41', '2', '4.1 Inland wetlands', 'rgb(122,142,245)'],
                ['411', '3', '4.1.1 Inland marshes', 'rgb(166,166,255)'],
                ['4111', '4', '4.1.1.1 Reedbeds and high helophytes', 'rgb(88,106,253)'],
                ['4114', '4', '4.1.1.4 Permanent saline/brackish/alkaline marshes/pools', 'rgb(0,3,175)'],
                ['4115', '4', '4.1.1.5 Seasonal/intermittent saline/brackish/alkaline marshes/pools', 'rgb(87,103,248)'],
                ['4116', '4', '4.1.1.6 Permanent freshwater marshes/pools, ponds (below 8 ha), marshes and swamps on inorganic soils, with emergent vegetation water-logged for at least most of the growing season', 'rgb(0,4,228)'],
                ['4117', '4', '4.1.1.7 Seasonal/intermittent freshwater marshes/pools on inorganic soils, includes sloughs, potholes, seasonally flooded meadows, sedge marshes', 'rgb(0,116,240)'],
                ['4118', '4', '4.1.1.8 Tundra wetlands, includes tundra pools, temporary waters from snowmelt', 'rgb(0,5,254)'],
                ['4119', '4', '4.1.1.9 Freshwater springs', 'rgb(97,74,245)'],
                ['412', '2', '4.1.2 Peatbogs', 'rgb(77,77,255)'],
                ['4121', '4', '4.1.2.1 Raised bogs', 'rgb(77,79,253)'],
                ['4122', '4', '4.1.2.2 Blanket bogs', 'rgb(136,77,253)'],
                ['4123', '4', '4.1.2.3 Forested peatlands, peatswamp forests', 'rgb(93,53,174)'],
                ['42', '2', '4.2 Coastal wetlands', 'rgb(214,157,188)'],
                ['421', '3', '4.2.1 Salt marshes', 'rgb(204,204,255)'],
                ['422', '3', '4.2.2 Salines', 'rgb(230,230,255)'],
                ['423', '3', '4.2.3 Intertidal flats', 'rgb(166,166,230)'],
                ['4231', '4', '4.2.3.1 Intertidal mud, sand or salt flats', 'rgb(164,165,228)'],
                ['4232', '4', '4.2.3.2 Intertidal forested wetlands, includes mangrove swamps, nipah swamps and tidal freshwater swamp forests ', 'rgb(201,201,228)'],
                ['5', '1', '5 Water bodies', 'rgb(0,77,168)'],
                ['51', '2', '5.1 Inland waters', 'rgb(0,112,255)'],
                ['511', '3', '5.1.1 Inland water courses', 'rgb(0,204,242)'],
                ['5111', '4', '5.1.1.1 Permanent inland deltas', 'rgb(0,212,240)'],
                ['5112', '4', '5.1.1.2 Permanent rivers/streams/creeks, includes waterfalls', 'rgb(134,247,253)'],
                ['5113', '4', '5.1.1.3 Seasonal/intermittent/irregular rivers/streams/creeks/wadis', 'rgb(0,229,241)'],
                ['5114', '4', '5.1.1.4 Canals and drainage channels, ditches', 'rgb(0,4,233)'],
                ['512', '3', '5.1.2 Inland water bodies', 'rgb(128,242,230)'],
                ['5121', '4', '5.1.2.1 Permanent freshwater lakes (over 8 ha), includes large oxbow lakes', 'rgb(114,230,170)'],
                ['5122', '4', '5.1.2.2 Seasonal/intermittent freshwater lakes (over 8 ha), includes floodplain lakes', 'rgb(142,254,249)'],
                ['5123', '4', '5.1.2.3 Permanent saline/brackish/alkaline lakes', 'rgb(121,202,243)'],
                ['5124', '4', '5.1.2.4 Seasonal/intermittent saline/brackish/alkaline lakes and flats', 'rgb(143,229,202)'],
                ['5125', '4', '5.1.2.5 Permanent freshwater lakes (over 8 ha) with aquatic bed vegetation, includes large oxbow lakes with aquatic bed vegetation', 'rgb(156,214,219)'],
                ['5126', '4', '5.1.2.6 Seasonal/intermittent freshwater lakes (over 8 ha) with aquatic bed vegetation, includes floodplain lakes with aquatic bed vegetation', 'rgb(75,156,145)'],
                ['5127', '4', '5.1.2.7 Permanent saline/brackish/alkaline lakes with aquatic bed vegetation', 'rgb(28,150,173)'],
                ['5128', '4', '5.1.2.8 Seasonal/intermittent saline/brackish/alkaline lakes and flats with aquatic bed vegetation', 'rgb(28,99,138)'],
                ['5129', '4', '5.1.2.9 Aquaculture (e.g., fish/shrimp) ponds', 'rgb(0,101,199)'],
                ['5130', '4', '5.1.3.0 Ponds, includes farm ponds, stock ponds, small tanks, (generally below 8 ha)', 'rgb(39,127,170)'],
                ['5131', '4', '5.1.3.1 Water storage areas, reservoirs/barrages/dams/impoundments (generally over 8 ha)', 'rgb(0,0,203)'],
                ['5132', '4', '5.1.3.2 Wastewater treatment areas, sewage farms, settling ponds, oxidation basins, etc', 'rgb(0,39,144)'],
                ['52', '2', '5.2 Marine waters', 'rgb(122,245,202)'],
                ['521', '3', '5.2.1 Coastal lagoons', 'rgb(0,255,166)'],
                ['5211', '4', '5.2.1.1 Coastal brackish/saline lagoons, brackish to saline lagoons with at least one relatively narrow connection to the sea', 'rgb(0,254,165)'],
                ['5212', '4', '5.2.1.2 Coastal freshwater lagoons, includes freshwater delta lagoons', 'rgb(0,218,116)'],
                ['522', '3', '5.2.2 Estuaries', 'rgb(166,255,230)'],
                ['523', '3', '5.2.3 Sea and ocean', 'rgb(230,242,255)'],
                ['5231', '4', '5.2.3.1 Permanent shallow marine waters in most cases less than six metres deep at low tide, includes sea bays and straits', 'rgb(229,241,254)'],
                ['5232', '4', '5.2.3.2 Marine subtidal aquatic beds, includes kelp beds, sea-grass beds, tropical marine meadows', 'rgb(199,249,228)'],
                ['5233', '4', '5.2.3.3 Coral reefs', 'rgb(241,231,218)']
            ],
            'MAES': [
                ['1', '1', '1 Urban', 'rgb(255,66,66)'],
                ['11', '2', '1.1 Urban Fabric etc.', 'rgb(190,0,0)'],
                ['111', '3', '1.1.1 Dense to medium dense urban', 'rgb(190,0,0)'],
                ['1111', '4', '1.1.1.1 Continuous urban fabric', 'rgb(230,0,77)'],
                ['1112', '4', '1.1.1.2 Dense urban fabric ', 'rgb(190,0,0)'],
                ['1113', '4', '1.1.1.3 Indust. or comerc. Units', 'rgb(255,0,0)'],
                ['112', '3', '1.1.2 Low density Urban Fabric', 'rgb(255,127,127)'],
                ['12', '2', '1.2 Transport', 'rgb(150,150,150)'],
                ['121', '3', '1.2.1 Transport', 'rgb(150,150,150)'],
                ['1211', '4', '1.2.1.1 Road & ass. land', 'rgb(150,150,150)'],
                ['1212', '4', '1.2.1.2 Rails and ass. land', 'rgb(90,90,90)'],
                ['1213', '4', '1.2.1.3 Port areas', 'rgb(230,204,204)'],
                ['1214', '4', '1.2.1.4 Airports', 'rgb(230,204,230)'],
                ['13', '2', '1.3 Mineral extraction etc.', 'rgb(114,78,58)'],
                ['131', '3', '1.3.1 Min. extract., dump, constr. sites', 'rgb(114,78,58)'],
                ['132', '3', '1.3.2 Land without current use', 'rgb(135,70,70)'],
                ['14', '2', '1.4 Green urban + sports + leisure ', 'rgb(255,117,255)'],
                ['141', '3', '1.4.1 Green urban areas', 'rgb(255,205,230)'],
                ['1411', '4', '1.4.1.1 Green urban areas TCD >=30%', 'rgb(255,205,230)'],
                ['1412', '4', '1.4.1.2 Green urban areas TCD <30%', 'rgb(255,205,230)'],
                ['142', '3', '1.4.2 Sports + leisure facilities', 'rgb(255,230,255)'],
                ['1421', '4', '1.4.2.1 Sports and leisure facilities TCD >=30%', 'rgb(255,230,255)'],
                ['1422', '4', '1.4.2.2 Sports and leisure facilities TCD <30%', 'rgb(255,230,255)'],
                ['2', '1', '2 Croplands', 'rgb(255,255,168)'],
                ['21', '2', '2.1 Arable land', 'rgb(255,255,168)'],
                ['211', '3', '2.1.1 Non-irrig. arable land', 'rgb(255,255,168)'],
                ['212', '3', '2.1.2 Greenhouses', 'rgb(190,190,100)'],
                ['213', '3', '2.1.3 Irrig. arable land and rice', 'rgb(255,255,0)'],
                ['2131', '4', '2.1.3.1 Rice fields', 'rgb(230,230,0)'],
                ['22', '2', '2.2 Permanent crops', 'rgb(242,203,127)'],
                ['221', '3', '2.2.1 Vineyards', 'rgb(230,128,0)'],
                ['222', '3', '2.2.2 Fruit trees and berry plant.', 'rgb(242,166,77)'],
                ['2221', '4', '2.2.2.1 High stem fruit trees', 'rgb(242,203,127)'],
                ['2222', '4', '2.2.2.2 Low stem fruit trees and berry plant.', 'rgb(242,166,77)'],
                ['223', '3', '2.2.3 Olive groves', 'rgb(230,166,0)'],
                ['23', '2', '2.3 Heterogeneous agricultural areas', 'rgb(255,230,166)'],
                ['231', '3', '2.3.1 Annual crops associat. with perman. crops', 'rgb(255,230,166)'],
                ['232', '3', '2.3.2 Complex cultivation patterns', 'rgb(255,230,77)'],
                ['233', '3', '2.3.3 Land occupied by agriculture + natural vegetation', 'rgb(230,204,77)'],
                ['234', '3', '2.3.4 Agro-forestry T.C.D. > 30%', 'rgb(242,204,166)'],
                ['235', '3', '2.3.5 Agro-forestry T.C.D. < 30%', 'rgb(242,204,166)'],
                ['3', '1', '3 Woodland and Forests', 'rgb(0,139,0)'],
                ['31', '2', '3.1 Broadleaved forest', 'rgb(128,255,0)'],
                ['311', '3', '3.1.1 Riparian and fluvial broadleaved forest', 'rgb(153,51,102)'],
                ['312', '3', '3.1.2 Broadleaved swamp forest', 'rgb(110,49,161)'],
                ['313', '3', '3.1.3 Other natural & semi-natural broadleaved forest', 'rgb(129,229,0)'],
                ['314', '3', '3.1.4 Broadleaved evergreen forest', 'rgb(122,214,0)'],
                ['315', '3', '3.1.5 Highly artificial broadleaved plantations', 'rgb(122,124,0)'],
                ['32', '2', '3.2 Coniferous forest', 'rgb(0,166,0)'],
                ['321', '3', '3.2.1 Riparian and fluvial coniferous forest', 'rgb(196,76,136)'],
                ['322', '3', '3.2.2 Coniferous swamp forest', 'rgb(93,53,179)'],
                ['323', '3', '3.2.3 Other natural & semi-natural coniferous forest', 'rgb(0,139,0)'],
                ['324', '3', '3.2.4 Highly artificial coniferous plantations', 'rgb(0,166,0)'],
                ['33', '2', '3.3 Mixed forest', 'rgb(77,255,0)'],
                ['331', '3', '3.3.1 Riparian and fluvial mixed forest', 'rgb(209,113,161)'],
                ['332', '3', '3.3.2 Mixed swamp forest', 'rgb(93,53,255)'],
                ['333', '3', '3.3.3 Other natural & semi-natural mixed forest', 'rgb(67,199,0)'],
                ['334', '3', '3.3.4 Highly artificial mixed plantations', 'rgb(77,255,0)'],
                ['34', '2', '3.4 Transitional woodland scrub', 'rgb(166,242,0)'],
                ['341', '3', '3.4.1 Transitional woodland scrub', 'rgb(166,242,0)'],
                ['35', '2', '3.5 Damaged forests', 'rgb(0,62,0)'],
                ['351', '3', '3.5.1 Damaged forests', 'rgb(0,62,0)'],
                ['4', '1', '4 Grassland', 'rgb(230,230,77)'],
                ['41', '2', '4.1 Dry grassland', 'rgb(230,230,77)'],
                ['411', '3', '4.1.1 Managed dry grassland (meadows or pastures)', 'rgb(230,230,77)'],
                ['412', '3', '4.1.2 Natural dry grasslands', 'rgb(219,214,27)'],
                ['42', '2', '4.2 Mesic grasslands', 'rgb(198,213,151)'],
                ['421', '3', '4.2.1 Managed mesic grasslands (meadows or pastures)', 'rgb(198,213,151)'],
                ['422', '3', '4.2.2 Natural mesic grasslands', 'rgb(169,19,97)'],
                ['43', '2', '4.3 Wet grasslands', 'rgb(146,168,116)'],
                ['431', '3', '4.3.1 Managed wet grassland (meadow or pastures)', 'rgb(146,168,116)'],
                ['432', '3', '4.3.2 Natural seasonally or permanently wet grasslands', 'rgb(125,149,93)'],
                ['5', '1', '5 Heathland and scrub', 'rgb(166,230,77)'],
                ['51', '2', '5.1 Moors and heathland', 'rgb(166,255,128)'],
                ['511', '3', '5.1.1 Moors and heathland', 'rgb(166,255,128)'],
                ['5111', '4', '5.1.1.1 Heathland and moorlands', 'rgb(166,255,128)'],
                ['5112', '4', '5.1.1.2 Other non-sclerophyllous scrub land', 'rgb(72,120,97)'],
                ['5113', '4', '5.1.1.3 Wet heaths', 'rgb(145,189,168)'],
                ['5114', '4', '5.1.1.4 Riverine and fen scrubs ', 'rgb(96,160,130)'],
                ['52', '1', '5.2 Sclerophyllous vegetation', 'rgb(166,230,77)'],
                ['521', '2', '5.2.1 Sclerophyllous vegetation', 'rgb(166,230,77)'],
                ['6', '1', '6 Sparsely vegetated or bare land', 'rgb(204,255,204)'],
                ['61', '2', '6.1 Sparsely vegetated areas', 'rgb(204,255,204)'],
                ['611', '3', '6.1.1 Sparsely vegetated areas', 'rgb(204,255,204)'],
                ['62', '2', '6.2 Bare soil, rock, perennial snow & ice', 'rgb(230,230,230)'],
                ['621', '3', '6.2.1 Beaches, dunes, sands', 'rgb(230,230,230)'],
                ['6211', '4', '6.2.1.1 Beaches', 'rgb(230,230,230)'],
                ['6212', '4', '6.2.1.2 Dunes', 'rgb(204,229,204)'],
                ['6213', '4', '6.2.1.3 River banks', 'rgb(189,214,189)'],
                ['622', '3', '6.2.2 Bare rocks, burnt areas, glaciers and perpetual snow', 'rgb(199,209,199)'],
                ['6221', '4', '6.2.2.1 Bare rocks and rock debris', 'rgb(204,204,204)'],
                ['6222', '4', '6.2.2.2 Burnt areas', 'rgb(0,0,0)'],
                ['6223', '4', '6.2.2.3 Glaciers and perpetual snow', 'rgb(166,230,204)'],
                ['7', '1', '7 Inland marshes and open mires', 'rgb(166,166,255)'],
                ['71', '2', '7.1 Inland marshes', 'rgb(166,166,255)'],
                ['711', '3', '7.1.1 Inland freshwater marshes', 'rgb(166,166,255)'],
                ['7111', '4', '7.1.1.1 Inland fresh marshes without reeds', 'rgb(166,166,255)'],
                ['7112', '4', '7.1.1.2 Inland fresh marshes with reeds', 'rgb(149,149,240)'],
                ['712', '2', '7.1.2 Inland saline marshes', 'rgb(134,134,194)'],
                ['7121', '4', '7.1.2.1 Inland saline marshes without reeds', 'rgb(134,134,194)'],
                ['7122', '4', '7.1.2.2 Inland saline marshes with reeds', 'rgb(119,119,179)'],
                ['72', '2', '7.2 Open mires', 'rgb(100,110,229)'],
                ['721', '3', '7.2.1 Bogs', 'rgb(77,77,255)'],
                ['7211', '4', '7.2.1.1 Raised bogs', 'rgb(77,77,255)'],
                ['7212', '3', '7.2.12 Blanket bogs', 'rgb(77,77,255)'],
                ['722', '3', '7.2.2 Fens', 'rgb(175,133,252)'],
                ['7221', '4', '7.2.2.1 Poor fens', 'rgb(202,173,253)'],
                ['7222', '4', '7.2.2.2 Rich fens', 'rgb(174,100,230)'],
                ['723', '3', '7.2.3 Mixed mires', 'rgb(139,109,225)'],
                ['7231', '4', '7.2.3.1 Palsa mires', 'rgb(139,109,225)'],
                ['7232', '4', '7.2.3.2 Aapa mires', 'rgb(139,109,225)'],
                ['7233', '4', '7.2.3.3 Polygon mires', 'rgb(139,109,225)'],
                ['724', '3', '7.2.4 Other mires', 'rgb(178,153,181)'],
                ['7241', '4', '7.2.4.1 Transition mires and quaking bogs', 'rgb(120,90,124)'],
                ['7242', '4', '7.2.4.2 Valley mires', 'rgb(178,153,181)'],
                ['725', '3', '7.2.5 Peat extraction, hydrological modifications', 'rgb(81,61,103)'],
                ['8', '1', '8 Coastal marshes, waters, flats', 'rgb(7,197,174)'],
                ['81', '2', '8.1 Salt marshes', 'rgb(144,199,240)'],
                ['811', '3', '8.1.1 Salt marshes without reeds', 'rgb(144,199,240)'],
                ['812', '3', '8.1.2 Salt marshes with reeds', 'rgb(129,179,219)'],
                ['82', '2', '8.2 Coastal waters', 'rgb(0,255,166)'],
                ['821', '3', '8.2.1 Coastal lagoons', 'rgb(0,255,166)'],
                ['822', '3', '8.2.2 River estuaries and estuarine waters of deltas', 'rgb(129,255,210)'],
                ['83', '2', '8.3 Coastal saltpans ', 'rgb(100,159,199)'],
                ['831', '3', '8.3.1 Coastal saltpans ', 'rgb(100,159,199)'],
                ['84', '2', '8.4 Intertidal flats', 'rgb(140,198,212)'],
                ['841', '3', '8.4.1 Intertidal flats', 'rgb(140,198,212)'],
                ['9', '1', '9 Rivers and Lakes', 'rgb(0,0,130)'],
                ['91', '2', '9.1 Water courses', 'rgb(0,51,204)'],
                ['911', '3', '9.1.1 Interconnected running water courses', 'rgb(0,204,242)'],
                ['9111', '4', '9.1.1.1 Permanent Interconnected running water courses', 'rgb(0,204,242)'],
                ['9112', '4', '9.1.1.2 Seasonal/intermittent interconnected running water courses', 'rgb(75,255,255)'],
                ['9113', '4', '9.1.1.3 Highly modified natural water courses and canals', 'rgb(0,102,122)'],
                ['912', '3', '9.1.2 Separated water bodies ', 'rgb(75,172,198)'],
                ['9121', '4', '9.1.2.1 Permanent separated water bodies belonging to the river system (dead side-arms, flood ponds below 8 ha)', 'rgb(75,172,198)'],
                ['9122', '4', '9.1.2.2 Seasonal/intermittent separated water bodies belonging to the river system (dead side-arms, flood ponds below 8 ha)', 'rgb(103,185,207)'],
                ['92', '2', '9.2 Lakes, ponds and reservoirs ', 'rgb(35,83,141)'],
                ['921', '3', '9.2.1 Natural water bodies', 'rgb(88,145,214)'],
                ['9211', '4', '9.2.1.1 Natural permanent water bodies', 'rgb(88,145,214)'],
                ['9212', '4', '9.2.1.2 Natural seasonal/intermittent water bodies', 'rgb(184,208,238)'],
                ['922', '3', '9.2.2 Man made water bodies', 'rgb(21,51,87)'],
                ['9221', '4', '9.2.2.1 Ponds and lakes with completely man-made structure ', 'rgb(199,193,231)'],
                ['9222', '4', '9.2.2.2 Artificial fish ponds ', 'rgb(10,161,148)'],
                ['9223', '4', '9.2.2.3 Standing water bodies of extractive mineral sites', 'rgb(193,185,145)'],
                ['9224', '4', '9.2.2.4 Other reservoirs', 'rgb(199,193,231)'],
                ['9225', '4', '9.2.2.5 Inland saltpans ', 'rgb(253,233,217)'],
                ['10', '1', '10 Marine (other)', 'rgb(0,112,192)'],
                ['101', '2', '10.1 Marine ', 'rgb(0,112,192)'],
                ['1011', '3', '10.1.1 Marine waters less than six metres deep at low tide', 'rgb(0,143,250)'],
                ['1012', '3', '10.1.2 Marine waters depth deeper than 6 m at low tide', 'rgb(0,112,192)']
            ],
            "LCCS": [
                ['1', '1', '1 Cropland - rainfed', 'rgb(255,255,100)'],
                ['101', '2', '1.1 Herbaceous cover', 'rgb(255,255,100)'],
                ['10101', '3', '1.1.1 Seasonally flooded agricultural land (including intensively managed or grazed wet meadow or pasture)', 'rgb(139,137,12)'],
                ['102', '2', '1.2 Tree or shrub cover', 'rgb(255,255,0)'],
                ['10201', '3', '1.2.1 Seasonally flooded agricultural land (including intensively managed or grazed wet meadow or pasture)', 'rgb(139,137,12)'],
                ['2', '1', '2 Cropland - irrigated or post-flooding', 'rgb(170,240,240)'],
                ['201', '2', '2.1 Irrigated land - includes irrigation channels and rice fields', 'rgb(230,230,0)'],
                ['3', '1', '3 Mosaic cropland (>50%) / natural vegetation (tree shrub herbaceous cover) (<50%)', 'rgb(220,240,100)'],
                ['30001', '3', '3.0.1 Irrigated land - includes irrigation channels and rice fields', 'rgb(230,230,0)'],
                ['4', '1', '4 Mosaic natural vegetation (tree shrub herbaceous cover) (>50%) / cropland (<50%)', 'rgb(200,200,100)'],
                ['40001', '3', '4.0.1 Irrigated land - includes irrigation channels and rice fields', 'rgb(230,230,0)'],
                ['5', '1', '5 Tree cover - broadleaved evergreen closed to open (>15%)', 'rgb(0,100,0)'],
                ['6', '1', '6 Tree cover - broadleaved deciduous closed to open (>15%)', 'rgb(0,160,0)'],
                ['601', '2', '6.1 Tree cover - broadleaved deciduous closed (>40%)', 'rgb(0,160,0)'],
                ['602', '2', '6.2 Tree cover - broadleaved deciduous open (15-40%)', 'rgb(170,200,0)'],
                ['7', '1', '7 Tree cover - needleleaved evergreen closed to open (>15%)', 'rgb(0,60,0)'],
                ['701', '2', '7.1 Tree cover - needleleaved evergreen closed (>40%)', 'rgb(0,60,0)'],
                ['702', '2', '7.2 Tree cover - needleleaved evergreen open (15-40%)', 'rgb(0,80,0)'],
                ['8', '1', '8 Tree cover - needleleaved deciduous closed to open (>15%)', 'rgb(40,80,0)'],
                ['801', '2', '8.1 Tree cover - needleleaved deciduous closed (>40%)', 'rgb(40,80,0)'],
                ['802', '2', '8.2 Tree cover - needleleaved deciduous open (15-40%)', 'rgb(40,100,0)'],
                ['9', '1', '9 Tree cover - mixed leaf type (broadleaved and needleleaved)', 'rgb(120,131,0)'],
                ['10', '1', '10 Mosaic tree and shrub (>50%) / herbaceous cover (<50%)', 'rgb(141,160,0)'],
                ['11', '1', '11 Mosaic herbaceous cover (>50%) / tree and shrub (<50%)', 'rgb(190,150,0)'],
                ['12', '1', '12 Shrubland', 'rgb(150,100,0)'],
                ['1201', '2', '12.1 Evergreen shrubland', 'rgb(120,75,0)'],
                ['120101', '3', '12.1.1 Shrub-dominated wetlands - shrub swamps - shrub-dominated freshwater marshes - shrub carr - alder thicket on inorganic soils', 'rgb(199,215,158)'],
                ['1202', '2', '12.2 Deciduous shrubland', 'rgb(150,100,0)'],
                ['120202', '3', '12.2.2 Shrub-dominated wetlands - shrub swamps - shrub-dominated freshwater marshes - shrub carr - alder thicket on inorganic soils', 'rgb(199,215,158)'],
                ['13', '1', '13 Grassland', 'rgb(255,180,50)'],
                ['14', '1', '14 Lichens and mosses', 'rgb(255,220,210)'],
                ['15', '1', '15 Sparse vegetation (tree shrub herbaceous cover) (<15%)', 'rgb(255,235,175)'],
                ['1502', '2', '15.2 Sparse shrub (<15%)', 'rgb(255,210,120)'],
                ['150201', '3', '15.2.1 Sand / shingle or pebble shores includes sand bars spits and sandy islets - includes dune systems and humid dune slacks', 'rgb(215,215,215)'],
                ['1503', '2', '15.3 Sparse herbaceous cover (<15%)', 'rgb(255,235,175)'],
                ['150301', '3', '15.3.1 Sand / shingle or pebble shores includes sand bars spits and sandy islets - includes dune systems and humid dune slacks', 'rgb(215,215,215)'],
                ['16', '1', '16 Tree cover - flooded  fresh or brakish water', 'rgb(0,120,90)'],
                ['160001', '3', '16.0.1 Forested peatlands - peatswamp forests', 'rgb(0,120,110)'],
                ['160002', '3', '16.0.2 Freshwater tree-dominated wetlands - includes freshwater swamp forests - seasonally flooded forests - wooded swamps on inorganic soils', 'rgb(129,208,76)'],
                ['17', '1', '17 Tree cover - flooded saline water', 'rgb(0,150,120)'],
                ['170001', '3', '17.0.1 Freshwater tree-dominated wetlands - includes freshwater swamp forests - seasonally flooded forests - wooded swamps on inorganic soils', 'rgb(129,208,76)'],
                ['170002', '3', '17.0.2 Forested peatlands - peatswamp forests', 'rgb(129,220,76)'],
                ['170003', '3', '17.0.3 Intertidal forested wetlands - includes mangrove swamps - nipah swamps and tidal freshwater swamp forests', 'rgb(129,208,100)'],
                ['18', '1', '18 Shrub or herbaceous cover - flooded fresh/saline/brakish water', 'rgb(0,220,131)'],
                ['180001', '3', '18.0.1 Permanent saline/brackish/alkaline marshes/pools - water perennial', 'rgb(0,3,175)'],
                ['180002', '3', '18.0.2 Permanent saline/brackish/alkaline marshes/pools - herbaceous closed', 'rgb(0,3,175)'],
                ['180003', '3', '18.0.3 Seasonal/intermittent saline/brackish/alkaline marshes/pools - water non-perennial', 'rgb(87,103,248)'],
                ['180004', '3', '18.0.4 Seasonal/intermittent saline/brackish/alkaline marshes/pools - herbaceous closed', 'rgb(87,103,248)'],
                ['180005', '3', '18.0.5 Permanent freshwater marshes/pools - ponds (below 8 ha) - marshes and swamps on inorganic soils with emergent vegetation water-logged for at least most of the growing season - water perennial', 'rgb(0,4,228)'],
                ['180006', '3', '18.0.6 Permanent freshwater marshes/pools - ponds (below 8 ha) - marshes and swamps on inorganic soils with emergent vegetation water-logged for at least most of the growing season - herbaceous closed', 'rgb(0,4,228)'],
                ['180007', '3', '18.0.7 Seasonal/intermittent freshwater marshes/pools on inorganic soils includes sloughs/potholes - seasonally flooded meadows - sedge marshes - water perennial', 'rgb(0,116,240)'],
                ['180008', '3', '18.0.8 Seasonal/intermittent freshwater marshes/pools on inorganic soils includes sloughs/potholes - seasonally flooded meadows - sedge marshes - herbaceous closed', 'rgb(0,116,240)'],
                ['180009', '3', '18.0.9 Non-forested peatlands - includes shrub or open bogs/swamps/fens', 'rgb(77,90,255)'],
                ['1800010', '3', '18.0.10 Alpine wetlands includes alpine meadows - temporary waters from snowmelt - herbaceous closed', 'rgb(77,120,255)'],
                ['1800011', '3', '18.0.11 Alpine wetlands includes alpine meadows - temporary waters from snowmelt - water perennial', 'rgb(77,150,255)'],
                ['1800012', '3', '18.0.12 Tundra wetlands includes tundra pools - temporary waters from snowmelt', 'rgb(77,170,255)'],
                ['1800013', '3', '18.0.13 Shrub-dominated wetlands - shrub swamps - shrub-dominated freshwater marshes - shrub carr - alder thicket on inorganic soils', 'rgb(199,215,158)'],
                ['1800014', '3', '18.0.14 Intertidal marshes includes salt marshes - salt meadows - saltings - raised salt marshes includes tidal brackish and freshwater marshes', 'rgb(204,204,255)'],
                ['19', '1', '19 Urban areas', 'rgb(195,20,0)'],
                ['20', '1', '20 Bare areas', 'rgb(255,245,215)'],
                ['2001', '2', '20.1 Consolidated bare areas', 'rgb(221,221,221)'],
                ['200101', '3', '20.1.1 Excavations - gravel/brick/clay pits - borrow pits - mining pools', 'rgb(112,68,137)'],
                ['200102', '3', '20.1.2 Sand shingle or pebble shores includes sand bars / spits and sandy islets includes dune systems and humid dune slacks', 'rgb(215,215,215)'],
                ['200103', '3', '20.1.3 Rocky marine shores includes rocky offshore islands - sea cliffs', 'rgb(190,190,190)'],
                ['200104', '3', '20.1.4 Karst and other subterranean hydrological systems - inland', 'rgb(190,190,220)'],
                ['200105', '3', '20.1.5 Wastewater treatment areas - sewage farms - settling ponds - oxidation basins', 'rgb(0,39,144)'],
                ['2002', '2', '20.2 Unconsolidated bare areas', 'rgb(255,245,215)'],
                ['200201', '3', '20.2.1 Excavations - gravel/brick/clay pits - borrow pits - mining pools', 'rgb(112,68,137)'],
                ['200202', '3', '20.2.2 Sand shingle or pebble shores includes sand bars - spits and sandy islets includes dune systems and humid dune slacks', 'rgb(215,215,215)'],
                ['200203', '3', '20.2.3 Rocky marine shores - includes rocky offshore islands - sea cliffs', 'rgb(190,190,190)'],
                ['200204', '3', '20.2.4 Salt exploitation sites - salt pans - salines', 'rgb(230,230,255)'],
                ['200205', '3', '20.2.5 Wastewater treatment areas - sewage farms - settling ponds - oxidation basins', 'rgb(0,39,144)'],
                ['200206', '3', '20.2.6 Intertidal mud - sand or salt flats', 'rgb(164,165,228)'],
                ['200207', '3', '20.2.7 Seasonal/intermittent saline/brackish/alkaline lakes and flats', 'rgb(143,229,202)'],
                ['21', '1', '21 Water bodies', 'rgb(0,70,200)'],
                ['210001', '3', '21.0.1 Freshwater springs - oases', 'rgb(0,90,200)'],
                ['210002', '3', '21.0.2 Geothermal wetlands', 'rgb(0,101,220)'],
                ['210003', '3', '21.0.3 Aquaculture (fish/shrimp) ponds', 'rgb(0,101,199)'],
                ['210004', '3', '21.0.4 Ponds includes farm ponds - stock ponds - small tanks (generally below 8 ha)', 'rgb(39,127,170)'],
                ['210005', '3', '21.0.5 Water storage areas - reservoirs/barrages/dams/impoundments (generally over 8 ha)', 'rgb(0,0,203)'],
                ['210006', '3', '21.0.6 Canals and drainage channels - ditches', 'rgb(0,4,233)'],
                ['210007', '3', '21.0.7 Karst and other subterranean hydrological systems human-made', 'rgb(0,50,233)'],
                ['210008', '3', '21.0.8 Permanent shallow marine waters in most cases less than six metres deep at low tide includes sea bays and straits', 'rgb(229,241,254)'],
                ['210009', '3', '21.0.9 Marine subtidal aquatic beds includes kelp beds - sea-grass beds - tropical marine meadows', 'rgb(199,249,228)'],
                ['2100010', '3', '21.0.10 Coral reefs', 'rgb(241,231,218)'],
                ['2100011', '3', '21.0.11 Estuarine waters - permanent water of estuaries and estuarine systems of deltas', 'rgb(166,255,230)'],
                ['2100012', '3', '21.0.12 Coastal brackish/saline lagoons - brackish to saline lagoons with at least one relatively narrow connection to the sea', 'rgb(0,254,165)'],
                ['2100013', '3', '21.0.13 Coastal freshwater lagoons - includes freshwater delta lagoons', 'rgb(0,218,116)'],
                ['2100014', '3', '21.0.14 Karst and other subterranean hydrological systems - marine/coastal', 'rgb(0,240,116)'],
                ['2100015', '3', '21.0.15 Permanent inland deltas', 'rgb(0,212,240)'],
                ['2100016', '3', '21.0.16 Permanent rivers/streams/creeks includes waterfalls', 'rgb(134,247,253)'],
                ['2100017', '3', '21.0.17 Seasonal/intermittent/irregular rivers/streams/creeks', 'rgb(0,229,241)'],
                ['2100018', '3', '21.0.18 Permanent freshwater lakes (over 8 ha) includes large oxbow lakes', 'rgb(114,230,170)'],
                ['2100019', '3', '21.0.19 Seasonal/intermittent freshwater lakes (over 8 ha) includes floodplain lakes', 'rgb(75,156,145)'],
                ['2100020', '3', '21.0.20 Permanent saline/brackish/alkaline lakes', 'rgb(121,202,243)'],
                ['2100021', '3', '21.0.21 Seasonal/intermittent saline/brackish/alkaline lakes and flats', 'rgb(143,229,202)'],
                ['22', '1', '22 Permanent snow and ice', 'rgb(255,255,255)']
            ]
        });
})();