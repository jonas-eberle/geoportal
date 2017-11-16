from django.db.models.signals import post_save, post_delete, pre_save
from webgis import settings

from swos.search_es import LayerIndex, ExternalDatabaseIndex, WetlandIndex
from swos.csw import create_update_csw, delete_csw
from swos.models import WetlandLayer, ExternalLayer, Wetland, ExternalDatabase

from djgeojson.serializers import Serializer as GeoJSONSerializer

#Create/update csw records after creation or update if publishable is true
#Delete: delete and publishable changes to false
def keep_track_save(sender, instance, created, **kwargs):
    action = 'save' if created else 'update'
    if settings.CSW_T == True and sender == WetlandLayer and instance.publishable == True:
        create_update_csw(instance, action)
    if settings.ELASTICSEARCH == True and (sender == WetlandLayer or sender == ExternalLayer) and instance.publishable == True:
        instance.indexing()
    if settings.ELASTICSEARCH == True and sender == ExternalDatabase:
        instance.indexing()
    if settings.ELASTICSEARCH == True and sender == Wetland:
        instance.indexing()
        ext_db = ExternalDatabase.objects.filter(wetland_id = instance.id)
        wetland_layer = WetlandLayer.objects.filter(wetland_id=instance.id, publishable = True)
        for x in ext_db:
            x.indexing()
        for y in wetland_layer:
            y.indexing()
    if sender == Wetland:
        #update wetlands.geojson
        f = open(settings.MEDIA_ROOT + 'wetlands/wetlands.geojson', 'w')
        geojson = GeoJSONSerializer().serialize(Wetland.objects.all(), geometry_field='geom', properties=('id', 'name', 'country', 'geo_scale', 'size', 'description','ecoregion', 'wetland_type', 'site_type', 'products'), precision = 4)
        f.write(geojson)

def keep_track_delete(sender, instance, **kwargs):
    if settings.CSW_T == True and sender == WetlandLayer:
        delete_csw(instance)
    if settings.ELASTICSEARCH == True:
        if sender == WetlandLayer or sender == ExternalLayer:
            LayerIndex.get(id=instance.id).delete()
        if sender == ExternalDatabase:
            ExternalDatabase.get(id=instance.id).delete()
        if sender == Wetland:
            WetlandIndex.get(id=instance.id).delete()

def keep_track_publishable(sender, instance, **kwargs):
    old_instance = sender.objects.get(pk=instance.pk)
    if settings.CSW_T == True and sender == WetlandLayer and old_instance.publishable == True and instance.publishable == False:
        delete_csw(instance)
    if settings.ELASTICSEARCH == True and (sender == WetlandLayer or sender == ExternalLayer) and old_instance.publishable == True and instance.publishable == False:
        if sender == WetlandLayer or sender == ExternalLayer:
            LayerIndex.get(id=instance.id).delete()


pre_save.connect(keep_track_publishable, sender=WetlandLayer)
post_save.connect(keep_track_save, sender=WetlandLayer)
post_delete.connect(keep_track_delete, sender=WetlandLayer)

pre_save.connect(keep_track_publishable, sender=ExternalLayer)
post_save.connect(keep_track_save, sender=ExternalLayer)
post_delete.connect(keep_track_delete, sender=ExternalLayer)

post_save.connect(keep_track_save, sender=Wetland)
post_delete.connect(keep_track_delete, sender=Wetland)

post_save.connect(keep_track_save, sender=ExternalDatabase)
post_delete.connect(keep_track_delete, sender=ExternalDatabase)