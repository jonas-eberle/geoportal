import pysftp
import getpass

print 'Start'
password = getpass.getpass('pass')

folder = '/home/qe89hep/data/SWOS/test/'

with pysftp.Connection('swos-data.jena-optronik.de', username='felix.cremer', password= password) as sftp:
    sftp.chdir('products/sftp_test/')
    sftp.get_r('wetlands', folder,  preserve_mtime=True)

