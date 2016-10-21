import unittest
from geoserver.catalog import Catalog
import binding


class GeoserverSWOSTestCase(unittest.TestCase):

    def setUp(self):

        self.cat = Catalog('http://localhost:8080/geoserver/rest',username='admin', password='geoserver')
        self.ws = self.cat.create_workspace('UnitTest', 'test.test')



    def tearDown(self):
        self.cat.delete(self.ws, recurse=True)

    def test_shape_upload(self):
        shape = './test_data/wetlands/UnitTest/Watershed/Test_Watershed_Jordan_Azraq_2016.shp'
        binding.integrate_shape(shape, self.cat, 'UnitTest', 'Watershed')
        self.assertTrue(self.cat.get_layer('UnitTest:Test_Watershed_Jordan_Azraq_2016'))

    def test_raster_upload(self):
        pass

class MetadataSWOSTestCase(unittest.TestCase):




if __name__=='__main__':
    unittest.main()

