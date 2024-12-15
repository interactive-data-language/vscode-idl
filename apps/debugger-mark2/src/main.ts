import { IDLMachine } from '@idl/idl/idl-machine';
import { Sleep } from '@idl/shared';
import { spawn } from 'child_process';

async function Main() {
  /**
   * Start the IDL machine process
   */
  const idlMachineProcess = spawn(
    'C:\\Program Files\\NV5\\IDL92\\bin\\bin.x86_64\\idl_machine.exe'
  );

  /**
   * Start two-way communication with the machine
   */
  const machine = new IDLMachine(idlMachineProcess);

  machine.onNotification('tout', (msg) => console.log(msg));

  machine.onNotification('commandStarted', () => {
    console.log('Command started');
  });
  machine.onNotification('commandFinished', () => {
    console.log('Command finished');
  });
  machine.onNotification('interpreterStopped', (msg) => {
    console.log(`Interpreter stopped`);
    console.log(msg);
  });

  machine.onRequest('readIOLine', (msg) => {
    console.log(`read line`);
    console.log(msg);

    return 'I have been read!';
  });

  // const resp = await machine.sendRequest('history', 500);

  // machine.onNotification('serverReady', async () => {
  //   console.log('IDL Machine is ready');
  // });

  // machine.onNotification('tout', async (ev) => {
  //   console.log('Output from IDL', ev);
  // });

  await Sleep(1000);

  machine.sendNotification('exec', {
    string: "b = ''",
    flags: 0x1,
  });

  await Sleep(1000);

  // machine.sendNotification('exec', {
  //   string: 'print, b',
  //   flags: 0x1,
  // });

  // machine.sendNotification('exec', {
  //   string: 'read, b, prompt = "Give me input!"',
  //   flags: 0x1,
  // });

  // await Sleep(1000);

  machine.sendNotification('exec', {
    string: 'print, b',
    flags: 0x1,
  });
  // machine.sendNotification('exec', {
  //   string: '.compile plot',
  // });

  await Sleep(1000);

  // machine.sendNotification('exec', { string: 'print, 84' });

  // console.log(queue.parsed);

  // for (let i = 0; i < queue.parsed.length; i++) {
  //   JSON.parse(queue.parsed[i]);
  //   console.log(queue.parsed[i]);
  //   console.log('----');
  // }
}

Main()
  .then()
  .catch((err) => console.log(err));
