# django-suit config
from suit.apps import DjangoSuitConfig
from suit.menu import ParentItem, ChildItem
from webgis import settings

class SuitConfig(DjangoSuitConfig):
    layout = 'horizontal' #vertical / horizontal
    menu = (
        ParentItem('Authorization', children=[
            ChildItem(model='auth.user'),
            ChildItem('User groups', 'auth.group')
        ], icon='fa fa-users'),
        ParentItem('Map Viewer', children=[
            ChildItem('Map Viewer', model='mapviewer.mapviewer')
        ]),
        ParentItem('Search', children=[
            ChildItem('Search', model='csw.csw')
        ]),
        ParentItem('Contact', children=[
            ChildItem('Contacts', model='layers.contact')
        ]),
        ParentItem('Lists', children=[
            ChildItem('Countries', model='swos.country'),
            ChildItem('ISO Code lists', model='layers.isocodelist'),
        ]),
        ParentItem('Layer', children=[
            ChildItem('Layer', model='layers.layer'),
            ChildItem('Layer Groups', model='layers.layergroup')
        ]),
        ParentItem('SWOS', children=[
            ChildItem('Wetlands', model='swos.wetland'),
            ChildItem('Wetland Layers', model='swos.wetlandlayer'),
            ChildItem('Wetland Products', model='swos.product'),
            ChildItem('Wetland Images', model='swos.wetlandimage'),
            ChildItem('Wetland Videos', model='swos.wetlandvideo'),
            ChildItem('External Layers', model='swos.externallayer'),
            ChildItem('External Databases', model='swos.externaldatabase'),
            ChildItem('Story Lines', model='swos.storyline'),
            ChildItem('Story Line Parts', model='swos.storylinepart'),
        ])
    )
    if "validation" in settings.INSTALLED_APPS:
        menu = menu + ((ParentItem('Validation', children=[ChildItem('Validation Layers', model='validation.validationlayer') ])),);

