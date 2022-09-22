import { promises as fs } from 'fs';

import {
  Logger, registerGenericNodes, Registry, validateGraphRegistry, writeNodeSpecsToJSON,
} from '../../../dist/lib/index';

async function main() {
  // Logger.onVerbose.clear();

  const outputPath = process.argv[2];
  if (outputPath === undefined) {
    throw new Error('no path specified');
  }

  const registry = new Registry();
  registerGenericNodes(registry.nodes);

  Logger.verbose('validating:');
  const errorList: string[] = [];
  Logger.verbose('validating registry');
  errorList.push(...validateGraphRegistry(registry));

  if (errorList.length > 0) {
    Logger.error(`${errorList.length} errors found:`);
    errorList.forEach((errorText, errorIndex) => {
      Logger.error(`${errorIndex}: ${errorText}`);
    });
    return;
  }

  await fs.writeFile(outputPath, JSON.stringify(writeNodeSpecsToJSON(registry), null, ' '), { encoding: 'utf-8' });
}

main();
