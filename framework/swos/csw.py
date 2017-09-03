from django.template.loader import get_template
from webgis import settings
from owslib.util import http_post
from layers.models import MetadataSerializer


#Create insert and delete XML
def create_csw_xml(instance):

    layer = MetadataSerializer(instance)

    tpl = get_template('CSW/full_metadata_insert.xml')
    ctx =({
        'layer': layer.data,
        'keyword_list': ('SWOS', ),
        'parent_identifier': "SWOS"
    })

    md_doc = tpl.render(ctx)
    f = open(settings.MEDIA_ROOT + 'csw/' + str(instance.id) + '_insert.xml', 'w')
    f.write(md_doc)

    tpl = get_template('CSW/delete.xml')
    ctx =({
        'identifier': instance.identifier
    })

    md_doc = tpl.render(ctx)
    f = open(settings.MEDIA_ROOT + 'csw/' + str(instance.id) + '_delete.xml', 'w')
    f.write(md_doc)


def create_pycsw_entry(id):
    response = http_post(settings.CSW_T_PATH, request=open(settings.MEDIA_ROOT + 'csw/' + str(id) + '_insert.xml').read())
    print response

def delete_pycsw_entry(id):
    response = http_post(settings.CSW_T_PATH, request=open(settings.MEDIA_ROOT + 'csw/' + str(id) + '_delete.xml').read())
    print response

def create_update_csw(instance, action):
    create_csw_xml(instance)
    if action == "update":
        delete_pycsw_entry(instance.id)
    create_pycsw_entry(instance.id)

def delete_csw(instance):
    delete_pycsw_entry(instance.id)
