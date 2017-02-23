from django.db import models

from owslib.csw import CatalogueServiceWeb
from owslib.fes import PropertyIsLike, BBox

# CSW model to store search servers into Django
class CSW(models.Model):
    class Meta:
        verbose_name = 'CSW'
        verbose_name_plural = 'CSW'

    title = models.CharField(max_length=200)
    type = models.CharField(max_length=10, choices=[('CSW', 'CSW')], default='CSW')
    url = models.CharField("URL", max_length=200)

    def __str__(self):
        return self.title

    def search(self, text, bbox=None, start=0):
        constraints = []
        try:
            csw = CatalogueServiceWeb(self.url)
        except:
            return {'error': 'Error in establishing connection to server '+self.url}

        query = PropertyIsLike('csw:AnyText', '%'+text+'%')
        constraints.append(query)
        if bbox != None:
            bbox_query = BBox(bbox)
            constraints.append(bbox_query)

        # execute search
        # esn = elementsetname (full, summary, brief)
        # other options may not work with all csw instances!
        csw.getrecords2(constraints=constraints, startposition=start, maxrecords=10, typenames='gmd:MD_Metadata', outputschema='http://www.isotc211.org/2005/gmd', esn='full')

        totalCount = csw.results['matches']
        returned = csw.results['returned']

        results = []
        error = []
        for identifier in csw.records:
            record = csw.records[identifier]
            try:
                ogc_link = ogc_type = ogc_layer = ''
                for online in record.distribution.online:
                    # only allow WMS, WFS and SOS services for visualization
                    if online.protocol == None:
                        continue
                    if 'TiledMapService' in online.protocol:
                        ogc_link = online.url.replace('http://earthcare.ads.uni-jena.de:8080/geoserver', 'http://artemis.geogr.uni-jena.de/geoserver')
                        ogc_type = 'TMS'
                        break
                    elif 'WebMapService' in online.protocol:
                        ogc_link = online.url.replace('http://earthcare.ads.uni-jena.de:8080/geoserver', 'http://artemis.geogr.uni-jena.de/geoserver')
                        ogc_layer = online.name
                        ogc_type = 'WMS'
                        break
                    elif 'WebFeatureService' in online.protocol:
                        ogc_link = online.url.replace('http://earthcare.ads.uni-jena.de:8080/geoserver', 'http://artemis.geogr.uni-jena.de/geoserver')
                        ogc_layer = online.name
                        ogc_type = 'WFS'
                        break
                    elif 'SensorObservationService' in online.protocol:
                        ogc_link = online.url.replace('http://earthcare.ads.uni-jena.de:8080/geoserver', 'http://artemis.geogr.uni-jena.de/geoserver')
                        ogc_layer = online.name
                        ogc_type = 'SOS'
                        break

                # check spatial resolution info
                distance = ''
                if len(record.identification.distance) > 0:
                    distance = record.identification.distance[0]

                # convert OWSlib metadata object to django layers metadata object structure
                results.append({'identifier': record.identifier,
                                'title': record.identification.title,
                                'abstract': record.identification.abstract,
                                'ogc_link': ogc_link,
                                'ogc_layer': ogc_layer,
                                'ogc_type': ogc_type,
                                'topicCategory': ', '.join(record.identification.topiccategory),
                                'dataset_contact_new': {
                                  'first_name': '',
                                  'last_name': record.identification.contact[0].name,
                                  'position': record.identification.contact[0].position,
                                  'address': record.identification.contact[0].address,
                                  'postcode': record.identification.contact[0].postcode,
                                  'city': record.identification.contact[0].city,
                                  'country': record.identification.contact[0].country,
                                  'state': record.identification.contact[0].region,
                                  'email': record.identification.contact[0].email,
                                  'organisation': record.identification.contact[0].organization,
                                  'telephone': record.identification.contact[0].phone,
                                  'fax': record.identification.contact[0].fax,
                                  'mobile': '',
                                  'website': '', #record.identification.contact[0].onlineresource.url,
                                  'role': record.identification.contact[0].role
                                },
                                'meta_contact': {
                                  'first_name': '',
                                  'last_name': record.contact[0].name,
                                  'position': record.contact[0].position,
                                  'address': record.contact[0].address,
                                  'postcode': record.contact[0].postcode,
                                  'city': record.contact[0].city,
                                  'country': record.contact[0].country,
                                  'state': record.contact[0].region,
                                  'email': record.contact[0].email,
                                  'organisation': record.contact[0].organization,
                                  'telephone': record.contact[0].phone,
                                  'fax': record.contact[0].fax,
                                  'mobile': '',
                                  'website': '', #record.contact[0].onlineresource.url,
                                  'role': record.contact[0].role
                                },
                                'date_create': record.identification.date[0].date,
                                'date_type': record.identification.date[0].type,
                                'language': record.identification.resourcelanguage,
                                'characterset': '',
                                'format': record.distribution.format,
                                'west': record.identification.bbox.minx,
                                'east': record.identification.bbox.maxx,
                                'north': record.identification.bbox.maxy,
                                'south': record.identification.bbox.miny,
                                'alternatetitle': record.identification.alternatetitle,
                                'geo_description': '',
                                'representation_type': '',
                                'equi_scale': distance,
                                #'epsg': record.referencesystem.code,
                                'meta_language': record.language,
                                'meta_characterset': record.charset,
                                'meta_date': record.datestamp

                })

            except Exception as e:
                error.append(str(e))

        return {'records': results, 'totalCount': totalCount, 'count': returned, 'error': error}