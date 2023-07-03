import { Sleep } from '@idl/shared';
import { CLIENT_ID, InitializeUsageMetrics } from '@idl/usage-metrics';

InitializeUsageMetrics(true);
console.log(CLIENT_ID);

Sleep(3000).then(() => {
  process.exit();
});
