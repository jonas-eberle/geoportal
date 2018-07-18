# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User, Group
from django.contrib.gis.db import models
from django.utils.html import format_html
from django_thumbs.db.models import ImageWithThumbsField
from swos.search_es import LayerIndex, ExternalDatabaseIndex
from geospatial.models import Region

from layers.models import Layer, ISOcodelist, KeywordInline, Contact

# Create your models here.
class Category(models.Model):
    category = models.CharField(max_length=60)

class Country(models.Model):
    name = models.CharField(max_length=200)
    ne_feature_id = models.IntegerField(blank=True, null=True)
    continent = models.CharField(max_length=200, blank=True)
    bbox = models.CharField(max_length=200, blank=True, null=True)

    def __unicode__(self):
        return u"%s" % (self.name)

class ExternalDatabase(models.Model):
    LANG_CODES = (
        ('ab', 'Abkhazian'),
        ('aa', 'Afar'),
        ('af', 'Afrikaans'),
        ('ak', 'Akan'),
        ('sq', 'Albanian'),
        ('am', 'Amharic'),
        ('ar', 'Arabic'),
        ('an', 'Aragonese'),
        ('hy', 'Armenian'),
        ('as', 'Assamese'),
        ('av', 'Avaric'),
        ('ae', 'Avestan'),
        ('ay', 'Aymara'),
        ('az', 'Azerbaijani'),
        ('bm', 'Bambara'),
        ('ba', 'Bashkir'),
        ('eu', 'Basque'),
        ('be', 'Belarusian'),
        ('bn', 'Bengali'),
        ('bh', 'Bihari languages'),
        ('bi', 'Bislama'),
 #       ('nb', 'Bokmal, Norwegian; Norwegian Bokmal'),
        ('bs', 'Bosnian'),
        ('br', 'Breton'),
        ('bg', 'Bulgarian'),
        ('my', 'Burmese'),
        ('ca', 'Catalan; Valencian'),
        ('km', 'Central Khmer'),
        ('ch', 'Chamorro'),
        ('ce', 'Chechen'),
        ('ny', 'Chichewa; Chewa; Nyanja'),
        ('zh', 'Chinese'),
 #       ('cu', 'Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic'),
        ('cv', 'Chuvash'),
        ('kw', 'Cornish'),
        ('co', 'Corsican'),
        ('cr', 'Cree'),
        ('hr', 'Croatian'),
        ('cs', 'Czech'),
        ('da', 'Danish'),
 #       ('dv', 'Divehi; Dhivehi; Maldivian'),
        ('nl', 'Dutch; Flemish'),
        ('dz', 'Dzongkha'),
        ('en', 'English'),
        ('eo', 'Esperanto'),
        ('et', 'Estonian'),
        ('ee', 'Ewe'),
        ('fo', 'Faroese'),
        ('fj', 'Fijian'),
        ('fi', 'Finnish'),
        ('fr', 'French'),
        ('ff', 'Fulah'),
 #       ('gd', 'Gaelic; Scottish Gaelic'),
        ('gl', 'Galician'),
        ('lg', 'Ganda'),
        ('ka', 'Georgian'),
        ('de', 'German'),
        ('el', 'Greek, Modern (1453-)'),
        ('gn', 'Guarani'),
        ('gu', 'Gujarati'),
        ('ht', 'Haitian; Haitian Creole'),
        ('ha', 'Hausa'),
        ('he', 'Hebrew'),
        ('hz', 'Herero'),
        ('hi', 'Hindi'),
        ('ho', 'Hiri Motu'),
        ('hu', 'Hungarian'),
        ('is', 'Icelandic'),
        ('io', 'Ido'),
        ('ig', 'Igbo'),
        ('id', 'Indonesian'),
        ('ia', 'Interlingua (International Auxiliary Language Association)'),
        ('ie', 'Interlingue; Occidental'),
        ('iu', 'Inuktitut'),
        ('ik', 'Inupiaq'),
        ('ga', 'Irish'),
        ('it', 'Italian'),
        ('ja', 'Japanese'),
        ('jv', 'Javanese'),
        ('kl', 'Kalaallisut; Greenlandic'),
        ('kn', 'Kannada'),
        ('kr', 'Kanuri'),
        ('ks', 'Kashmiri'),
        ('kk', 'Kazakh'),
        ('ki', 'Kikuyu; Gikuyu'),
        ('rw', 'Kinyarwanda'),
        ('ky', 'Kirghiz; Kyrgyz'),
        ('kv', 'Komi'),
        ('kg', 'Kongo'),
        ('ko', 'Korean'),
        ('kj', 'Kuanyama; Kwanyama'),
        ('ku', 'Kurdish'),
        ('lo', 'Lao'),
        ('la', 'Latin'),
        ('lv', 'Latvian'),
        ('li', 'Limburgan; Limburger; Limburgish'),
        ('ln', 'Lingala'),
        ('lt', 'Lithuanian'),
        ('lu', 'Luba-Katanga'),
        ('lb', 'Luxembourgish; Letzeburgesch'),
        ('mk', 'Macedonian'),
        ('mg', 'Malagasy'),
        ('ms', 'Malay'),
        ('ms', 'Malay'),
        ('ml', 'Malayalam'),
        ('mt', 'Maltese'),
        ('gv', 'Manx'),
        ('mi', 'Maori'),
        ('mr', 'Marathi'),
        ('mh', 'Marshallese'),
        ('mn', 'Mongolian'),
        ('na', 'Nauru'),
        ('nv', 'Navajo; Navaho'),
        ('nd', 'Ndebele, North; North Ndebele'),
        ('nr', 'Ndebele, South; South Ndebele'),
        ('ng', 'Ndonga'),
        ('ne', 'Nepali'),
        ('se', 'Northern Sami'),
        ('no', 'Norwegian'),
#        ('nn', 'Norwegian Nynorsk; Nynorsk, Norwegian'),
        ('oc', 'Occitan (post 1500)'),
        ('oj', 'Ojibwa'),
        ('or', 'Oriya'),
        ('om', 'Oromo'),
        ('os', 'Ossetian; Ossetic'),
        ('pi', 'Pali'),
        ('pa', 'Panjabi; Punjabi'),
        ('fa', 'Persian'),
        ('pl', 'Polish'),
        ('pt', 'Portuguese'),
        ('ps', 'Pushto; Pashto'),
        ('qu', 'Quechua'),
        ('ro', 'Romanian; Moldavian; Moldovan'),
        ('rm', 'Romansh'),
        ('rn', 'Rundi'),
        ('ru', 'Russian'),
        ('sm', 'Samoan'),
        ('sg', 'Sango'),
        ('sa', 'Sanskrit'),
        ('sc', 'Sardinian'),
        ('sr', 'Serbian'),
        ('sn', 'Shona'),
        ('ii', 'Sichuan Yi; Nuosu'),
        ('sd', 'Sindhi'),
        ('si', 'Sinhala; Sinhalese'),
        ('sk', 'Slovak'),
        ('sl', 'Slovenian'),
        ('so', 'Somali'),
        ('st', 'Sotho, Southern'),
        ('es', 'Spanish; Castilian'),
        ('su', 'Sundanese'),
        ('sw', 'Swahili'),
        ('ss', 'Swati'),
        ('sv', 'Swedish'),
        ('tl', 'Tagalog'),
        ('ty', 'Tahitian'),
        ('tg', 'Tajik'),
        ('ta', 'Tamil'),
        ('tt', 'Tatar'),
        ('te', 'Telugu'),
        ('th', 'Thai'),
        ('bo', 'Tibetan'),
        ('ti', 'Tigrinya'),
        ('to', 'Tonga (Tonga Islands)'),
        ('ts', 'Tsonga'),
        ('tn', 'Tswana'),
        ('tr', 'Turkish'),
        ('tk', 'Turkmen'),
        ('tw', 'Twi'),
        ('ug', 'Uighur; Uyghur'),
        ('uk', 'Ukrainian'),
        ('ur', 'Urdu'),
        ('uz', 'Uzbek'),
        ('ve', 'Venda'),
        ('vi', 'Vietnamese'),
        ('vo', 'Volapuk'),
        ('wa', 'Walloon'),
        ('cy', 'Welsh'),
        ('fy', 'Western Frisian'),
        ('wo', 'Wolof'),
        ('xh', 'Xhosa'),
        ('yi', 'Yiddish'),
        ('yo', 'Yoruba'),
        ('za', 'Zhuang; Chuang'),
        ('zu', 'Zulu')
    )
    CONTINENT = (
        ('Global', 'Global'),
        ('Africa', 'Africa'),
        ('Antarctica', 'Antarctica'),
        ('Asia', 'Asia'),
        ('Oceania', 'Oceania'),
        ('Europe', 'Europe'),
        ('North America', 'North America'),
        ('South America', 'South America')
    )

    name = models.CharField(max_length=200)
    shortname = models.CharField(max_length=200)
    online_link = models.TextField(null=True)
    description = models.TextField(null=True)
    provided_information = models.TextField(blank=True)
    category = models.ManyToManyField(Category, blank=True)
    dataset_language = models.CharField(max_length=20, choices=LANG_CODES, default="en", blank=True, help_text="Language of the provided data")
    geoss_datasource_id = models.TextField(blank=True, null=True)
    continent = models.CharField(max_length=30, choices=CONTINENT, blank=True)
    country = models.ManyToManyField(Country, blank=True)
    region= models.ForeignKey(Region, related_name="external_region", verbose_name="Region", blank=True, null=True)

    class Meta:
        ordering = ['name']

    def __unicode__(self):
        return u"%s" %(self.name)

    def indexing(self):

        countries = []
        for country in Country.objects.filter(id=self.id):
            countries.append(country.name)

        region = ""
        region_id = ""
        if self.region:
            region = self.region.name
            region_id = self.region.id

        obj = ExternalDatabaseIndex(
            meta={'id': self.id},
            name = self.name,
            category="external",
            provided_information = self.provided_information,
            description = self.description,
            link = self.online_link,
            continent = self.continent,
            country = countries,
            region = region,
            region_id = region_id
        )
        print obj
        obj.save()
        return obj.to_dict(include_meta=True)

class ExternalLayer(Layer):
    datasource = models.ForeignKey(ExternalDatabase, related_name="layer_datasource", verbose_name="External Database", blank=True, null=True)

    def __unicode__(self):
        return u"%s" %(self.title)

    def indexing(self):

        topic_cats = []
        for topic_cat in self.topicCategory.all():
            res = ISOcodelist.objects.get(pk=topic_cat.id)
            topic_cats.append(res.identifier)

        keywords = []
        for keyword in KeywordInline.objects.filter(layer=self.id):
            keywords.append(keyword.keyword)

        contact_name = []
        contact_org = []
        for contact in self.point_of_contacts.all():
            res = Contact.objects.get(pk=contact.id)
            contact_name.append(contact.first_name + " " + contact.last_name)
            contact_org.append(contact.organisation)
        for meta_contact in self.meta_contacts.all():
            res = Contact.objects.get(pk=meta_contact.id)
            contact_name.append(meta_contact.first_name + " " + meta_contact.last_name)
            contact_org.append(meta_contact.organisation)

        extent = {
            "type": "Polygon",
            "coordinates": [[[self.west,self.north],[self.east,self.north],[self.east,self.south],[self.west,self.south],[self.west,self.north]]]
        }

        obj = LayerIndex(
            meta={'id': self.id},
            title=self.title,
            category="external",
            description=self.abstract,
            topiccat=topic_cats,
            keywords=keywords,
            contact_name=contact_name,
            contact_org=contact_org,
            date_begin = self.date_begin,
            date_end = self.date_end,
            lineage=self.meta_lineage,
            geom = extent
        )
        print obj
        obj.save()
        return obj.to_dict(include_meta=True)


class Image(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    copyright = models.CharField("Copyright / Owner", max_length=200, blank=True)
    date = models.DateField (blank=True, null=True)
    image = ImageWithThumbsField(upload_to='images/',  sizes=((125,125), (52, 52), (1300,1000), (1000, 1300)))
    region = models.ForeignKey(Region, related_name="image_region", verbose_name="Region")

    def __unicode__(self):
        return u"%s" %(self.name)

    @property
    def image_tag(self):
        return format_html('<img src="{}" />'.format(self.image.url_125x125))

    @property
    def image_size(self):
        suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
        size = int(self.image.size)
        if size == 0: return '0 B'
        i = 0
        while size >= 1024 and i < len(str(size)) - 1:
            size /= 1024.
            i += 1
        f = ('%.2f' % size).rstrip('0').rstrip('.')
        return '%s %s' % (f, suffixes[i])


class Video(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    copyright = models.CharField("Copyright / Owner", max_length=200, blank=True)
    date = models.DateTimeField(blank=True, null=True)
    source = models.CharField("Source", max_length=30, choices=(('YouTube', 'YouTube'), ('Upload', 'Upload')))
    link = models.CharField("Link to external video", max_length=200, blank=True, null=True)
    thumb_link = models.CharField("Link to external thumbnail", max_length=200, blank=True, null=True)
    youtube_id = models.CharField("YouTube ID", max_length=20, blank=True, null=True)
    youtube_cat = models.IntegerField(blank=True, null=True)
    region = models.ForeignKey(Region, related_name="video_region", verbose_name="Region")

    categories = dict()
    categories[2] = 'Cars & Vehicles'
    categories[23] = 'Comedy'
    categories[27] = 'Education'
    categories[24] = 'Entertainment'
    categories[1] = 'Film & Animation'
    categories[20] = 'Gaming'
    categories[26] = 'How-to & Style'
    categories[10] = 'Music'
    categories[25] = 'News & Politics'
    categories[29] = 'Non-profits & Activism'
    categories[22] = 'People & Blogs'
    categories[15] = 'Pets & Animals'
    categories[28] = 'Science & Technology'
    categories[17] = 'Sport'
    categories[19] = 'Travel & Events'

    @property
    def youtube_cat_name(self):
        return self.categories[self.youtube_cat]

    @property
    def image_tag(self):
        return format_html('<a href="{}" target="_blank"><img src="{}" width="200" border="0" /></a>'.format(self.link,
                                                                                                             self.thumb_link))

    def __unicode__(self):
        return self.name


class StoryLineFeature(models.Model):
    name = models.CharField(max_length=200)
    geom = models.PolygonField()
    description = models.TextField(blank=True)

    def __unicode__(self):
        return self.name


class StoryLine(models.Model):
    title = models.CharField(max_length=250)
    description = models.TextField(null=True, blank=True)
    authors = models.TextField(null=True, blank=True)
    region = models.ForeignKey(Region, null=True)
    link_to_product = models.BooleanField(default="False",
                                          help_text="Storyline will be linked to a product instead of a wetland")
    story_line_file_name = models.CharField(max_length=50, blank=True, null=True, help_text="File name for download")
    story_line_file = models.FileField("Storyline file", upload_to='downloads', null=True, blank=True,
                                       help_text="Upload storyline as pdf file")
    active = models.BooleanField(default=False)

    def __unicode__(self):
        return u"%s" % (self.title)


class StoryLinePart(models.Model):
    headline = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image_name = models.CharField(max_length=200, null=True, blank=True)
    image_description = models.TextField(null=True, blank=True)
    image_copyright = models.CharField("Copyright / Owner", max_length=200, blank=True)
    image_date = models.DateField(blank=True, null=True)
    image = ImageWithThumbsField(upload_to='images/',
                                 sizes=((125, 125), (200, 300), (300, 200), (600, 400), (400, 600)), null=True,
                                 blank=True,
                                 help_text="To avoid cutting off parts of your image please resize it in advance. Right position: max. 300px width; Bottom max. 600px. If you upload a GIF please make sure the size is not higher than 500kb")
    image_position = models.CharField(max_length=20, choices=(("right", "right"), ("bottom", "bottom")),
                                      default="right")
    region = models.ForeignKey(Region,
                                help_text="Plaese click - Save and continue editing - to update the layer lists below")
    product_layer = models.ManyToManyField(Layer, blank=True)
    indicator_layer = models.ManyToManyField(Layer, blank=True, related_name="indicator_layer")
    external_layer = models.ManyToManyField(Layer, blank=True, related_name="external_layer")
    features = models.ManyToManyField(StoryLineFeature, blank=True)
    remove_layer = models.BooleanField(default="False", help_text="Remove added layer on the next step")
    west = models.FloatField("BBOX west coordinate", blank=True, null=True, help_text="e.g. -5,3")
    east = models.FloatField("BBOX east coordinate", blank=True, null=True, help_text="e.g. 10,5")
    north = models.FloatField("BBOX north coordinate", blank=True, null=True, help_text="e.g. 8,2")
    south = models.FloatField("BBOX south coordinate", blank=True, null=True, help_text="e.g. -3,9")

    def __unicode__(self):
        return u"%s" % (self.wetland.name + "_" + self.headline)

    @property
    def image_tag(self):
        if not self.image:
            return ""
        return format_html('<img src="{}" />'.format(self.image.url_125x125))

    @property
    def image_url_125(self):
        if not self.image:
            return ""

        return (self.image.url_125x125)

    def image_url_300(self):
        if not self.image:
            return ""

        # use original image if width is or smaller than 300
        if self.image.width <= 300:
            return self.image.url

        # use original image if size is samller than 200kb and width <= 600
        if self.image.width <= 300:
            return self.image.url

        # detect landscape or portrait format
        if self.image.width > self.image.height:
            return self.image.url_300x200
        else:
            return self.image.url_200x300

    def image_url_600(self):
        if not self.image:
            return ""

        # use original image if width is or smaller than 600
        if self.image.width <= 600:
            return self.image.url

        # detect landscape or portrait format
        if self.image.width > self.image.height:
            return self.image.url_600x400
        else:
            return self.image.url_400x600


class StoryLineInline(models.Model):
    order = models.PositiveIntegerField(default=0)
    story_line_part = models.ForeignKey(StoryLinePart, related_name='story_line_parts')
    story_line = models.ForeignKey(StoryLine, related_name='story_line')

    def __unicode__(self):
        return self.story_line_part.headline

    class Meta:
        ordering = ['order']


class SatdataLayer(Layer):
    region = models.ForeignKey(Region, related_name="layer_satdata", verbose_name="Region", blank=True, null=True)

    def __unicode__(self):
        return u"%s" %(self.title)