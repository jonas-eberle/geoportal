import os, stat
import psycopg2
from osgeo import osr
import glob
import shutil
import subprocess
import datetime
import json
import itertools
import pysftp
import xml.etree.ElementTree as ET
from django.conf import settings
from django.template import Engine, Context
from multiprocessing import Process
import multiprocessing as mp
settings.configure()



#requirements: postgis 2.2 and GEOS 3.5.0
# apt-get install django
# apt-get install python-gdal (?)
# pip install xlwt
# pip install pysftp


#CREATE EXTENSION postgis;
# psql -U swos -d indicator -f /tmp/sows_test.sql

# sftp -r franziska.zander@swos-data.jena-optronik.de:/products/SWOS_sites/Montenegro-Albania_Skadarsko/LULC /opt/swos/data/Montenegro-Albania_Skadarsko
# /usr/bin/python /opt/swos/indicator.py
#get_data_from_swos_server(Spain_Fuente-de-Piedra)

data = []

sftp_folder = '/products/SWOS_sites'
sftp_user = 'franziska.zander'
sftp_url = 'swos-data.jena-optronik.de'
sftp_password = 'Wz21mB#=YAwn!B'
loc_folder = '/home/franzi/data/'

db_passwd = "swos"
db_user = "swos"
db_port = 5432
db_name = "indicator"

conn = psycopg2.connect("dbname=" + db_name + " user=" + db_user + " password=" + db_passwd + " port=" + str(db_port))

data_dir = "/home/franzi/data/"
delete_old_folder = True
max_shp_size = 200000000
path_template = '/home/franzi/swos/indicator_template.xml'

# replace: add srid for each "Greece_" site
indicator_sites = ({'name': "Spain_Fuente-de-Piedra", 'calc': 0,'srid': '', 'no_dissolve': 0, 'no_swd':''},  # ok
                   {'name': "Sweden_Koppangen", 'calc': 0, 'no_dissolve': 0, 'no_swd':''},  # geht
                   {'name': "France_Camargue", 'calc': 1, 'no_dissolve': 0, 'no_swd':1},  # SWD leoschen!
                   {'name': "Egypt_Burullus", 'calc':0, 'no_dissolve': 1, 'no_swd':''},  # ohne intersection
                   {'name': "Spain_Guadalhorce", 'calc':0, 'srid': '', 'no_dissolve': 0, 'no_swd':''},  # geht

                   {'name': "Jordan_Azraq", 'calc': 0, 'srid': '', 'no_dissolve': 1, 'no_swd':0}, ## SWD geloescht - to big
                   {'name': 'Montenegro-Albania_Skadarsko', 'calc': 1, 'sird': '', 'no_dissolve': 0, 'no_swd':1}, # SWD geloescht - to big

        ##           {'name': 'Tanzania_Kilombero', 'calc': 0, 'srid': '', 'no_intersection': 1, 'no_dissolve': 0}, # too big # nicht

                   {'name': "Algeria_Kala", 'calc': 0, 'srid': '', 'no_dissolve': 0, 'no_swd':''},# ok
                   {'name': "Algeria_Oued-Sebaou", 'calc': 0, 'srid': '', 'no_dissolve': 0, 'no_swd':''}, # ok
                   {'name': "Estonia_Matsalu", 'calc': 0, 'srid': '', 'no_dissolve': 0, 'no_swd':''}, # ok
                   {'name': "Finland_Sammuttijaenkae", 'calc':0, 'srid': '', 'no_dissolve': 0, 'no_swd':''}, # ok
                   {'name': "France_Palavasiens", 'calc': 0, 'srid': '', 'no_dissolve': 0, 'no_swd':''},# ok

                   {'name': "Greece_Axios", 'calc': 0, 'srid': 3035, 'no_dissolve': 0, 'no_swd':''},  # ok
                   {'name': "Greece_Eastern-Macedonia", 'calc': 0, 'srid': 3035, 'no_dissolve': 1, 'no_swd':1},  # # SWD geloescht - to big

                   {'name': "Greece_Amvrakikos", 'calc': 0, 'srid': 3035, 'no_dissolve': 0, 'no_swd':''}, # ok
                   {'name': "Greece_Evros", 'calc': 0, 'srid': 3035, 'no_dissolve': 0, 'no_swd':''}, # ok

                   {'name': "Greece_Kerkini", 'calc': 0, 'srid': 3035, 'no_dissolve': 0, 'no_swd':''}, # ok
                   {'name': "Greece_Kotychi", 'calc': 0, 'srid': 3035, 'no_dissolve': 0, 'no_swd':''}, # ok

                   {'name': "Greece_Messolonghi", 'calc': 0, 'srid': 3035, 'no_dissolve': 0, 'no_swd':''}, #ok
                   {'name': "Greece_Prespa", 'calc': 0, 'srid': 3035, 'no_dissolve': 0, 'no_swd':''}, # ok
                   {'name': "Greece_Volvi", 'calc': 0, 'srid': 3035, 'no_dissolve': 0, 'no_swd':''}, # ok

                   {'name': "Italy_Fucecchio", 'calc': 0, 'srid': '', 'no_dissolve': 0, 'no_swd':''}, # ok
                   {'name': "Italy_Pesa-valley", 'calc': 0, 'srid': '', 'no_dissolve': 0, 'no_swd':''},# EPSG falsch no
                 #  {'name': "Kenya_Olbolossat", 'calc': 0, 'srid': '', 'no_dissolve': 0, 'no_swd':''}, # FAO
                 #  {'name': "Morocco_Oued-Sebou", 'calc': 0, 'srid': '', 'no_dissolve': 0, 'no_swd':''}, # no LULC folder

                   {'name': "Senegal_Lower-Senegal", 'calc': 0, 'srid': '', 'no_intersection': 1, 'no_dissolve': 1, 'no_swd':''},#  SWD prj # nicht kaputt Fehler -> nicht neu!
                   {'name': "Netherlands_Wadden", 'calc': 0, 'srid': '', 'no_dissolve': 0, 'no_swd':''}, # XML missing
                   {'name': "Sweden_Skogaryd", 'calc': 0, 'srid': '', 'no_dissolve': 0, 'no_swd':''}, # ok

                   {'name': "Sweden_Tavvavuoma", 'calc': 0, 'srid': '', 'no_dissolve': 0, 'no_swd':''}, # ok
                   {'name': "Sweden_Vattenrike", 'calc': 0, 'srid': '', 'no_dissolve': 0, 'no_swd':''}, # ok
                 #  {'name': "Tunisia_Ghar-el-Melh", 'calc': 0, 'srid': '', 'no_dissolve': 0, 'no_swd':''}, # no LULC folder
                   {'name': "United-Arab-Emirates_Ras-Al-Khor", 'calc': 0, 'srid': '', 'no_dissolve': 1, 'no_swd':''}, # geht nicht
                   {'name': "United-Arab-Emirates_Hatta-Mountain", 'calc':1, 'srid': '', 'no_dissolve': 1, 'no_swd':1}  # ok SWD loeschen!
                   )
def put_data_swos_server(site):
    srv = pysftp.Connection(host=sftp_url, username=sftp_user, password=sftp_password)
    try:
        srv.chdir(sftp_folder + '/' +site+ '/IND')  # Test if remote_path exists
    except IOError:
        srv.mkdir(sftp_folder + '/' +site+ '/IND')  # Create remote_path
    srv.put_d(loc_folder+site+'/IND/', sftp_folder + '/' +site+ '/IND',  preserve_mtime=True)

def get_data_swos_server(site):
    srv = pysftp.Connection(host="swos-data.jena-optronik.de", username="franziska.zander", password="Wz21mB#=YAwn!B")

def reloadFTP():
    cnopts = pysftp.CnOpts()
    cnopts.hostkeys = None
    sftp = pysftp.Connection(sftp_url, username=sftp_user, password=sftp_password, cnopts=cnopts)
    sftp.chdir(sftp_folder)
    return sftp

def check_files(base, fileexts, sftp):
    files = []
    for ext in fileexts:
        try:
            info = sftp.lstat(base + ext)
            files.append(os.path.basename(base) + ext)
        except IOError:
            print '%s does not exists' % (base + ext)
    return files

def list_data(wetland, product, filename, sftp):
    basename, fileext = os.path.splitext(filename)
    files = []
    if fileext == '.tif':
        files = check_files(os.path.join(wetland, product, basename),
                            ['.tif.aux.xml', '.tfw', '.xml'], sftp)
    if fileext == '.shp':
        files = check_files(os.path.join(wetland, product, basename),
                            ['.dbf', '.prj', '.sbn', '.sbx', '.shx', '.xml'], sftp)

    return files

def get_data(wetland, product, filename, sftp):
    loc_path = os.path.join(loc_folder, wetland, product)
    if not os.path.exists(loc_path):
        os.makedirs(loc_path)
    os.chdir(loc_path)
    print os.path.join(wetland, product, filename)
    if product == 'WQ':
        if not os.path.exists(filename):
            os.makedirs(filename)
        sftp.get_d(os.path.join(wetland, product, filename), filename, preserve_mtime=True)
    else:
        sftp.get(os.path.join(wetland, product, filename), preserve_mtime=True)

def download_data(wetland, product, filename, sftp):
    # 0) preparations
    loc_path = os.path.join(loc_folder, wetland, product, filename)
    print 'loc_path = ' + loc_path

    loc_file = os.path.basename(loc_path)
    print 'loc_file = ' + loc_file
    base, ext = os.path.splitext(loc_file)

    layername = os.path.splitext(filename)[0]
    print 'layername = ' + layername

    # 3) search for other files (tif.aux.xml, .dbf, .xml, etc.)
    files = list_data(wetland, product, filename, sftp)
    files.append(filename)

    # 4) download files
    for f in files:
        print 'download %s' % f
        get_data(wetland, product, f, sftp)

    return layername

def download_files():

    sftp = reloadFTP()

    # only locally existing wetland directories need to be checked for updates
    data_rem = dict()
    products_all = ['SWD', 'LULC']
    wetlands_rem = sftp.listdir('.')

    for wetland in wetlands_rem:
        # Check every wetland folder for additional products
        # products_rem = sftp.listdir(wetland)
        products_rem = [fname.filename for fname in sftp.listdir_attr(wetland) if
                        stat.S_ISDIR(fname.st_mode) and fname.filename in products_all]
        print products_rem

        products = dict()

        for product in products_rem:
            files = [name for name in sftp.listdir('/'.join([wetland, product])) if
                     os.path.splitext(name)[1] in ['.shp'] or  ("TD_OP" in name and os.path.splitext(name)[1] in ['.tif'])]

            if len(files) == 0:
                continue

            products[product] = files


        if len(products) > 0:
            data_rem[wetland] = products

    import json

    print(json.dumps(data_rem, indent=2))

    for wetland in data_rem:
        products = data_rem[wetland]

        for product in products:
            datasets = products[product]

            for filename in datasets:
                print 'wetland: ' + wetland
                print 'product: ' + product
                print 'filename: ' + filename

                # 1) download and ingest data to geoserver
                layername = download_data(wetland, product, filename, sftp)

    #data = srv.listdir('.')
     #   print data

def esriprj2standards(shapeprj_path):
   prj_file = open(shapeprj_path, 'r')
   prj_txt = prj_file.read()
   srs = osr.SpatialReference()
   srs.ImportFromESRI([prj_txt])
   #print 'Shape prj is: %s' % prj_txt
   #print 'WKT is: %s' % srs.ExportToWkt()
   #print 'Proj4 is: %s' % srs.ExportToProj4()
   srs.AutoIdentifyEPSG()
   #print 'EPSG is: %s' % srs.GetAuthorityCode(None)
   return srs.GetAuthorityCode(None)

def get_epsg(file, site):
    epsg = esriprj2standards(file[:-3] + "prj")
    print epsg
    type(epsg)

    if epsg != None:
        print "EPSG found"
    else:
        print "No EPSG found! - set to provided EPSG: " + str(site["srid"])
        if site["srid"] == "":
            print "Error: No EPSG provided"
            return False
        epsg = str(site["srid"])
    return epsg

def polygonize_swd_products(site):

    swd_files = []
    swd_metadata = []
    for name in glob.glob(data_dir + site["name"] + '/SWD/*_TD_OP_*.tif'):
        swd_files.append(name)
        product_name = os.path.basename(name)[:-4]

        new_file = data_dir + site["name"] + '/SWD/' + product_name + ".shp"

        if not os.path.exists(new_file):
            p = subprocess.Popen(
                'gdal_polygonize.py -f "ESRI Shapefile" ' + name + " " + new_file,
                shell=True, stdout=subprocess.PIPE)
            print p.communicate()

        swd_metadata.append({"orig_file": name, "file": new_file })
    return swd_metadata

def drop_exist(name):
    cur = conn.cursor()
    try:
        cur.execute("DROP TABLE IF EXISTS " + '"' + name + '"')
        conn.commit()
        result = cur.fetchall()
    except psycopg2.Error as e:
        pass
        e.pgcode
        print e.pgerror
    cur.close()

def execute_sql(query):
    cur = conn.cursor()
    try:
        cur.execute(query)
        # count = cur.fetchone()
        # print count[0]
        conn.commit()
    except psycopg2.Error as e:
        pass
        e.pgcode
        print e.pgerror
    cur.close()

def execute_sql_return(query):
    cur = conn.cursor()
    try:
        cur.execute(query)
        conn.commit()
        result = cur.fetchall()
    except psycopg2.Error as e:
        pass
        e.pgcode
        print e.pgerror
    cur.close()

    return result

def get_col_names(table):
    return execute_sql_return("SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME=" + '\'' + table + '\'' " AND COLUMN_NAME NOT IN (\'geometry\') ORDER BY ORDINAL_POSITION")

def get_col_type(table, column):
    return execute_sql_return("SELECT data_type FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME=" + '\'' + table + '\'' " AND COLUMN_NAME = \'"+ column +"\' ORDER BY ORDINAL_POSITION")

def find_table(site, type):
    return  execute_sql_return("SELECT distinct(table_name) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME like " + '\'' + site["name"].lower() + "_" + type + '%\'' " order by table_name DESC LIMIT 1")

def add_clc_column(table):
    execute_sql("alter table " + '\"' + table + '\"' " add column clc_code numeric")
    execute_sql("update " + '\"' + table + '\"' " set clc_code=greatest(cast(clc_l1 as numeric), cast(clc_l2 as numeric), cast(clc_l3 as numeric), cast(clc_l4 as numeric))")

def add_maes_column(table):
    execute_sql("alter table " + '\"' + table + '\"' " add column maes_code numeric")
    execute_sql("update " + '\"' + table + '\"' " set maes_code=greatest(maes_l1, maes_l2, maes_l3, maes_l4)")

def rename_geometry_column(table):
    execute_sql("alter table " + '\"' + table + '\"' " RENAME COLUMN geom TO geometry ")

def add_column_swd(table, column):
    execute_sql("alter table " + '\"' + table + '\"' " add column ind_code numeric")
    execute_sql("update " + '\"' + table + '\"' " set ind_code=" + column + "*10 + dn")

def dissolve_and_subdivide(table, sensor_date):
    execute_sql("SELECT indicator_code_" + sensor_date +" , st_makevalid(St_subdivide(ST_UNION(geometry))) as geometry into " + '\"' + table +"_dissolved" + '\"'  + " from " + '\"' + table + '\"' "group by indicator_code_" + sensor_date )

def subdivide(table, sensor_date):
    execute_sql("SELECT indicator_code_" + sensor_date +" , st_makevalid(St_subdivide(geometry)) as geometry into " + '\"' + table +"_dissolved" + '\"'  + " from " + '\"' + table + '\"'  )


def dissolve_and_subdivide_intersection(table, cols):
    execute_sql("SELECT " + cols +" , st_makevalid(St_subdivide(ST_UNION(geometry))) as geometry into " + '\"' + table +"_dissolved" + '\"'  + " from " + '\"' + table + '\"' "group by " + cols )

def dissolve_intersection_final(table, cols):
    execute_sql("SELECT " + cols +" , ST_UNION(geometry) as geometry into " + '\"' + table +"_final" + '\"'  + " from " + '\"' + table + '\"' "group by " + cols )

def final_intersection(table, cols):
    execute_sql( "SELECT " + cols + " , geometry into " + '\"' + table + "_final" + '\"' + " from " + '\"' + table + '\"' )


def dissolve_makvalid_swd(table):
    execute_sql("SELECT dn , st_makevalid(St_subdivide(geometry)) as geometry into " + '\"' + table + "_dissolved" + '\"' + " from " + '\"' + table + '\"')

def get_extent(table):
    return execute_sql_return("SELECT substring(left(St_astext(ST_Extent(ST_Transform( geometry, 4326 ))),-2),10) from" + '\"' + table + '\"')

def create_index(table):
    #execute_sql("DROP INDEX " + '\"' + table + "_gix" '\"')
    execute_sql("CREATE INDEX " + '\"' + table[15:] + "_gix" '\"' " ON " + '\"' + table + '\"' " USING GIST (geometry);")

def add_name_col(table, col_cd, col_name):
    execute_sql("ALTER TABLE  " + '\"' + table +  '\"' " ADD COLUMN " + '\"' + col_name + '\"' " character varying;")
    execute_sql("UPDATE " + '\"' + table + '\"' " SET " + '\"' + col_name + '\"' " = indicator_code.name FROM indicator_code WHERE indicator_code.indicator_code = cast("+ '\"' + col_cd + '\"' + " as integer);")

def check_empty_ind_code(table, sensor_date):
    return execute_sql_return("SELECT count(*) from" + '\"' + table + '\"' "where indicator_code_" + sensor_date +  " is NULL")

def import_file(file, epsg, product_name):
    # create sql
    p = subprocess.Popen(
        "shp2pgsql -d -s " + epsg + " " + file + " " + product_name + " indicator > /tmp/" + product_name + ".sql",
        shell=True, stdout=subprocess.PIPE)
    print p.communicate()

    # import sql
    p = subprocess.Popen("PGPASSWORD=swos psql -U swos -p 5432 -d indicator -f /tmp/" + product_name + ".sql",
                         shell=True, stdout=subprocess.PIPE)
    p.communicate()  # wait until finished!

def check_code(table):
    return execute_sql_return("SELECT substring(left(St_astext(ST_Extent(ST_Transform( geometry, 4326 ))),-2),10) from" + '\"' + table + '\"')

def repair_and_add_ind_code(type,product_name, sensor_date, new_product_name ):

    # check isValid()
    # cur = conn.cursor()
    # try:
    #    cur.execute("SELECT count(*) from " + '"' + product_name.lower() + '"' + " Where st_isValid(geom) is false")
    #    count = cur.fetchone()
    #    print count[0]
    # except psycopg2.Error as e:
    #    pass
    #    e.pgcode
    #    print e.pgerror
    # cur.close()

    # repair if necessary and join with indicator code
    # if count[0] > 0:
    #    print "repair"
    #    geom = "st_makevalid(geom) as \"geometry\""
    # else:
    #    geom = "geom as \"geometry\""

    if type == "RAMSAR-CLC":
        data_type = get_col_type(product_name.lower(), "clc_code")
        if len(data_type) == 0:
            print "No CLC code column found"
            add_clc_column(product_name.lower())
            data_type = get_col_type(product_name.lower(), "clc_code")

        if data_type[0][0] == "numeric":
            join = '" left join clc_indicator on cast(' '"' + product_name.lower() + '".clc_code as integer)=clc_indicator.clc_code where ' + '"' + product_name.lower() + '".clc_code != ' + "'" + "0" + "'"
        else:
            join = '" left join clc_indicator on cast(' '"' + product_name.lower() + '".clc_code as integer)=clc_indicator.clc_code where ' + '"' + product_name.lower() + '".clc_code != ' + "'" + "no data" + "'" +" and " + '"' + product_name.lower() + '".clc_code != ' + "'" + "0" + "'"
    if type == "MAES":
        data_type = get_col_type(product_name.lower(), "maes_code")
        if len(data_type) == 0:
            print "No MAES code column found"
            add_maes_column(product_name.lower())
            data_type = get_col_type(product_name.lower(), "maes_code")

        if data_type[0][0] == "numeric":
            join = '" left join maes_indicator on cast(' '"' + product_name.lower() + '".maes_code as integer)=maes_indicator.maes_code where ' + '"' + product_name.lower() + '".maes_code != ' + "'" + "0" + "'"
        else:
            join = '" left join maes_indicator on cast(' '"' + product_name.lower() + '".maes_code as integer)=maes_indicator.maes_code where ' + '"' + product_name.lower() + '".maes_code != ' + "'" + "no data" + "'" +" and " + '"' + product_name.lower() + '".maes_code != ' + "'" + "0" + "'"

    execute_sql(
        "SELECT st_makevalid(geom) as \"geometry\",  indicator_code as indicator_code_" + sensor_date +  " into " + '"' + new_product_name + '"' + " from " + '"' + product_name.lower() + join + " and st_isvalid(geom) is false UNION SELECT geom as \"geometry\",  indicator_code as indicator_code_" + sensor_date + " from " + '"' + product_name.lower() + join + " and st_isvalid(geom) is true")
   # drop_exist(new_product_name + '_2')
   # execute_sql(
   #     "SELECT st_makevalid(St_subdivide(geom)) as \"geometry\",  clc_indicator.indicator_code as indicator_code_" + sensor_date + " into " + '"' + new_product_name + '_2"' + " from " + '"' + product_name.lower() + join )
   # execute_sql(
   #     "SELECT st_makevalid(St_subdivide(ST_UNION(geometry))) as \"geometry\",  indicator_code_" + sensor_date + " into " + '"' + new_product_name + '"' + " from " + '"' + new_product_name + "_2" + '"' + " group by indicator_code_" + sensor_date)

def extract_metadata(xml_file):

    if not os.path.exists(xml_file):
        print "No XML found for:" + xml_file
        return None

    namespaces = {'gmd':"http://www.isotc211.org/2005/gmd", 'gco':"http://www.isotc211.org/2005/gco",'gml':"http://www.opengis.net/gml"}
    tree = ET.parse(xml_file)
    root = tree.getroot()

    shape_data = {}

    # Metadata Contact
    #shape_data["meta_contact"] = []
    #for meta_contacts in root.findall('.//gmd:contact', namespaces):
    #    org_name = meta_contacts.find(".//gmd:organisationName", namespaces)
    #    org_email = meta_contacts.find(".//gmd:electronicMailAddress", namespaces)
    #    shape_data["meta_contact"].append({'name': org_name[0].text, 'email': org_email[0].text})

    # Point of contact
    shape_data['point_of_contact'] = []
    for point_of_contacts in root.findall(
            './/gmd:identificationInfo/gmd:MD_DataIdentification/gmd:pointOfContact/gmd:CI_ResponsibleParty',
            namespaces):
        org_name_contact = point_of_contacts.find("./gmd:organisationName/gco:CharacterString", namespaces)
        org_email_contact = point_of_contacts.find(".//gmd:electronicMailAddress/gco:CharacterString", namespaces)
        # role --> not saved in the editor
        shape_data["point_of_contact"].append({'name': org_name_contact.text, 'email': org_email_contact.text})

    #will only find and extract the first temporal extent !
    date_begin = root.find('.//gmd:EX_TemporalExtent//gml:beginPosition', namespaces).text
    date_end = root.find('.//gmd:EX_TemporalExtent//gml:endPosition', namespaces).text
    date_begin = datetime.datetime.strptime(date_begin, '%Y-%m-%d').date()
    date_end = datetime.datetime.strptime(date_end, '%Y-%m-%d').date()
    shape_data['date_begin'] = str(date_begin)
    shape_data['date_end'] = str(date_end)

    for dates in root.findall('.//gmd:MD_DataIdentification/gmd:citation/gmd:CI_Citation/gmd:date/gmd:CI_Date',
                              namespaces):
        shape_data['date_' + dates.find('.//gmd:CI_DateTypeCode', namespaces).get('codeListValue')] = str(
            datetime.datetime.strptime(dates.find('.//gmd:date/gco:Date', namespaces).text, '%Y-%m-%d').date())

    if root.find('.//gmd:MD_Resolution/gmd:distance/gco:Distance', namespaces) != None:
        shape_data['resolution_distance'] = root.find('.//gmd:MD_Resolution/gmd:distance/gco:Distance', namespaces).text
        shape_data['resolution_unit'] = root.find('.//gmd:MD_Resolution/gmd:distance/gco:Distance', namespaces).get(
            "uom")

    shape_data["identifier"] = xml_file.split("/")[-1].split(".")[0]

    return shape_data

def add_metadata_xml(output_folder, table_name, procuct_name, epsg, file, metadata, indicator, full_area,  metadata_swd = False):
    now = datetime.datetime.now()

    #print file
    #print output_folder
    #print metadata

    ind_name = {}
    ind_name["IND"] = "classes"
    ind_name["IND-ALL"] = "classes"
    ind_name["WET-EXT"] = "Total Wetland Extent"
    ind_name["WET-EXT-NA"] = "Wetland Extent (artificial / natural)"
    ind_name["WET-EXT-VWR"] = "Wetland Extent (vegetated / open water bodies / river water bodies)"
    ind_name["OPEN-W-EXT"] = "Extent of Open Water"
    ind_name["WET-THREATS"] = "Status of Wetland Threats"
    ind_name["WET-CHANGE"] = "Wetland Extent Change"
    ind_name["WET-ART"] = "Wetland Artificialization"
    ind_name["WET-RESTORE"] = "Wetland Restoration"
    ind_name["IND-URB"] = "Urbanization"

    abstract = {}
    abstract["IND"] = ""
    abstract["IND-ALL"] = ""
    abstract["WET-EXT"] = "The Total Wetland Extent gives an overview about all areas detected as wetland habitats without further distinction of wetland categories (natural wetlands, artificial wetlands, vegetated wetlands, open water bodies and river water bodies). Comparing the total wetland extent over time can be used to monitor the trend."
    abstract["WET-EXT-NA"] = "The Wetland Extent (artificial / natural) specifies wetland habitats into the wetland categories natural and artificial wetlands. Here rice fields are considered as artificial wetlands."
    abstract["WET-EXT-VWR"] = "The Wetland Extent (vegetated / open water bodies / river water bodies) specifies wetland habitats into the wetland categories according to the SDG 6.6.1 definitions: vegetated wetlands (all wetland classes, flooded or not, and dominated by a dense vegetation cover), open water bodies (all open water bodies regarding LULC definitions and NOT in terms of flooding. It includes all significant inland standing body of freshwater completely surrounded by land but free of emerging vegetation) and river water bodies (all classes of water flowing in a definite course across an area of land, including its associated floodplains). Reporting indicators for these three definitions are computed separately and the sum represents the extent of Wetlands and Water-related ecosystems regarding the SDG 6.6.1."
    abstract["OPEN-W-EXT"] = "The Extent of Open Water is defined by the percentage of open water within the total wetland habitats extent at a specific point of time (a hydro-period). There are 4 classes defined: Wetland habitats with permanent open water, Wetland habitats with temporary open water, Wetland habitats never flooded, Flooded/inundated areas not wetland habitats."
    abstract["WET-THREATS"] = "The status of Wetland Threats summarize the importance of the threats on the wetland (Urbanization and Agriculture) and is defined by the total surface of urban and agriculture. Here wet meadows are considered as natural wetlands and rice fields as agricultural lands."
    abstract["WET-CHANGE"] = "The Wetland Extent change shows areas of in/decrease together with non-changed areas for all wetland habitats without further distinction of wetland categories (natural wetlands, artificial wetlands, vegetated wetlands, open water bodies and river water bodies) between two different references periods."
    abstract["WET-ART"] = "Wetland artificialization shows the total surface that has been converted from natural wetland classes to artificial wetland classes (except rice fields) and the conversion into rice."
    abstract["WET-RESTORE"] = "Wetland restoration shows the conversion from agriculture, urban or artificial wetland classes to natural wetland habitats between two different references periods."
    abstract["IND-URB"] = "Urbanization shows the conversion to urban classes between two different references periods."

    extent = get_extent(table_name)
    coords = extent[0][0].split(",")

    layer = {"north": coords[1].split(" ")[1], "south": coords[0].split(" ")[1], "east" : coords[2].split(" ")[0], "west" : coords[1].split(" ")[0]}
    layer["identifier"] = procuct_name
    layer["characterset"] = "MD_CharacterSetCode_utf8"
    layer["scope"] = {}
    layer["scope"]["identifier"] = "dataset"

    layer["meta_date"] = now.strftime("%Y-%m-%d")
    layer["dataset_epsg"] = epsg
    layer["title"] = procuct_name
    layer["date_creation"] = now.strftime("%Y-%m-%d") # current  date_publication / date_revision

    layer["point_of_contacts"] = []
    layer["point_of_contacts"].append({"organisation": "SWOS - Satellite-based Wetland Observation Service", "email":"Kathrin.Weise@jena-optronik.de" })
    layer["meta_contacts"] = [] # author FSU / SWOS
    layer["meta_contacts"].append({"organisation": "Friedrich-Schiller-University Jena, Department of Geography - Earth Observation", "email": "jonas.eberle@uni-jena.de"})
    layer["meta_contacts"].append({"organisation": "SWOS - Satellite-based Wetland Observation Service", "email":"Kathrin.Weise@jena-optronik.de" })

    layer["layer_constraints_cond"] = []
    layer["layer_constraints_cond"].append({"constraints_cond": "No conditions apply"})
    layer["layer_constraints_limit"] = []
    layer["layer_constraints_limit"].append({"constraints_limit": "No limitation"})
    layer["layer_conformity"] = []
    layer["layer_conformity"].append({"title": "COMMISSION REGULATION (EC) No 1205/2008 of 3 December 2008 implementing Directive 2007/2/EC of the European Parliament and of the Council as regards metadata", "date": "2008-12-04", "date_type":{"identifier": "publication"} })

    #layer.resolution_distance -> unknown
    #layer.equi_scale

    layer["representation_type"] = {}
    layer["representation_type"]["identifier"] = "vector"
    layer["topicCategory"] = []
    layer["topicCategory"].append({"identifier":"inlandWater"})
    layer["topicCategory"].append({"identifier": "environment"})

    #extract from original XML!
    print type(metadata)

    source = []
    layer["date_begin"]  = "9000"
    layer["date_end"] = "00000"
    layer["meta_lineage"] = ""
    swd_product = ""
    swd_prodcut_meta = ""
    swd_product_details = ""
    if (metadata_swd != False):
        swd_product = " and Surface Water Dynamics (SWD) temporal dynamics (TD) "
        swd_prodcut_meta = " For the SWD product optical satellite image(s) " \
                                "between " + metadata_swd["date_begin"] + " and " + metadata_swd["date_end"] + " have been used with a spatial resolution of " + metadata_swd['resolution_distance'] + " " + metadata_swd['resolution_unit'] + ". " \
                                "It was produced by " + metadata_swd["point_of_contact"][0]["name"] + " (email:" + metadata_swd["point_of_contact"][0]["email"] + ") within the framework of SWOS (Satellite-based Wetland Observation System, www.swos-service.eu)" \
                                "and is available under the identifier " + metadata_swd["identifier"] + " in the SWOS / GEO-Wetlands Community Portal (http://portal.swos-service.eu). "
        swd_product_details = "(" + metadata_swd['resolution_distance'] + " " + metadata_swd['resolution_unit'] + ", " + metadata_swd["date_begin"] + " - " + metadata_swd["date_end"] + ")"

        source.append({"id": metadata_swd["identifier"], "resolution_distance": metadata_swd["resolution_distance"],"resolution_unit": metadata_swd["resolution_unit"]})

    country_name = output_folder.split("/")[-2].split("_")
    if type(metadata) is dict:
        layer["date_begin"] = metadata["date_begin"]
        layer["date_end"] = metadata["date_end"]
        if layer["date_end"] == "00000":
            layer["date_end"] = layer["date_begin"]
        layer["meta_lineage"] = "The indicator was automatically delineated based on a Land Use Land Cover (LULC)"+ swd_product +" classification of " + country_name[1].replace("-", " ") + " (" + country_name[0].replace("-", " ") + ") for the year/date "+ procuct_name.split("_")[-1] +" " \
                                "using the "+procuct_name.split("_")[2] +" nomenclature. For the LULC product "+procuct_name.split("_")[3].replace("L", "Landsat ").replace("S", "Sentinel ") +" satellite image(s) " \
                                "between " + metadata["date_begin"] + " and " + metadata["date_end"] + " have been used with a spatial resolution of " + metadata['resolution_distance'] + " " + metadata['resolution_unit'] + ". " \
                                "It was produced by " + metadata["point_of_contact"][0]["name"] + " (email:" + metadata["point_of_contact"][0]["email"] + ") within the framework of SWOS (Satellite-based Wetland Observation System, www.swos-service.eu)" \
                                "and is available under the identifier " + metadata["identifier"] + " in the SWOS / GEO-Wetlands Community Portal (http://portal.swos-service.eu). " + swd_prodcut_meta+ \
                                "PostgreSQL was used for the delineation of the indicator based on the following inputs: LULC product as shapefile, mapping between LULC classes and indicator classes and indicator specific aggregation or combination of indicator classes (see more details in the abstract). " \
                                "The indicators were developed in the framework of SWOS (Satellite-based Wetland Observation System, www.swos-service.eu)."
        layer["abstract"] = "This shapefile contains the indicator " + ind_name[indicator] + " of " + country_name[1].replace("-", " ") + " (" + country_name[0].replace("-", " ") + ") for the year/date "+ procuct_name.split("_")[-1] +" " \
                            "based on a Land Use Land Cover (LULC) classification ("+procuct_name.split("_")[3].replace("L", "Landsat ").replace("S", "Sentinel ") +", " + metadata['resolution_distance'] + " " + metadata['resolution_unit'] + ", " + metadata["date_begin"] + " - " + metadata["date_end"] + ") using the "+procuct_name.split("_")[2] +" nomenclature" +swd_product + swd_product_details +". " + \
                            abstract[indicator]
        layer["resolution_unit"] = metadata["resolution_unit"]
        layer["resolution_distance"] = metadata["resolution_distance"]
        source.append({"id": metadata["identifier"],"resolution_distance": layer["resolution_distance"], "resolution_unit": layer["resolution_unit"] })
    else:
        identifier = ""
        input_layer_sensor = ""
        input_layer_periode = ""
        input_layer_resolution = ""
        point_of_contact_name = ""
        point_of_contact_email = ""
        for meta in metadata:
            #print  meta
            print meta["metadata"]["date_begin"][0:4]
            print meta["metadata"]["date_end"]
            if int(meta["metadata"]["date_begin"][0:4]) < int(layer["date_begin"][0:4]):
                layer["date_begin"] = meta["metadata"]["date_begin"]

            if len(meta["metadata"]["date_end"]) > 1 and int(meta["metadata"]["date_end"][0:4]) > int(layer["date_end"][0:4]):
                layer["date_end"] = meta["metadata"]["date_end"]
            if int(meta["metadata"]["date_begin"][0:4]) > int(layer["date_end"][0:4]):
                layer["date_end"] = meta["metadata"]["date_begin"]
            identifier += meta["metadata"]["identifier"] + ", "
            input_layer_sensor += meta["metadata"]["identifier"].split("_")[3].replace("L", "Landsat ").replace("S", "Sentinel ") + ", "
            input_layer_periode += meta["metadata"]["date_begin"] + " and " + meta["metadata"]["date_end"] + ", "
            input_layer_resolution  += meta["metadata"]['resolution_distance'] + " " + meta["metadata"]['resolution_unit'] + ", "
            point_of_contact_name = meta["metadata"]["point_of_contact"][0]["name"]
            point_of_contact_email = meta["metadata"]["point_of_contact"][0]["email"]
            source.append({"id": meta["metadata"]["identifier"], "resolution_distance": meta["metadata"]["resolution_distance"],"resolution_unit": meta["metadata"]["resolution_unit"]})

        if layer["date_end"] == "00000":
            layer["date_end"] = layer["date_begin"]

        layer["meta_lineage"] = "The indicator was automatically delineated based on Land Use Land Cover (LULC) classifications of " + country_name[1].replace("-", " ") + " (" + country_name[0].replace("-", " ") + ") within "+ procuct_name.split("_")[-1] +  "" \
                                " using the "+procuct_name.split("_")[2] +" nomenclature. " \
                                "For the LULC products " + rreplace(input_layer_sensor[:-2], ", ", " and ", 1 )  +" satellite image(s) " \
                                "between " + rreplace(input_layer_periode[:-2], ", ", " and ", 1 ) + " have been used with a spatial resolution of " +rreplace(input_layer_resolution[:-2], ", ", " and ", 1 ) + ". " \
                                "All were produced by " + point_of_contact_name + " (email:" + point_of_contact_email + ") within the framework of SWOS (Satellite-based Wetland Observation System, www.swos-service.eu)" \
                                "and they are available under the identifier " + rreplace(identifier[:-2], ", ", " and ", 1 ) + " in the SWOS / GEO-Wetlands Community Portal (http://portal.swos-service.eu). " \
                                "PostgreSQL was used for the delineation of the indicator based on the following inputs: LULC product as shapefile, mapping between LULC classes and indicator classes and indicator specific aggregation or combination of indicator classes (see more details in the abstract). " \
                                "The indicators were developed in the framework of SWOS (Satellite-based Wetland Observation System, www.swos-service.eu)."

        layer["abstract"] = "This shapefile contains the indicator " + ind_name[indicator] + " of " + country_name[1].replace("-", " ") + " (" + country_name[0].replace("-", " ") + ") for the year/date "+ procuct_name.split("_")[-1] +" " \
                            "based on a Land Use Land Cover (LULC) classification (" + rreplace(input_layer_sensor[:-2], ", ", " and ", 1 )  +", " +rreplace(input_layer_resolution[:-2], ", ", " and ", 1 ) + ", "+ rreplace(input_layer_periode[:-2], ", ", " and ", 1 ) + " using the "+procuct_name.split("_")[2] +" nomenclature. " + \
                            abstract[indicator]

    layer["abstract"] += " Observed changes in flooding may relate to different climatic conditions of the reference period (dry/wet). The shape and size of identified areas highly depends on the spatial resolution of the underlying LULC classification. Some identified changes between different dates/years may relate to a changed (in/decreased) spatial resolution. Other indicators for this and other available years/dates are also available. The indicators were developed in the framework of SWOS (Satellite-based Wetland Observation System, www.swos-service.eu)."

    # todo inspire keyword

    #tpl = get_template(content) # does not work! -> cancels script execution
    content = open(path_template, 'r').read()
    _template = Engine().from_string(content)

    ctx = ({
        'layer': layer,
        'keyword_list': ('SWOS','Indicator'), # add indiactor name
        'parent_identifier': "SWOS"
    })

    # md_doc_meta = tpl.render(ctx)
    _context = Context(ctx)
    result = _template.render(_context)

    f = open(output_folder + "/" + procuct_name + ".xml", 'w')
    f.write(result.encode('UTF-8'))

    with open(output_folder + "/" + procuct_name + '.json', 'w') as outfile:
        json.dump({"source" :source, "area": full_area}, outfile)
    return source

def rreplace(s, old, new, occurrence):
    li = s.rsplit(old, occurrence)
    return new.join(li)

def get_area(table):
    return execute_sql_return("SELECT SUM(ST_area(geometry)) FROM " + '\"' + table + '\"' "")

def calculate_state_indicator(output_folder, split_product_name, table_name, sensor_date, type, epsg, file,  metadata, site,  metadata_swd, debug = False):
    # new column name for shape
    sensor_and_date = sensor_date.split("_")
    sensor = sensor_and_date[0]
    date = sensor_and_date[1]
    full_area = get_area(table_name)
    # Wetland extent
    final_product_name = "SWOS_IND-WET-EXT_"  + type + "_" + sensor + "_" + split_product_name[-3] + "_" + split_product_name[-2] + "_" + date
    p = subprocess.Popen(
        "pgsql2shp -u swos -P swos -p 5432 -f " + output_folder + "/" + final_product_name +" indicator " + '"' + "select indicator_code_agg as ind_code, indicator_code.name as ind_name, indicator_code_" + sensor_date + " as ind_code_orig, geometry from " + '\\"' + table_name + '\\"' + " left join indicator_mapping on indicator_code_" + sensor_date + "=indicator_code_orig left join indicator_code on indicator_code_agg = indicator_code where indicator_final =" + "'" + "WET-EXT" + "'" + '"',
        shell=True, stdout=subprocess.PIPE)
    print p.communicate()
    add_metadata_xml(output_folder, table_name, final_product_name, epsg, file, metadata, "WET-EXT", full_area)

    # wetland extent: natural / artificial
    final_product_name = "SWOS_IND-WET-EXT-NA_"  + type + "_" + sensor + "_" + split_product_name[-3] + "_" + split_product_name[-2] + "_" + date
    p = subprocess.Popen(
        "pgsql2shp -u swos -P swos -p 5432 -f " + output_folder + "/" + final_product_name + " indicator " + '"' + "select indicator_code_agg as ind_code, indicator_code.name as ind_name, indicator_code_" + sensor_date + " as indcd_orig, geometry from " + '\\"' + table_name + '\\"' + " left join indicator_mapping on indicator_code_" + sensor_date + "=indicator_code_orig left join indicator_code on indicator_code_agg = indicator_code where indicator_code_" + sensor_date + " < 200 and indicator_final =" + "'" + "WET-EXT-NA" + "'" + '"',
        shell=True, stdout=subprocess.PIPE)
    print p.communicate()

    add_metadata_xml(output_folder, table_name, final_product_name, epsg, file, metadata, "WET-EXT-NA", full_area)

    # Wetland extent: vegetated / water body / river
    final_product_name = "SWOS_IND-WET-EXT-VWR_" + type + "_" + sensor + "_" + split_product_name[-3] + "_" + split_product_name[-2] + "_" + date
    p = subprocess.Popen(
        "pgsql2shp -u swos -P swos -p 5432 -f " + output_folder + "/" + final_product_name +" indicator " + '"' + "select indicator_code_agg as ind_code, indicator_code.name as ind_name, indicator_code_" + sensor_date + " as indcd_orig, geometry from " + '\\"' + table_name + '\\"' + " left join indicator_mapping on indicator_code_" + sensor_date + "=indicator_code_orig left join indicator_code on indicator_code_agg = indicator_code where indicator_code_" + sensor_date + " < 200 and indicator_final =" + "'" + "WET-EXT-VWR" + "'" + '"',
        shell=True, stdout=subprocess.PIPE)
    print p.communicate()
    add_metadata_xml(output_folder, table_name, final_product_name, epsg, file, metadata, "WET-EXT-VWR", full_area)

    # Wetland threats
    final_product_name = "SWOS_IND-WET-THREATS_" + type + "_" + sensor + "_"+ split_product_name[-3] + "_" + split_product_name[-2] + "_" + date
    p = subprocess.Popen(
        "pgsql2shp -u swos -P swos -p 5432 -f " + output_folder + "/" + final_product_name + " indicator " + '"' + "select indicator_code_agg as ind_code, indicator_code.name as ind_name, indicator_code_" + sensor_date + " as indcd_orig, geometry from " + '\\"' + table_name + '\\"' + " left join indicator_mapping on indicator_code_" + sensor_date + "=indicator_code_orig left join indicator_code on indicator_code_agg = indicator_code where indicator_code_" + sensor_date + " in(300, 900, 200) and indicator_final =" + "'" + "WET-THREATS" + "'" + '"',
        shell=True, stdout=subprocess.PIPE)
    print p.communicate()
    add_metadata_xml(output_folder, table_name, final_product_name, epsg, file, metadata, "WET-THREATS", full_area)

    # All IND
    final_product_name = "SWOS_IND_" + type + "_" + sensor + "_" + split_product_name[-3] + "_" + split_product_name[
        -2] + "_" + date
    p = subprocess.Popen(
        "pgsql2shp -u swos -P swos -p 5432 -f " + output_folder + "/" + final_product_name + " indicator " + '"' + "select indicator_code_agg as ind_code, indicator_code.name as ind_name, indicator_code_" + sensor_date + " as indcd_orig, geometry from " + '\\"' + table_name + '\\"' + " left join indicator_mapping on indicator_code_" + sensor_date + "=indicator_code_orig left join indicator_code on indicator_code_agg = indicator_code where indicator_final =" + "'" + "IND-ALL" + "'" + '"',
        shell=True, stdout=subprocess.PIPE)
    print p.communicate()
    add_metadata_xml(output_folder, table_name, final_product_name, epsg, file, metadata, "IND", full_area)

    # Open water extent
    if not site["no_swd"] == 1:
        diff = 100000000000
        matching_swd_file = ""
        for swd_file in metadata_swd:
            split_product_name_swd = swd_file["new_file"].split("_")
            swd_date = split_product_name_swd[-1].split("-")
            print swd_date
            if (len(swd_date) == 1):
                if diff > abs((int(swd_date[0]) - int(date))):
                    print "diff" + str(int(swd_date[0]) - int(date))
                    matching_swd_file = swd_file
                    diff = abs((int(swd_date[0]) - int(date)))
            else:
                if swd_date[0] == date or swd_date[1] == date or (int(date) > int(swd_date[0]) and int(date) < int(swd_date[1])) :
                    print "ident or range match"
                    matching_swd_file = swd_file
                    break
                # no perfect match -> choose nearest
                else:
                    if diff > abs((int(swd_date[0])-int(date))):
                        print "diff" + str(int(swd_date[0])-int(date))
                        matching_swd_file = swd_file
                        diff = abs((int(swd_date[0])-int(date)))

        print matching_swd_file

        if matching_swd_file != "":
            output = table_name + "_swd"
            drop_exist(output)
            print "LULC and SWD"


            drop_exist(matching_swd_file["new_file"].lower() + "_dissolved")
            dissolve_makvalid_swd(matching_swd_file["new_file"].lower())

            drop_exist(table_name + "_dissolved")
            drop_exist(matching_swd_file["new_file"].lower() + "_dissolved")
            if hasattr(site, 'no_swd_dissolve') and site["no_swd_dissolve"] == 1:
                dissolve_makvalid_swd(matching_swd_file["new_file"].lower())
                do_intersection(table_name, matching_swd_file["new_file"].lower() + "_dissolved", output)
            else:
                dissolve_and_subdivide(table_name, sensor_date)
                dissolve_makvalid_swd(matching_swd_file["new_file"].lower())
                do_intersection(table_name + "_dissolved", matching_swd_file["new_file"].lower() + "_dissolved", output)

            add_column_swd(output, "indicator_code_" + sensor_date)

            final_product_name = "SWOS_IND-OPEN-W-EXT_" + type + "_" + sensor + "_" + split_product_name[-3] + "_" + split_product_name[-2] + "_" + date
            p = subprocess.Popen(
                "pgsql2shp -u swos -P swos -p 5432 -f " + output_folder + "/" + final_product_name + " indicator " + '"' + "select indicator_code_agg as ind_code, indicator_code.name as ind_name, ind_code as indcd_orig, geometry from " + '\\"' + output + '\\"' + " left join indicator_mapping on ind_code=indicator_code_orig left join indicator_code on indicator_code_agg = indicator_code where ind_code not in (2003, 3003, 4003) and indicator_final =" + "'" + "IND_SWD" + "'" + '"',
                shell=True, stdout=subprocess.PIPE)
            print p.communicate()

            add_metadata_xml(output_folder, table_name, final_product_name, epsg, file, metadata, "OPEN-W-EXT" , full_area, matching_swd_file["metadata"])




    if debug == True:
        ind1 = execute_sql_return(
            "SELECT SUM(ST_area(geometry)) FROM " + '\"' + table_name + '\"' + " left join indicator_mapping on indicator_code_" + sensor_date + "= indicator_code_orig left join indicator_code on indicator_code_agg = indicator_code where indicator_code_" + sensor_date + " < 200 and indicator_final =" + "'" + "IND1_0" + "'" + ' and indicator_code_agg = 110')
        ind2 = execute_sql_return(
            "SELECT SUM(ST_area(geometry)) FROM " + '\"' + table_name + '\"' + " left join indicator_mapping on indicator_code_" + sensor_date + "= indicator_code_orig left join indicator_code on indicator_code_agg = indicator_code where indicator_code_" + sensor_date + " < 200 and indicator_final =" + "'" + "IND1_0" + "'" + ' and indicator_code_agg = 120')
        ind3 = execute_sql_return(
            "SELECT SUM(ST_area(geometry)) FROM " + '\"' + table_name + '\"' + " left join indicator_mapping on indicator_code_" + sensor_date + "= indicator_code_orig left join indicator_code on indicator_code_agg = indicator_code where indicator_code_" + sensor_date + " < 200 and indicator_final =" + "'" + "IND1_0" + "'" + ' and indicator_code_agg = 1')
        print "ind1: " + ind1
        print "ind2: " + ind2
        print "ind3: " + ind3


def do_intersection(input_1, input_2, output):
    print "intersection: " + input_1 + input_2
    cur = conn.cursor()

    #get all column names except of geometry col
    col_names_input = ""
    col_name = get_col_names(input_1)
    for col in col_name:
        col_names_input = col_names_input + '"' + input_1 + '"' + "." + col[0] + ","

    col_name = get_col_names(input_2)
    for col in col_name:
        col_names_input = col_names_input + '"' + input_2 + '"' + "." + col[0] + ","

    try:
        cur.execute("SELECT "+ col_names_input + " ST_Multi(ST_Buffer(ST_Intersection(" + '"' + input_1 + '"'".geometry," + '"' + input_2 + '"'".geometry), 0.0)) As geometry INTO " + '"' + output + '"'" FROM " + '"' + input_1 + '"'" INNER JOIN " + '"' + input_2 + '"'" ON ST_Intersects(" + '"' + input_1 + '"'".geometry," + '"' + input_2 + '"'".geometry) WHERE Not ST_IsEmpty(ST_Buffer(ST_Intersection(" + '"' + input_1 + '"'".geometry," + '"' + input_2 + '"'".geometry),0.0));")
    except psycopg2.Error as e:
        pass
        e.pgcode
        print e.pgerror
    cur.close()

def get_change_statistic(table, cols):
    stats = []
    col_1 = ""
    col_2 = ""
    columns = []
    for col in cols:
        if "indicator_code" in col[0]:
            columns.append(col[0])

    combination = itertools.combinations(columns, 2)
    for combi in combination:

        col_1 = combi[0]
        col_2 = combi[1]
        year_1 = col_1.split("_")[-1]
        year_2 = col_2.split("_")[-1]
        sensor_1 = col_1.split("_")[-2]
        sensor_2 = col_2.split("_")[-2]

        stats.append({"year_1": year_1 + "_" + sensor_1, "year_2": year_2 + "_" + sensor_2 , "stat": execute_sql_return(
            "SELECT cast(round(cast(SUM(ST_area(geometry)) as numeric), 2) as float), " + col_1 + "," + col_2 + " FROM " + '\"' + table + '\"' " group by " + col_1 + "," + col_2 + " order by " + col_1 + "," + col_2 + "")})

    return stats

def claculate_indicator(files, output_folder, type, site):
    intersection_count = 0
    output = ""
    collect_metadata = []
    metadata_swd = []
    swd_metadata = polygonize_swd_products(site)
    try:
        global conn
        conn = psycopg2.connect("dbname=" + db_name + " user=" + db_user + " password=" + db_passwd + " port=" + str(db_port))
        if len(swd_metadata) > 0:

            for swd_file in swd_metadata:
                file = swd_file["file"]

                # get EPSG
                epsg = get_epsg(file, site)

                # stop processing of file if no epsg is provided
                if epsg == False:
                    break

                # get product name
                product_name = os.path.basename(file)[:-4]

                # extract metadata
                metadata_swd.append({"metadata" : extract_metadata(swd_file["orig_file"][:-3] + "xml"), "orig_file": swd_file["orig_file"], "new_file": product_name})

                # import file
                import_file(file, epsg, product_name)

                # rename column
                rename_geometry_column(product_name.lower())
    except:
        print "Error SWD" + site["name"]


    for file in files:
        try:
            global conn
            conn = psycopg2.connect("dbname=" + db_name + " user=" + db_user + " password=" + db_passwd + " port=" + str(db_port))
            # get EPSG
            epsg = get_epsg(file, site)

            # stop processing of file if no epsg is provided
            if epsg == False:
                break

            # get product name
            product_name = os.path.basename(file)[:-4]
            print product_name
            split_product_name = product_name.split("_")
            date = split_product_name[-1]
            #print date
            sensor = split_product_name[3]
            #print sensor

            # extract metadata
            metadata = extract_metadata(file[:-3] + "xml")

            # import file
            import_file(file, epsg, product_name)

            # new table name
            new_product_name = product_name.lower() + "_new"

            # new column name
            sensor_date = sensor + "_" + date.split("-")[0]

            # drop table new if exist
            drop_exist(new_product_name)

            # repair invalid geometries and add indicator code
            repair_and_add_ind_code(type,product_name, sensor_date, new_product_name)

            # check for non-machted LULC codes
            count_empty = check_empty_ind_code(new_product_name, sensor_date)

            if(count_empty[0][0] != 0):
                print "Error: not all Codes have a ind code match! Correction of input data necessary!" + site["name"]
                break

            # export state indicator
            calculate_state_indicator(output_folder, split_product_name, new_product_name, sensor_date, type, epsg, file,metadata,site, metadata_swd)

            # calculate change indicator for all classes if file size does not exceed limit
            if os.path.getsize(file) < max_shp_size and len(files) > 1: #check filde size -> do not apply intersection for very large files
                print site
                intersection_count = intersection_count + 1
                if intersection_count == 1:

                    #set to current product
                    input_1 = new_product_name

                    # reduce number of polygons, subdivide result and add index
                    drop_exist(input_1 + "_dissolved")
                    print "drop" + input_1 + "_dissolved"
                    print site
                    if  site["no_dissolve"] == 1 :
                        print "has attr no dissolv"
                        subdivide(input_1, sensor_date.lower())
                        input_1 = input_1 + "_dissolved"


                        #input_1 = input_1
                    else:
                        print "dissolve and subdivide"
                        dissolve_and_subdivide(input_1, sensor_date)
                        input_1 = input_1 + "_dissolved"
                        print input_1

                    create_index(input_1)

                    # set starting year
                    first_year = date

                    # add metadata
                    collect_metadata.append({'product_name': product_name, "metadata": metadata})
                elif intersection_count >= 2:
                    # set input 2 to current product
                    input_2 = new_product_name

                    # reduce number of polygons, subdivide result and add index
                    drop_exist(input_2 + "_dissolved")

                    if site["no_dissolve"] == 1 :
                        #input_2 = input_2
                        subdivide(input_2, sensor_date)
                        input_2 = input_2 + "_dissolved"
                    else:
                        dissolve_and_subdivide(input_2, sensor_date)
                        input_2 = input_2 + "_dissolved"

                    create_index(input_2)

                    # set last year
                    last_year = date

                    # add metadata and area of input 2
                    collect_metadata.append({'product_name': product_name, "metadata": metadata})

                    # do intersection with input 1 & 2
                    output = site["name"].lower() + "_"+ type +"_" + str(intersection_count - 1)
                    drop_exist(output)
                    do_intersection(input_1, input_2, output)

                    # reduce number of polygons, subdivide result and add index; set output as input 1
                    cols = get_col_names(output)
                    columns = ""
                    for col in cols:
                        columns = columns + "," + col[0]
                    drop_exist(output + "_dissolved")

                    if site["no_dissolve"] == 1:
                        input_1 = output

                    else:
                        dissolve_and_subdivide_intersection(output, columns[1:])
                        input_1 = output + "_dissolved"

                    create_index(input_1)

            else:
                print "File size to big - no intersection for all classes (only wetland) or only one file:" + file
                # todo intersection for wetland area
                # write complete change shape-file

        # write final intersection result
        except Exception as e:
            print(e)
            print "Error " + site["name"]

    #try:
    if len(output) > 0:

        drop_exist(output + "_final")

       # if site["no_dissolve"] == 1:
        dissolve_intersection_final(output, columns[1:])
       #     final_output = output + "_final"
        #else:
             #final_intersection(output, columns[1:])
        final_output = output + "_final"


        print "IND-ALL"
        output_shape_file_name =  "SWOS_IND-ALL_"+ type + "_" + split_product_name[-3] + "_" + split_product_name[-2] + "_"+ first_year +"-"+ last_year

        metadata_all_shape = {'file_name':output_shape_file_name, 'columns': [], 'source_metadata': collect_metadata }

        full_area = get_area(final_output)

        col_rename = ""
        group_col = ""
        for col in cols:
            col_name_split = col[0].split("_")
            if len(col_name_split[3]) <= 4:
                new_ind_text_col_name = col_name_split[2] + "_" + col_name_split[3]
                new_ind_text_col_code = new_ind_text_col_name + "_" + "cd"
            else:  # date YYYYMMDD -> 2016012 L8-> 160112L8cd
                new_ind_text_col_name = col_name_split[2] + "_" + col_name_split[3][2:]
                new_ind_text_col_code = col_name_split[2] +  col_name_split[3][2:]+ "cd"


            # add column with text
            add_name_col(final_output, col[0], new_ind_text_col_name )

            # rename column to shape compatible short name (10char),
            col_rename = col_rename + ", " + '\\"' +new_ind_text_col_name + '\\"' + ","+ col[0] + " as " + '\\"' + new_ind_text_col_code + '\\"'

            # group columns
            group_col = group_col + "," + new_ind_text_col_name + "," + new_ind_text_col_code

            # collect metadata for each col
            metadata_all_shape["columns"].append({"col_cd": new_ind_text_col_code, "year":col_name_split[3], "sensor": col_name_split[2]})



        # Master file
        col_names = col_rename.split(",")

        # add first & last column
        first_last_cols = ", concat(" + col_names[2].split(" ")[0] + "::text," + col_names[-1].split(" ")[0] + "::text) AS ind_code"
        if site["no_dissolve"] == 1:
            p = subprocess.Popen("pgsql2shp -u swos -P swos -p 5432 -f " + output_folder + "/" + output_shape_file_name + " indicator " + '"' + "select " + col_rename[1:] + first_last_cols + ", geometry from " + '\\"' + output + "_final" + '\\"' + '"',
                             shell=True, stdout=subprocess.PIPE)
        else:
            p = subprocess.Popen("pgsql2shp -u swos -P swos -p 5432 -f " + output_folder + "/" + output_shape_file_name + " indicator " + '"' + "select " + col_rename[1:] + first_last_cols + ", st_makevalid(ST_UNION(geometry)) as geometry from " + '\\"' + output + "_final" + '\\"' + " group by " + group_col[1:] + "" + '"' ,
                shell=True, stdout=subprocess.PIPE)

        print p.communicate()
        metadata = []

        source = add_metadata_xml(output_folder, final_output, output_shape_file_name, epsg, file, collect_metadata, "IND-ALL" , full_area)

        # calc stats
        cols = get_col_names(final_output)
        stat = get_change_statistic(final_output, cols)
        metadata_all_shape["stat"] = stat
        metadata_all_shape["source"] = source
        metadata_all_shape["area"] = full_area

        with open(data_dir + site["name"] + '/IND/' + output_shape_file_name +'.json', 'w') as outfile:
            json.dump(metadata_all_shape, outfile)
        # write one example for diff first and last year



        for meta in collect_metadata:
            if (meta["product_name"].split("_")[-1][-4:] in col_names[1] and meta["product_name"].split("_")[3].lower() in col_names[1]) or (meta["product_name"].split("_")[-1][-4:] in col_names[-2] and meta["product_name"].split("_")[3].lower() in col_names[-2]):
                metadata.append(meta)
        select_cols = col_names[1] + ", " + col_names[2] + ", " + col_names[-2] + ", " + col_names[-1]
        group_cols = col_names[1] + ", " + col_names[2].split(" ")[2] + ", " + col_names[-2] + ", " + col_names[-1].split(" ")[2]

        # Wetland change
        output_shape_file_name = "SWOS_IND-WET-CHANGE_" + type + "_" + split_product_name[-3] + "_" + split_product_name[-2] + "_" + first_year + "-" + last_year

        if site["no_dissolve"] == 1:
            geometry = " geometry "
            group_by = ""
        else:
            geometry =  " st_makevalid(ST_UNION(geometry)) as geometry "
            group_by =  " group by ind_code, " + group_cols

        p = subprocess.Popen("pgsql2shp -u swos -P swos -p 5432 -f " + output_folder + "/" + output_shape_file_name + " indicator " + '"' + "select concat(a.indicator_code_agg::text, b.indicator_code_agg::text) AS ind_code , "+ select_cols + ", "+ geometry + " from " + '\\"' + final_output + '\\"' + "left join indicator_mapping a on " +col_names[2].split(" ")[0]+"=a.indicator_code_orig  left join indicator_mapping b on " +col_names[-1].split(" ")[0]+"=b.indicator_code_orig where ("+ col_names[2].split(" ")[0]+"<200 or " +col_names[-1].split(" ")[0] + "<200 or "+ col_names[2].split(" ")[0]+"=900 or " +col_names[-1].split(" ")[0] + "=900 ) and a.indicator_final=" + "'" + "WET-CHANGE" + "'" + " and b.indicator_final=" + "'" + "WET-CHANGE" + "'" + group_by +  '"' ,
                             shell=True, stdout=subprocess.PIPE)

        print p.communicate()

        add_metadata_xml(output_folder, output + "_final", output_shape_file_name, epsg, file, metadata, "WET-CHANGE", full_area )

        # wetland articic
        output_shape_file_name = "SWOS_IND-WET-ART_" + type + "_" + split_product_name[-3] + "_" + split_product_name[-2] + "_" + first_year + "-" + last_year

        p = subprocess.Popen("pgsql2shp -u swos -P swos -p 5432 -f " + output_folder + "/" + output_shape_file_name + " indicator " + '"' + "select concat(a.indicator_code_agg::text, b.indicator_code_agg::text) AS ind_code , " + select_cols + ", " + geometry +  " from " + '\\"' + final_output + '\\"' + "left join indicator_mapping a on " +col_names[2].split(" ")[0]+"=a.indicator_code_orig  left join indicator_mapping b on " +col_names[-1].split(" ")[0]+"=b.indicator_code_orig where ("+ col_names[2].split(" ")[0]+" <200 and " +col_names[-1].split(" ")[0] + " in (120, 121, 122, 123, 900) or "+ col_names[2].split(" ")[0]+" =900 and " +col_names[-1].split(" ")[0] + "=900 ) and a.indicator_final=" + "'" + "WET-ART" + "'" + " and b.indicator_final=" + "'" + "WET-ART" + "'" + group_by +  '"' ,
                             shell=True, stdout=subprocess.PIPE)
        print p.communicate()

        add_metadata_xml(output_folder, final_output, output_shape_file_name, epsg, file, metadata, "WET-ART", full_area )

        # wetland restore
        output_shape_file_name = "SWOS_IND-WET-RESTORE_" + type + "_" + split_product_name[-3] + "_" + split_product_name[-2] + "_" + first_year + "-" + last_year

        p = subprocess.Popen("pgsql2shp -u swos -P swos -p 5432 -f " + output_folder + "/" + output_shape_file_name + " indicator " + '"' + "select concat(a.indicator_code_agg::text, b.indicator_code_agg::text) AS ind_code , " + select_cols + ", " + geometry +  "  from " + '\\"' + final_output + '\\"' + "left join indicator_mapping a on " +col_names[2].split(" ")[0]+"=a.indicator_code_orig  left join indicator_mapping b on " +col_names[-1].split(" ")[0]+"=b.indicator_code_orig where ("+ col_names[2].split(" ")[0]+" in (100, 101, 102, 103, 120, 121, 122, 123, 200, 300, 400, 900) and " +col_names[-1].split(" ")[0] + " in (110, 111, 112, 113)) and a.indicator_final=" + "'" + "WET-RESTORE" + "'" + " and b.indicator_final=" + "'" + "WET-RESTORE"  + "'" + group_by +  '"' ,
                             shell=True, stdout=subprocess.PIPE)
        print p.communicate()

        add_metadata_xml(output_folder, final_output, output_shape_file_name, epsg, file, metadata, "WET-RESTORE", full_area )

        # urbanization
        output_shape_file_name = "SWOS_IND-URB_" + type + "_" + split_product_name[-3] + "_" + split_product_name[-2] + "_" + first_year + "-" + last_year

        p = subprocess.Popen("pgsql2shp -u swos -P swos -p 5432 -f " + output_folder + "/" + output_shape_file_name + " indicator " + '"' + "select concat(a.indicator_code_agg::text, b.indicator_code_agg::text) AS ind_code , " + select_cols + ", " + geometry +  "  from " + '\\"' + output + "_final" + '\\"' + "left join indicator_mapping a on " +col_names[2].split(" ")[0]+"=a.indicator_code_orig  left join indicator_mapping b on " +col_names[-1].split(" ")[0]+"=b.indicator_code_orig where " +col_names[-1].split(" ")[0] + " = 200 and a.indicator_final=" + "'" + "IND-URB" + "'" + " and b.indicator_final=" + "'" + "IND-URB" + "'" + group_by +  '"' ,
                             shell=True, stdout=subprocess.PIPE)
        print p.communicate()

        add_metadata_xml(output_folder, final_output, output_shape_file_name, epsg, file, metadata, "IND-URB", full_area )
    #except:
    #    print "ERROR IND CHANGE"
      #      return metadata_all_shape
      #  else:
      #      return False


def create_indicator(indicator_sites):
    for site in indicator_sites:

        if site["calc"] == 1:
            print site["name"]
            execute_calculation(site)

def execute_calculation(site):
    clc_files = []
    maes_files = []

    for name in glob.glob(data_dir + site["name"] + '/LULC/*RAMSAR*.shp'):
        clc_files.append(name)

    for name in glob.glob(data_dir + site["name"] + '/LULC/*MAES*.shp'):
        maes_files.append(name)

    output_folder = data_dir + site["name"] + "/IND"

    # delete old folder
    if delete_old_folder == True and os.path.exists(output_folder):
        shutil.rmtree(output_folder)

    # create output folder if not exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
        os.chmod(output_folder, 0o777)

    # sort list (L1, L2, S1, S2 => equals order by time)
    clc_files.sort()
    maes_files.sort()

    # calculate indicator (import, repair, dissolve, subdivide, intersect, export)
    if len(clc_files) > 0:
        claculate_indicator(clc_files, output_folder, "RAMSAR-CLC", site)

    if len(maes_files) > 0:
        claculate_indicator(maes_files, output_folder, "MAES", site)

    put_data_swos_server(site["name"])

    print "complete done" + site["name"]


def calculate_change_statistic(site, table):
    #table = find_table(site)
    #print table
    cols = get_col_names(table)
    #print cols
    stat = get_change_statistic(table, cols)
    #print stat
    import json
    with open(data_dir + site + '/IND/' + site + '.json', 'w') as outfile:
        json.dump(stat, outfile)




    for area in stat:
        data = area["stat"]
        print area["year_1"]
        print area["year_2"]
        ind_100_100 = 0
        ind_100_110 = 0
        ind_100_120 = 0
        ind_100_200 = 0
        ind_100_300 = 0
        ind_100_400 = 0
        ind_100_900 = 0
        ind_110_100 = 0
        ind_110_110 = 0
        ind_110_120 = 0
        ind_110_200 = 0
        ind_110_300 = 0
        ind_110_400 = 0
        ind_110_900 = 0
        ind_120_100 = 0
        ind_120_110 = 0
        ind_120_120 = 0
        ind_120_200 = 0
        ind_120_300 = 0
        ind_120_400 = 0
        ind_120_900 = 0
        ind_200_100 = 0
        ind_200_110 = 0
        ind_200_120 = 0
        ind_200_200 = 0
        ind_200_300 = 0
        ind_200_400 = 0
        ind_200_900 = 0
        ind_300_100 = 0
        ind_300_110 = 0
        ind_300_120 = 0
        ind_300_200 = 0
        ind_300_300 = 0
        ind_300_400 = 0
        ind_300_900 = 0
        ind_400_100 = 0
        ind_400_110 = 0
        ind_400_120 = 0
        ind_400_200 = 0
        ind_400_300 = 0
        ind_400_400 = 0
        ind_400_900 = 0
        ind_900_100 = 0
        ind_900_110 = 0
        ind_900_120 = 0
        ind_900_200 = 0
        ind_900_300 = 0
        ind_900_400 = 0
        ind_900_900 = 0


        for val in data:
            #print val
            if val[1] == 100 and val[2] == 100:
                ind_100_100 = val[0]
            if val[1] == 100 and val[2] in (110,111, 112, 113):
                ind_100_110 = ind_100_110 + val[0]
            if val[1] == 100 and val[2] in (120, 121, 122, 123):
                ind_100_120 = ind_100_120 + val[0]
            if val[1] == 100 and val[2] == 200:
                ind_100_200 = val[0]
            if val[1] == 100 and val[2] == 300:
                ind_100_300 = val[0]
            if val[1] == 100 and val[2] == 400:
                ind_100_400 = val[0]
            if val[1] == 100 and val[2] == 500:
                ind_100_500 = val[0]
            if val[1] == 100 and val[2] == 600:
                ind_100_600 = val[0]
            if val[1] == 100 and val[2] == 900:
                ind_100_900 = val[0]
            if val[1] in (110, 111, 112, 113) and val[2] == 100:
                ind_110_100 = val[0]
            if val[1] in (110, 111, 112, 113) and val[2] in (110,111, 112, 113):
                ind_110_110 = ind_110_110 + val[0]
            if val[1] in (110, 111, 112, 113) and val[2] in (120, 121, 122, 123):
                ind_110_120 = ind_110_120 + val[0]
            if val[1] in (110, 111, 112, 113) and val[2] == 200:
                ind_110_200 = val[0]
            if val[1] in (110, 111, 112, 113) and val[2] == 300:
                ind_110_300 = val[0]
            if val[1] in (110, 111, 112, 113) and val[2] == 400:
                ind_110_400 = val[0]
            if val[1] in (110, 111, 112, 113) and val[2] == 900:
                ind_110_900 = val[0]
            if val[1] in (120, 121, 122, 123) and val[2] == 100:
                ind_120_100 = val[0]
            if val[1] in (120, 121, 122, 123) and val[2] in (110,111, 112, 113):
                ind_120_110 = ind_120_110 + val[0]
            if val[1] in (120, 121, 122, 123) and val[2] in (120, 121, 122, 123):
                ind_120_120 = ind_120_120 + val[0]
            if val[1] in (120, 121, 122, 123) and val[2] == 200:
                ind_120_200 = val[0]
            if val[1] in (120, 121, 122, 123) and val[2] == 300:
                ind_120_300 = val[0]
            if val[1] in (120, 121, 122, 123) and val[2] == 400:
                ind_120_400 = val[0]
            if val[1] in (120, 121, 122, 123) and val[2] == 900:
                ind_120_900 = val[0]
            if val[1] == 200 and val[2] == 100:
                ind_200_100 = val[0]
            if val[1] == 200 and val[2] in (110, 111, 112, 113):
                ind_200_110 = ind_200_110 + val[0]
            if val[1] == 200 and val[2] in (120, 121, 122, 123):
                ind_200_120 = ind_200_120 + val[0]
            if val[1] == 200 and val[2] == 200:
                ind_200_200 = val[0]
            if val[1] == 200 and val[2] == 300:
                ind_200_300 = val[0]
            if val[1] == 200 and val[2] == 400:
                ind_200_400 = val[0]
            if val[1] == 200 and val[2] == 900:
                ind_200_900 = val[0]
            if val[1] == 300 and val[2] == 100:
                ind_300_100 = val[0]
            if val[1] == 300 and val[2] in (110, 111, 112, 113):
                ind_300_110 = ind_300_110 + val[0]
            if val[1] == 300 and val[2] in (120, 121, 122, 123):
                ind_300_120 = ind_300_120 + val[0]
            if val[1] == 300 and val[2] == 200:
                ind_300_200 = val[0]
            if val[1] == 300 and val[2] == 300:
                ind_300_300 = val[0]
            if val[1] == 300 and val[2] == 400:
                ind_300_400 = val[0]
            if val[1] == 300 and val[2] == 900:
                ind_300_900 = val[0]
            if val[1] == 400 and val[2] == 100:
                ind_400_100 = val[0]
            if val[1] == 400 and val[2] in (110, 111, 112, 113):
                ind_400_110 = ind_400_110 + val[0]
            if val[1] == 400 and val[2] in (120, 121, 122, 123):
                ind_400_120 = ind_400_120 + val[0]
            if val[1] == 400 and val[2] == 200:
                ind_400_200 = val[0]
            if val[1] == 400 and val[2] == 300:
                ind_400_300 = val[0]
            if val[1] == 400 and val[2] == 400:
                ind_400_400 = val[0]
            if val[1] == 400 and val[2] == 900:
                ind_400_900 = val[0]
            if val[1] == 900 and val[2] == 100:
                ind_900_100 = val[0]
            if val[1] == 900 and val[2] in (110, 111, 112, 113):
                ind_900_110 = ind_900_110 + val[0]
            if val[1] == 900 and val[2] in (120, 121, 122, 123):
                ind_900_120 = ind_900_120 + val[0]
            if val[1] == 900 and val[2] == 200:
                ind_900_200 = val[0]
            if val[1] == 900 and val[2] == 300:
                ind_900_300 = val[0]
            if val[1] == 900 and val[2] == 400:
                ind_900_400 = val[0]
            if val[1] == 900 and val[2] == 900:
                ind_900_900 = val[0]

#120
    #200
        matrix_ = [
            [ind_100_100, ind_110_100, ind_120_100, ind_200_100, ind_300_100, ind_400_100, ind_900_100],
            [ind_100_110, ind_110_110, ind_120_110, ind_200_110, ind_300_110, ind_400_110,  ind_900_110],
            [ind_100_120, ind_110_120, ind_120_120, ind_200_120, ind_300_120, ind_400_120, ind_900_120],
            [ind_100_200, ind_110_200, ind_120_200, ind_200_200, ind_300_200, ind_400_200,  ind_900_200],
            [ind_100_300, ind_110_300, ind_120_300, ind_200_300, ind_300_300, ind_400_300, ind_900_300],
            [ind_100_400, ind_110_400, ind_120_400, ind_200_400, ind_300_400, ind_400_400,  ind_900_400],
            [ind_100_900, ind_110_900, ind_120_900, ind_200_900, ind_300_900, ind_400_900, ind_900_900]
        ];
        print matrix_


def find_max_all(site):
    global conn
    conn = psycopg2.connect("dbname=" + db_name + " user=" + db_user + " password=" + db_passwd + " port=" + str(db_port))
    table = find_table(site, "RAM")
    print table
    col_arr = []
    output_folder = data_dir + site["name"] + "/IND"
    for name in glob.glob(data_dir + site["name"] + '/IND/*_IND-ALL_*.shp'):
        product_name = os.path.basename(name)[:-4]

        if "RAM" in product_name:
            output_shape_file_name = product_name
            print output_shape_file_name
    try:
        cols = get_col_names(table[0][0])
        print cols
        for col in cols:
            if "indicator" in col[0]:
                col_arr.append(col[0])

        print col_arr
        col_rename = ""
        for col in col_arr:

            col_name_split = col.split("_")
            print col_name_split
            if len(col_name_split[3]) <= 4:
                new_ind_text_col_name = col_name_split[3] + "_" + col_name_split[2]
                new_ind_text_col_code = col_name_split[2] + "_" + col_name_split[3] + "_" + "cd"
            else:  # date YYYYMMDD -> 2016012 L8-> 160112L8cd
                new_ind_text_col_name = col_name_split[3][2:] + "_" + col_name_split[2]
                new_ind_text_col_code = col_name_split[2] + col_name_split[3][2:] + "cd"

            # rename column to shape compatible short name (10char),
            col_rename = col_rename + ", " + '\\"' +new_ind_text_col_name + '\\"' + ","+ col + " as " + '\\"' + new_ind_text_col_code + '\\"'
            print col_rename

        col_names = col_rename.split(",")
        first_last_cols = ", concat(" + col_names[2].split(" ")[0] + "::text,"  + col_names[-1].split(" ")[0] + "::text) AS ind_code"

        p = subprocess.Popen(
            "pgsql2shp -u swos -P swos -p 5432 -f " + output_folder + "/" + output_shape_file_name + " indicator " + '"' + "select " + col_rename[1:] + first_last_cols + ", geometry from " + '\\"' + table[0][0] + '\\"' + '"',
            shell=True, stdout=subprocess.PIPE)
        print p.communicate()



    except Exception as e:
        print(e)
        print "error"

    table = find_table(site, "MAES")
    print table
    col_arr = []
    output_folder = data_dir + site["name"] + "/IND"
    for name in glob.glob(data_dir + site["name"] + '/IND/*_IND-ALL_*.shp'):
        product_name = os.path.basename(name)[:-4]

        if "MAES" in product_name:
            output_shape_file_name = product_name
            print output_shape_file_name
    try:
        cols = get_col_names(table[0][0])
        print cols
        for col in cols:
            if "indicator" in col[0]:
                col_arr.append(col[0])

        print col_arr
        col_rename = ""
        for col in col_arr:

            col_name_split = col.split("_")
            print col_name_split
            if len(col_name_split[3]) <= 4:
                new_ind_text_col_name = col_name_split[3] + "_" + col_name_split[2]
                new_ind_text_col_code = col_name_split[2] + "_" + col_name_split[3] + "_" + "cd"
            else:  # date YYYYMMDD -> 2016012 L8-> 160112L8cd
                new_ind_text_col_name = col_name_split[3][2:] + "_" + col_name_split[2]
                new_ind_text_col_code = col_name_split[2] + col_name_split[3][2:] + "cd"

            # rename column to shape compatible short name (10char),
            col_rename = col_rename + ", " + '\\"' + new_ind_text_col_name + '\\"' + "," + col + " as " + '\\"' + new_ind_text_col_code + '\\"'
            print col_rename

        col_names = col_rename.split(",")
        first_last_cols = ", concat(" + col_names[2].split(" ")[0] + "::text," + col_names[-1].split(" ")[
            0] + "::text) AS ind_code"

        p = subprocess.Popen(
            "pgsql2shp -u swos -P swos -p 5432 -f " + output_folder + "/" + output_shape_file_name + " indicator " + '"' + "select " + col_rename[1:] + first_last_cols + ", geometry from " + '\\"' +
            table[0][0] + '\\"' + '"',
            shell=True, stdout=subprocess.PIPE)
        print p.communicate()



    except Exception as e:
        print(e)
        print "error"


def write_ind_all(indicator_sites):
    for site in indicator_sites:
        find_max_all(site)
        put_data_swos_server(site["name"])


if __name__ == '__main__':

    for site in indicator_sites:
        if site["calc"] == 1: # remove to run for all
            print site
            #Process(target=find_max_all,args=(site, )).start()
            Process(target=execute_calculation,args=(site, )).start()



#find_max_all({'name': "Spain_Guadalhorce", 'calc':1, 'srid': '', 'no_dissolve': 0})
#put_data_swos_server("Greece_Eastern-Macedonia")

#write_ind_all(indicator_sites)

#create_indicator(indicator_sites)
#put_data_swos_server("Spain_Fuente-de-Piedra")
#download_files()