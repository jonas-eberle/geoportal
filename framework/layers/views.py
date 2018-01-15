from django.http import Http404, HttpResponse
from django.shortcuts import redirect
from wsgiref.util import FileWrapper

from rest_framework import serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response
import urllib2
import json

from webgis import settings

from .models import Layer, Contact, MetadataSerializer, KeywordInlineSerializer, KeywordInline

from owslib.etree import etree

# Contact serializer used in LayerSerializer
class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ('first_name', 'last_name')


# Layer serializer used in LayerList view
class LayerSerializer(serializers.ModelSerializer):
    dataset_contact_new = ContactSerializer(read_only=True)

    class Meta:
        model = Layer
        fields = ('title', 'abstract', 'dataset_contact_new', 'downloadable')
        

# View to list all layers (not used in production!)
class LayerList(APIView):

    # HTTP GET method
    def get(self, request, format=None):
        snippets = Layer.objects.all()
        serializer = LayerSerializer(snippets, many=True)
        return Response(serializer.data)


# REST view to provide metadata for the given layer
class LayerDetail(APIView):
    def get_object(self, pk):
        try:
            return Layer.objects.get(pk=pk)
        except Layer.DoesNotExist:
            raise Http404

    # HTTP GET method
    def get(self, request, pk, format=None):

        layer = self.get_object(pk)
        serializer = MetadataSerializer(layer)
        serializer_data = serializer.data
        serializer_data['keywords'] = KeywordInlineSerializer(KeywordInline.objects.filter(layer=layer.id), many=True).data
        return Response(serializer_data)


# REST view to redirect to a download URL for a given layer
class LayerDownload(APIView):
    def get_object(self, pk):
        try:
            return Layer.objects.get(pk=pk)
        except Layer.DoesNotExist:
            raise Http404

    # HTTP GET method
    def get(self, request, pk, format=None):
        layer = self.get_object(pk)

        # download method of layer object checks for permission!
        url = layer.download(request)
        return redirect(url)


# REST view to retrieve content of external URLs (can be multiple)
# used for GetFeatureInfo requests for OGC WMS layers
class LayerInfo(APIView):
    # HTTP GET method
    def get(self, request, *args, **kwargs):
        urls = request.query_params.get('url')
        urls = urls.split('||')
        
        names = request.query_params.get('names')
        names = names.split('||')

        htmloutput = ''
        for index, url in enumerate(urls):
            try:
                #url = url.replace('text%2Fhtml', 'text%2Fplain')
                f = urllib2.urlopen(url)
                code = f.code
                output = f.read()
            except Exception as e:
                code = e.code
                output = e.read()

            htmloutput += '<p><strong>'+names[index]+'</strong><br/>'

            try:
                if '<ServiceExceptionReport' in output:
                    xml = etree.fromstring(output)
                    code = xml.getchildren()[0].attrib['code']
                    if code == 'LayerNotQueryable':
                        htmloutput += 'No further data available'
                    else:
                        htmloutput += xml.getchildren()[0].text.strip()
                    htmloutput += '</p>'
                elif '<ExceptionReport' in output:
                    xml = etree.fromstring(output)
                    code = xml.getchildren()[0].attrib['exceptionCode']
                    if code == 'TileOutOfRange':
                        #htmloutput += "No data available at this location"
                        htmloutput = htmloutput[:htmloutput.rfind('<p><strong>')] + htmloutput[htmloutput.rfind('<br/>') + 5:]
                    else:
                        htmloutput += xml.getchildren()[0].getchildren()[0].text.strip()
                    htmloutput += '</p>'
                elif output == '' or code >= 400:
                    htmloutput += 'No further data available'
                else:
                    if 'GRAY_INDEX' in output:
                        if 'SWOS LSTT' in names[index]:
                            output = output.replace('GRAY_INDEX', 'Surface Temperature (deg C)')
                        else:
                            output = output.replace('GRAY_INDEX', 'Value')
                    if 'fid' in output:
                        output = output.replace('<th>fid</th>', '')
                        output = output[:output.find('<td>')] + output[output.find('</td>')+5:]

                    import re
                    matches = re.findall(r'<td>(\d.*\d)</td>', output)
                    for match in matches:
                        print match
                        try:
                            match_float = float(match)
                        except ValueError:
                            print "Not a float"

                        if isinstance(match_float, float):
                            length = 0
                            if '.' in match:
                                length = len(match) - match.index('.') - 1
                            if length > 3:
                                new =  "{0:.3f}".format(match_float)
                                output = output.replace("<td>"+match+"</td>","<td>"+new+"</td>")

                    if '<table' in output:
                        htmloutput += output
                    else:
                        htmloutput = htmloutput[:htmloutput.rfind('<p><strong>')] + htmloutput[htmloutput.rfind('<br/>')+5:]


            except Exception as e:
                htmloutput += 'An error occurred while requesting data'
            htmloutput += '</p>'

        return HttpResponse(htmloutput)


# REST view for proxying external resources
class DataRequest(APIView):
    # HTTP GET method
    def get(self, request, *args, **kwargs):
        url = request.query_params.get('url')

        htmloutput = ''
        f = urllib2.urlopen(url)
        htmloutput = f.read()

        return HttpResponse(htmloutput)


# REST view to extract all stations of an SOS service & offering and provide a GeoJSON
import geojson
class GetSOSStations(APIView):
    def get(self, request, pk, *args, **kwargs):
        layer = Layer.objects.get(pk=pk)

        with open(settings.MEDIA_ROOT+'cache/sos_stations_'+str(layer.id)+'.json', 'r') as f:
            coll = geojson.load(f)
            return Response(coll)

        return Response([], status=status.HTTP_404_NOT_FOUND)


# REST view to get observations for a given layer (sos server) and procedure
from dateutil import parser
from dateutil.relativedelta import relativedelta

class GetSOSObservation(APIView):
    def get(self, request, *args, **kwargs):
        django_layer_id = int(request.query_params.get('id'))
        procedure = str(request.query_params.get('procedure'))

        download = False
        if request.query_params.has_key('download'):
            download = True

        start = None
        if request.query_params.has_key('start'):
            try:
                start = parser.parse(request.query_params.get('start').replace('Z', ''))
            except:
                pass

        end = None
        if request.query_params.has_key('end'):
            try:
                end = parser.parse(request.query_params.get('end').replace('Z', ''))
            except:
                pass

        observedProperty = None
        if request.query_params.has_key('param'):
            observedProperty = request.query_params.get('param')

        # get layer object from given id
        try:
            layer = Layer.objects.get(pk=django_layer_id)
        except:
            raise Http404

        # get sos url and name of offering from layer
        sos_url = layer.ogc_link
        sos_offering = layer.ogc_layer

        from owslib.sos import SensorObservationService

        # generate Sensor Observation Object
        try:
            sos = SensorObservationService(sos_url, version='1.0.0')
        except:
            raise Http404

        # describe sensor request lists any fields for this procedure / station
        meta = sos.getOperationByName('DescribeSensor')
        outputFormat = "text/xml;subtype='sensorML/1.0.0'"
        try:
            outputFormat = meta.parameters['outputFormat']['values'][0]
        except:
            pass
        sensor = sos.describe_sensor(procedure=procedure, outputFormat=outputFormat)

        # parse XML from describe sensor request
        sensml = etree.fromstring(sensor)

        # search for fields and their name, definition and uom or available date range (for time)
        fields_obj = sensml.findall('.//{http://www.opengis.net/swe/1.0.1}field')
        fields = []
        parameters = []
        parametersList = dict()
        activeField = observedProperty
        for field in fields_obj:
            name = field.attrib['name']
            item = field.getchildren()[0]
            definition = item.attrib['definition']
            if activeField == None and name == layer.sos_default_field:
                activeField = definition
            if item.tag == '{http://www.opengis.net/swe/1.0.1}Time':
                value = item.find('.//{http://www.opengis.net/swe/1.0.1}interval').text.split(' ')
                fields.append({'name': name, 'definition': definition, 'interval': value})
            elif item.tag == '{http://www.opengis.net/swe/1.0.1}Quantity':
                value = item.find('.//{http://www.opengis.net/swe/1.0.1}uom').attrib['code']
                fields.append({'name': name, 'definition': definition, 'uom': value})
                parameters.append({'name': name, 'definition': definition, 'uom': value})
                parametersList[definition] = {'name': name, 'definition': definition, 'uom': value}

        # if we have more than one field, we can execute the get observation request
        if len(fields) > 1:

            # At the moment only the first field can be used in get observation request
            if activeField != None:
                observedProperty = activeField
            if observedProperty == None or observedProperty not in parametersList:
                observedProperty = parameters[0]['definition']

            # At the moment only the complete date range is used for get observation request
            if end == None:
                endTime = fields[0]['interval'][1]
                end = parser.parse(endTime)

            if start == None:
                startTime = fields[0]['interval'][0]
                start = parser.parse(startTime)
                #start = end - relativedelta(years=1)

            start = str(start).replace(' ', 'T')
            end = str(end).replace(' ', 'T')
            eventTime = start + '/' + end

            # execute get observation request
            res = sos.get_observation(offerings=[sos_offering], responseFormat='application/json', observedProperties=[observedProperty], eventTime=eventTime, procedure=procedure)

            # load JSON result
            try:
                j = json.loads(res)
            except Exception as e:
                return Response({'error': e.message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            name, samplingTime, result, feature, observedPropertyRes, procedure = j['ObservationCollection']['member'][0].values()

            # save and return as CSV
            if download == True:
                from pandas import DataFrame
                columns = [item['definition'] for item in result['DataArray']['field']]
                d = DataFrame(result['DataArray']['values'], columns=columns)
                d.set_index(columns[0], inplace=True)

                import tempfile
                f=tempfile.TemporaryFile()
                d.to_csv(f)
                f.seek(0)

                response = HttpResponse(FileWrapper(f), content_type='text/csv')
                response['Content-Disposition'] = 'attachment; filename="%s"' % 'download.csv'
                return response

            else:
                # only returned values und fields are relevant for us
                output = {'start': start, 'end': end, 'minDate': fields[0]['interval'][0], 'maxDate': fields[0]['interval'][1], 'param': parametersList[observedProperty], 'parameters': parameters, 'dimensions': result['DataArray']['elementCount'], 'values':result['DataArray']['values'], 'fields': result['DataArray']['field']}
                return Response(output)

        else:
            return Response({}, status=status.HTTP_503_SERVICE_UNAVAILABLE)


class GetWMSCapabilities(APIView):
    def get(self, request, *args, **kwargs):
        url = request.query_params.get('url')
        #type = request.query_params.get('type')

        f = urllib2.urlopen(url)
        from lxml import etree
        try:
            xml = etree.parse(f)
        except:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

        ns = {'ows':'http://www.opengis.net/ows/1.1'}
        ns['wms'] = 'http://www.opengis.net/wms'
        #ns['wmts'] = 'http://www.opengis.net/wmts/1.0'

        version = xml.getroot().attrib['version']

        nsWMS = ''
        timeElement = 'Extent'
        if version == '1.3.0':
            nsWMS = 'wms:'
            timeElement = 'wms:Dimension'

        getMapResource = xml.xpath('//wms:Capability/wms:Request/wms:GetMap/wms:DCPType/wms:HTTP/wms:Get/wms:OnlineResource'.replace('wms:', nsWMS), namespaces=ns)[0]
        server_url = getMapResource.attrib['{http://www.w3.org/1999/xlink}href']

        server_layers = []
        layers = xml.xpath('//wms:Capability/wms:Layer/wms:Layer'.replace('wms:', nsWMS), namespaces=ns)
        for layer in layers:
            layerObj = {}
            layerObj['ogc_link'] = server_url
            layerObj['ogc_type'] = 'WMS'
            layerObj['ogc_layer'] = layer.find('./wms:Name'.replace('wms:', nsWMS), namespaces=ns).text
            layerObj['title'] = layer.find('./wms:Title'.replace('wms:', nsWMS), namespaces=ns).text
            layerObj['epsg'] = 4326
            if version == '1.3.0':
                bbox_elem = layer.find('./wms:EX_GeographicBoundingBox', namespaces=ns)
                if isinstance(bbox_elem, etree._Element):
                    layerObj['west'] = float(bbox_elem.find('./wms:westBoundLongitude', namespaces=ns).text)
                    layerObj['east'] = float(bbox_elem.find('./wms:eastBoundLongitude', namespaces=ns).text)
                    layerObj['south'] = float(bbox_elem.find('./wms:southBoundLatitude', namespaces=ns).text)
                    layerObj['north'] = float(bbox_elem.find('./wms:northBoundLatitude', namespaces=ns).text)
            else:
                bbox_elem = layer.find('./LatLonBoundingBox', namespaces=ns)
                if isinstance(bbox_elem, etree._Element):
                    layerObj['west'] = float(bbox_elem.attrib['minx'])
                    layerObj['east'] = float(bbox_elem.attrib['maxx'])
                    layerObj['south'] = float(bbox_elem.attrib['miny'])
                    layerObj['north'] = float(bbox_elem.attrib['maxy'])

            time = layer.find('./'+timeElement+'[@name="time"]', namespaces=ns)
            if isinstance(time, etree._Element):
                if 'default' in time.keys():
                    layerObj['selectedDate'] = time.attrib['default']
                layerObj['timeRange'] = time.text

            time = layer.find('./Dimension[@name="TIME"]', namespaces=ns)
            if isinstance(time, etree._Element):
                if 'default' in time.keys():
                    layerObj['selectedDate'] = time.attrib['default']
                layerObj['timeRange'] = time.text

            server_layers.append(layerObj)

        return Response({'url': server_url, 'layers': server_layers})


class GetWMTSCapabilities(APIView):
    def get(self, request, *args, **kwargs):
        url = request.query_params.get('url')

        f = urllib2.urlopen(url)
        from lxml import etree
        try:
            xml = etree.parse(f)
        except:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

        ns = {'ows':'http://www.opengis.net/ows/1.1'}
        ns['wmts'] = 'http://www.opengis.net/wmts/1.0'

        version = xml.getroot().attrib['version']

        resourceGetKVP = xml.xpath('//ows:OperationsMetadata/ows:Operation[@name="GetTile"]/ows:DCP/ows:HTTP/ows:Get/ows:Constraint[@name="GetEncoding"]/ows:AllowedValues/ows:Value[text()="KVP"]/parent::node()/parent::node()/parent::node()', namespaces=ns)
        if len(resourceGetKVP) > 0:
            server_url = resourceGetKVP[0].attrib['{http://www.w3.org/1999/xlink}href']

        server_layers = []
        layers = xml.xpath('//wmts:Layer', namespaces=ns)
        for layer in layers:
            layerObj = {}
            layerObj['ogc_link'] = server_url
            layerObj['ogc_type'] = 'WMTS'
            layerObj['ogc_layer'] = layer.find('./ows:Identifier', namespaces=ns).text
            layerObj['title'] = layer.find('./ows:Title', namespaces=ns).text
            layerObj['ogc_imageformat'] = layer.find('./wmts:Format', namespaces=ns).text
            layerObj['wmts_matrixset'] = layer.find('.//wmts:TileMatrixSet', namespaces=ns).text
            bbox_elem = layer.find('./ows:WGS84BoundingBox', namespaces=ns)
            if isinstance(bbox_elem, etree._Element):
                west, south = bbox_elem.find('./ows:LowerCorner', namespaces=ns).text.split(' ')
                east, north = bbox_elem.find('./ows:UpperCorner', namespaces=ns).text.split(' ')
                layerObj['west'] = float(west)
                layerObj['east'] = float(east)
                layerObj['south'] = float(south)
                layerObj['north'] = float(north)

            time = layer.xpath('./wmts:Dimension/ows:Identifier[text()="time"]/parent::node()', namespaces=ns)
            if len(time) > 0:
                time = time[0]
                layerObj['selectedDate'] = time.find('./wmts:Default', namespaces=ns).text
                times_xml = time.findall('./wmts:Value', namespaces=ns)
                
                if len(times_xml) > 0:
                    times = []
                    for time in times_xml:
                        times.append(time.text)
                    layerObj['timeRange'] = ','.join(times) 

            # Get TileMatrix set
            matrixset = xml.xpath('//wmts:TileMatrixSet/ows:Identifier[text()="'+layerObj['wmts_matrixset']+'"]/parent::node()', namespaces=ns)
            if len(matrixset) > 0:
                matrixset = matrixset[0]
                layerObj['wmts_projection'] = matrixset.find('./ows:SupportedCRS', namespaces=ns).text
                matrixes = matrixset.findall('./wmts:TileMatrix', namespaces=ns)

                if len(matrixes) > 0:
                    layerObj['wmts_tilesize'] = int(matrixes[0].find('./wmts:TileWidth', namespaces=ns).text)
                    layerObj['wmts_resolutions'] = []
                    for matrix in matrixes:
                        layerObj['wmts_resolutions'].append(float(matrix.find('./wmts:ScaleDenominator', namespaces=ns).text))
                    layerObj['matrixSetIds'] = range(0, len(layerObj['wmts_resolutions']))
                    layerObj['wmts_resolutions'] = ' '.join([str(f) for f in layerObj['wmts_resolutions']])

            server_layers.append(layerObj)

        return Response({'url': server_url, 'layers': server_layers})

class GetTimeValues(APIView):
    def get(self, request, *args, **kwargs):
        value = request.query_params.get('time')
        if value == None or value == '':
            return Response({'error':'No time range given'}, status=status.HTTP_400_BAD_REQUEST)

        dates = []

        start, end, interval = value.split('/')
        from dateutil import parser, rrule
        start = parser.parse(start)
        end = parser.parse(end)

        timerange = None
        intval = 1
        if interval == 'P1D':
            timerange = rrule.DAILY
        elif interval == 'P8D':
            timerange = rrule.DAILY
            intval = 8
        elif interval == 'P16D':
            timerange = rrule.DAILY
            intval = 16
        elif interval == 'P1M':
            timerange = rrule.MONTHLY
        elif interval == 'P1Y':
            timerange = rrule.YEARLY

        if timerange != None:
            for dt in rrule.rrule(timerange, interval=intval, dtstart=start, until=end):
                dates.append(dt.strftime('%Y-%m-%d'))

        return Response({'dates':dates})

