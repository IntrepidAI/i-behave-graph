import Graph from './Graph';
import {
  GraphJSON, InputJSON, LinkJSON, NodeJSON,
} from './GraphJSON';

export default function writeGraphToJSON(graph: Graph): GraphJSON {
  const graphJson: GraphJSON = { nodes: [] };

  if (graph.name.length > 0) {
    graphJson.name = graph.name;
  }
  if (Object.keys(graph.metadata).length > 0) {
    graphJson.metadata = graph.metadata;
  }

  // create new BehaviorNode instances for each node in the json.
  graph.nodes.forEach((node) => {
    const nodeJson: NodeJSON = {
      type: node.typeName,
    };
    if (node.label.length > 0) {
      nodeJson.label = node.label;
    }
    if (Object.keys(node.metadata).length > 0) {
      nodeJson.metadata = node.metadata;
    }

    if (node.inputSockets.length > 0) {
      const inputsJson: NodeJSON['inputs'] = {};

      node.inputSockets.forEach((inputSocket) => {
        const inputJson: InputJSON = {};

        if (inputSocket.links.length === 0) {
          inputJson.value = inputSocket.value;
        } else {
          const linksJson: LinkJSON[] = [];
          inputSocket.links.forEach((nodeSocketRef) => {
            linksJson.push({
              node: nodeSocketRef.nodeIndex,
              socket: nodeSocketRef.socketName,
            });
          });

          inputJson.links = linksJson;
        }

        inputsJson[inputSocket.name] = inputJson;
      });
      nodeJson.inputs = inputsJson;
    }

    graphJson.nodes.push(nodeJson);
  });

  return graphJson;
}
