import { AnalyticsRepositoryRegistry } from '@idl/mcp/analytics-repository';

// const parsed2 = IDLTypeHelper.parseIDLType(serialize);

// console.log(StringifyDataForLog('', parsed));
// console.log(StringifyDataForLog('', serialize));
// console.log(StringifyDataForLog('', parsed2));

async function Main() {
  const registry = new AnalyticsRepositoryRegistry([
    {
      url: 'http://localhost:9194',
    },
  ]);

  console.log(await registry.searchRepositories());
}

Main()
  .then(() => {
    process.exit();
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
