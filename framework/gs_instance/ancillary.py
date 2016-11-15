import os
from glob import glob
import re


def finder(folder, matchlist, foldermode=0, regex=False, recursive=True):
    """
    # function for finding files in a folder and its subdirectories
    # search patterns must be given in a list
    # patterns can follow the unix shell standard (default) or regular expressions (via argument regex)
    # the argument recursive decides whether search is done recursively in all subdirectories or in the defined directory only
    # foldermodes:
    # 0: no folders
    # 1: folders included
    # 2: only folders
    """
    # match patterns
    if regex:
        if recursive:
            out = dissolve([[os.path.join(group[0], x) for x in dissolve(group) if re.search(pattern, x)] for group in os.walk(folder) for pattern in matchlist])
        else:
            out = dissolve([[os.path.join(folder, x) for x in os.listdir(folder) if re.search(pattern, x)] for pattern in matchlist])
    else:
        if recursive:
            out = list(set([f for files in [glob(os.path.join(item[0], pattern)) for item in os.walk(folder) for pattern in matchlist] for f in files]))
        else:
            out = dissolve([glob(os.path.join(folder, pattern)) for pattern in matchlist])
    # exclude directories
    if foldermode == 0:
        out = [x for x in out if not os.path.isdir(x)]
    if foldermode == 2:
        out = [x for x in out if os.path.isdir(x)]
    return sorted(out)

def dictmerge(x, y):
    """
    Merge two dictionaries and return the result.
    :param x: a dictionary
    :param y: another dictionary
    :return: The merge of the two dictionaries.
    """
    z = x.copy()
    z.update(y)
    return z

def getNamespaces(xml):
    """
    Get the namespace definition of an xml file.
    :param xml: The path to an xml file
    :return: A dictionary with (short_name, url) as (key,value pairs.)
    """

    namespaces = {}
    infile = xml if "readline" in dir(xml) else open(xml, "r")
    # calling 'for line in infile:' will cause an error later on!
    namespaces = {}
    while True:
        line = infile.readline()
        if not line:
            break
        if "xmlns:" in line:
            namespaces = dictmerge(namespaces, ([tuple(x.replace("xmlns:", "").replace('"', '').split("=")) for x in line.split() if x.startswith("xmlns")]))
    # reset file pointer
    infile.seek(0)

    if isinstance(xml, str):
        infile.close()
    return namespaces