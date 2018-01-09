from django.template.loader import get_template
from webgis import settings
from owslib.util import http_post
import os.path

from layers.models import MetadataSerializer
from swos.models import WetlandLayer

#Create insert and delete XML
def create_csw_xml(instance):

    layer = MetadataSerializer(instance)

    tpl = get_template('CSW/full_metadata_insert.xml')

    # Add online resource
    online_resources = []
    online_resources.append({'linkage': instance.ogc_link, 'name': instance.title, 'protocol': instance.ogc_type })

    ctx =({
        'layer': layer.data,
        'keyword_list': ('SWOS', ),
        'parent_identifier': "SWOS",
        'online_resources': online_resources
    })

    md_doc_meta = tpl.render(ctx)
    f = open(settings.MEDIA_ROOT + 'csw/' + str(instance.id) + '_metadata.xml', 'w')
    f.write(md_doc_meta)

    ctx["csw"] = "1"
    md_doc_csw = tpl.render(ctx)
    f = open(settings.MEDIA_ROOT + 'csw/' + str(instance.id) + '_insert.xml', 'w')
    f.write(md_doc_csw)


    tpl = get_template('CSW/delete.xml')
    ctx =({
        'identifier': instance.identifier
    })

    md_doc = tpl.render(ctx)
    f = open(settings.MEDIA_ROOT + 'csw/' + str(instance.id) + '_delete.xml', 'w')
    f.write(md_doc)


def create_record(id):
    response = http_post(settings.CSW_T_PATH, request=open(settings.MEDIA_ROOT + 'csw/' + str(id) + '_insert.xml').read())
    print response

def delete_record(id):
    if os.path.isfile(settings.MEDIA_ROOT + 'csw/' + str(id) + '_delete.xml'):
        response = http_post(settings.CSW_T_PATH, request=open(settings.MEDIA_ROOT + 'csw/' + str(id) + '_delete.xml').read())
        print response

def create_update_csw(instance, action):
    if action == "update":
        delete_record(instance.id)
    create_csw_xml(instance)
    create_record(instance.id)

def delete_csw(instance):
    delete_record(instance.id)

#Create / update all WetlandLayer CSW records
def create_update_csw_all():
    wetland_layer = WetlandLayer.objects.filter(publishable = True)
    for layer in wetland_layer:
        #print layer.__dict__
        from layers.models import MetadataSerializer
        data = MetadataSerializer(layer).data
        import json
        data_obj = json.loads(json.dumps(data))
        print data_obj["identifier"] + "%" + data_obj["abstract"]+ "%" + str(data_obj["topicCategory"]) + "%" + str(data_obj["layer_keywords"]) + "%" + str(data_obj["scope"]) + "%" + str(data_obj["layer_conformity"]) + "%" + str(data_obj["layer_constraints_limit"]) + "%" + str(data_obj["layer_constraints_cond"]) + "%" + data_obj["meta_lineage"] + "%" + str(data_obj["point_of_contacts"])
        create_update_csw(layer, "update")