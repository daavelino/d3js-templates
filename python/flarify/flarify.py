import json
import sys

def parse_input():
    result = {
        "input_file": None,
        "output_file": None,
        "root_node": None
    }
    usage_msg = f"Usage: python {sys.argv[0]} -i <input.json> -o [output.json] -r [root_node name]. Exiting."

    if len(sys.argv) < 2:
        print(usage_msg)
        sys.exit(1)

    try:
        idx = sys.argv.index("-i")
        if idx:
            result["input_file"] = sys.argv[idx + 1]
    except:
        print(usage_msg)
        sys.exit(1)

    try:
        idx = sys.argv.index("-o")
        if idx:
            result["output_file"] = sys.argv[idx + 1]
    except:
        result["output_file"] = "ffd-" + result["input_file"]

    try:
        idx = sys.argv.index("-r")
        if idx:
            result["root_node"] = sys.argv[idx + 1]
    except:
        result["root_node"] = "ROOT_NODE"

    return result

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


def run():
    tmp = parse_input()

    filename = tmp["input_file"]
    output = tmp["output_file"]
    root_node = tmp["root_node"]

    with open(filename) as f:
        data = f.read()
        hierarchy = json.loads(data)

    result = flarify(hierarchy, root_node)

    with open(output, "w", encoding="utf-8") as f:
        json.dump(result, f)#, ensure_ascii=False, indent=4)

    print(f"Done. Please check the flarified file at {output}.")


if __name__=="__main__":
    run()
                                     

