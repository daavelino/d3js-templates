import json
import sys

def parse_input():
    result = {
        "input_file": None,
        "output_file": None
    }

    if len(sys.argv) < 2:
        print(f"Usage: python {sys.argv[0]} <input.json> [output.json]. Exiting.")
        sys.exit(1)

    result["input_file"] = sys.argv[1]

    if len(sys.argv) == 3:
        result["output_file"] = sys.argv[2]
    else:
        result["output_file"] = "ffd-" + result["input_file"]

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
    with open(filename) as f:
        data = f.read()
        hierarchy = json.loads(data)

    result = flarify(hierarchy, "ROOT NODE")

    with open(output, "w", encoding="utf-8") as f:
        json.dump(result, f)#, ensure_ascii=False, indent=4)

    print(f"Done. Please check the flarified file at {output}.")


if __name__=="__main__":
    run()
