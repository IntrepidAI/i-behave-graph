import Graph from '../Graph';
import GraphRegistry from '../GraphRegistry';
import {
  GraphJSON, InputJSON, LinkJSON, NodeJSON, VariableJSON,
} from './GraphJSON';

export default function writeGraphToJSON(graph: Graph, registry: GraphRegistry): GraphJSON {
  const graphJson: GraphJSON = { nodes: [], variables: [] };

  if (graph.name.length > 0) {
    graphJson.name = graph.name;
  }
  if (Object.keys(graph.metadata).length > 0) {
    graphJson.metadata = graph.metadata;
  }

  // save variables
  Object.values(graph.variables).forEach((variable) => {
    const variableJson: VariableJSON = {
      valueTypeName: variable.valueTypeName,
      name: variable.name,
      id: variable.id,
      initialValue: registry.values.get(variable.valueTypeName).serialize(variable.initialValue),
    };
    if (variable.label.length > 0) {
      variableJson.label = variable.label;
    }
    if (Object.keys(variable.metadata).length > 0) {
      variableJson.metadata = variable.metadata;
    }
    graphJson.variables.push(variableJson);
  });

  // save nodes
  Object.values(graph.nodes).forEach((node) => {
    const nodeJson: NodeJSON = {
      type: node.typeName,
      id: node.id,
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
          inputJson.value = registry.values.get(inputSocket.valueTypeName).serialize(inputSocket.value);
        } else {
          const linksJson: LinkJSON[] = [];
          inputSocket.links.forEach((nodeSocketRef) => {
            linksJson.push({
              nodeId: nodeSocketRef.nodeId,
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
