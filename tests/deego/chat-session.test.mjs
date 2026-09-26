import test from 'node:test';
import assert from 'node:assert/strict';
import { createChatSender, loadDeegoPolicies, REQUIRED_POLICY_IDS } from '../../src/lib/deegoChatSession.js';
const rows = () => REQUIRED_POLICY_IDS.map(id => ({ id, summary: `Rule ${id}`, is_permanent: true, importance_score: 10, source: 'test fixture' }));
const conv = { id: 'conversation-1', agent_name: 'deego_master_ai' };
function fixture() {
  const calls = [];
  const client = {
    auth: { me: async () => ({ role: 'admin', email: 'ganozwaye@gmail.com' }) },
    entities: { AgentMemory: { filter: async (q, sort, limit, skip, fields) => {
      calls.push(['read', q, sort, limit, skip, fields]); return rows().slice(skip, skip + limit);
    } } },
    agents: {
      createConversation: async () => { calls.push(['create']); return conv; },
      addMessage: async (c, m) => { calls.push(['send', c, m]); return {}; },
    },
  };
  return { client, calls };
}
const args = { agentName: 'deego_master_ai', conversation: conv, content: 'Help me with today.' };
const code = expected => error => error.code === expected;

test('all mandatory policies are read across pages, with no silent truncation', async () => {
  const { client, calls } = fixture();
  const result = await loadDeegoPolicies(client, { pageSize: 2 });
  assert.equal(result.records.length, 3);
  assert.deepEqual(calls.map(c => c[4]), [0, 2]);
  assert.deepEqual(calls[0][1], { is_permanent: true, importance_score: { $gte: 9 } });
});
test('all extra high-priority policies are preserved, not just the three required IDs', async () => {
  const { client } = fixture(); const all = [...rows(), { ...rows()[0], id: 'extra', summary: 'Full extra rule' }];
  client.entities.AgentMemory.filter = async (_, __, limit, skip) => all.slice(skip, skip + limit);
  assert.equal((await loadDeegoPolicies(client, { pageSize: 2 })).records.length, 4);
});
test('missing required policy blocks before conversation creation or model call', async () => {
  const { client, calls } = fixture(); client.entities.AgentMemory.filter = async () => rows().slice(1);
  await assert.rejects(createChatSender(client).send({ ...args, conversation: null }), code('policy_unavailable'));
  assert.equal(calls.length, 0);
});
test('non-owner and owner lookalikes cannot read policy context or send', async () => {
  for (const user of [null, {role:'admin',email:'ganozwaye@gmail.com.evil'}, {role:'user',email:'ganozwaye@gmail.com'}]) {
    const { client, calls } = fixture(); client.auth.me = async () => user;
    await assert.rejects(createChatSender(client).send(args), code('policy_unavailable'));
    assert.equal(calls.length, 0);
  }
});
test('unreadable policies fail closed', async () => {
  const { client } = fixture(); client.entities.AgentMemory.filter = async () => { throw Error('private provider details'); };
  await assert.rejects(loadDeegoPolicies(client), e => e.code === 'policy_unavailable' && !e.message.includes('private provider'));
});
test('repeated pages fail instead of claiming complete coverage', async () => {
  const { client } = fixture(); client.entities.AgentMemory.filter = async () => rows().slice(0,2);
  await assert.rejects(loadDeegoPolicies(client, {pageSize:2}), code('policy_unavailable'));
});
test('pagination limit blocks instead of discarding remaining rules', async () => {
  const { client } = fixture();
  await assert.rejects(loadDeegoPolicies(client, {pageSize:2,maxPages:1}), code('policy_unavailable'));
});
test('context budget blocks instead of truncating mandatory rules', async () => {
  const { client } = fixture();
  await assert.rejects(loadDeegoPolicies(client, {maxChars:10}), code('policy_unavailable'));
});
test('malformed responses and blank rules fail closed', async () => {
  for (const data of [{}, [{...rows()[0],summary:''}], [{...rows()[0],is_permanent:false}]]) {
    const {client}=fixture();client.entities.AgentMemory.filter=async()=>data;
    await assert.rejects(loadDeegoPolicies(client),code('policy_unavailable'));
  }
});
test('user text is unchanged and rule context is supplied separately', async () => {
  const { client, calls } = fixture();
  const result = await createChatSender(client).send(args);
  const message = calls.find(c=>c[0]==='send')[2];
  assert.equal(message.content,args.content); assert.equal(message.role,'user');
  assert.equal(message.custom_context[0].data.records.length,3); assert.equal(result.policyCount,3);
});
test('preflight happens before create and the new conversation is retained before send', async () => {
  const {client,calls}=fixture();
  await createChatSender(client).send({...args,conversation:null,onCreated:c=>calls.push(['accepted',c.id])});
  assert.deepEqual(calls.map(c=>c[0]),['read','create','accepted','send']);
});
test('double submit is single-flight even before a UI render', async () => {
  const {client,calls}=fixture();let release;
  client.auth.me=()=>new Promise(resolve=>{release=resolve;});
  const sender=createChatSender(client);const first=sender.send(args);
  await assert.rejects(sender.send(args),code('busy'));
  release({role:'admin',email:'ganozwaye@gmail.com'});await first;
  assert.equal(calls.filter(c=>c[0]==='send').length,1);
});
test('an uncertain send never retries automatically or permits a blind second send', async () => {
  const {client,calls}=fixture(); client.agents.addMessage=async()=>{calls.push(['failed-send']);throw Error('offline');};
  const sender=createChatSender(client);
  await assert.rejects(sender.send(args),code('delivery_unconfirmed'));
  await assert.rejects(sender.send(args),code('delivery_unconfirmed'));
  assert.equal(calls.filter(c=>c[0]==='failed-send').length,1);
  sender.acknowledgeDeliveryReview();client.agents.addMessage=async()=>{};
  assert.equal((await sender.send(args)).policyCount,3);
});
test('unconfirmed conversation creation does not call the model', async () => {
  const {client,calls}=fixture();client.agents.createConversation=async()=>{throw Error('offline');};
  await assert.rejects(createChatSender(client).send({...args,conversation:null}),code('delivery_unconfirmed'));
  assert.equal(calls.filter(c=>c[0]==='send').length,0);
});
test('wrong agent conversation fails before reads or writes', async () => {
  const {client,calls}=fixture();
  await assert.rejects(createChatSender(client).send({...args,conversation:{...conv,agent_name:'other'}}),code('conversation_mismatch'));
  assert.equal(calls.length,0);
});
test('unmount or navigation during preflight does not submit', async () => {
  const {client,calls}=fixture();
  await assert.rejects(createChatSender(client).send({...args,isCurrent:()=>false}),code('cancelled'));
  assert.equal(calls.filter(c=>c[0]==='send').length,0);
});
test('policy timeout releases the send lock without starting a model request', async () => {
  const {client,calls}=fixture();client.entities.AgentMemory.filter=()=>new Promise(()=>{});
  await assert.rejects(createChatSender(client,{timeoutMs:5}).send(args),code('policy_unavailable'));
  assert.equal(calls.filter(c=>c[0]==='send').length,0);
});
test('unconfirmed send timeout stays blocked until explicit review', async () => {
  const {client}=fixture();client.agents.addMessage=()=>new Promise(()=>{});
  const sender=createChatSender(client,{sendTimeoutMs:5});
  await assert.rejects(sender.send(args),code('delivery_unconfirmed'));
  await assert.rejects(sender.send(args),code('delivery_unconfirmed'));
});
test('other agents do not receive Deego private memory', async () => {
  const {client,calls}=fixture();
  await createChatSender(client).send({...args,agentName:'other',conversation:{id:'other-1',agent_name:'other'}});
  assert.equal(calls.filter(c=>c[0]==='read').length,0);
  assert.equal(calls[0][2].custom_context,undefined);
});
