import json
from pprint import pprint



def flarify(hierarchy, root_name):
    """ Provided a JSON hierarchy, converts it to a flare-2 format."""
    result = dict()
    tmp = list()

    for entry in hierarchy.keys():
        if isinstance(hierarchy[entry], dict):
            new_hierarchy = hierarchy[entry]
            tmp.append(flarify(new_hierarchy, entry))
        else:
            tmp.append({"name":entry, "value":hierarchy[entry]})

    result.update({"name":root_name, "children":tmp})

    return result


if __name__=="__main__":
    filename = "example.json"
    with open(filename) as f:
        data = f.read()
        hierarchy = json.loads(data)

    result = flarify(hierarchy, "ROOT NODE")

    print(result)
