import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectTask, listAll, supervise, isOwner } from '../../base44/functions/agentIntelligenceLoop/supervisor.mjs';
const now = Date.parse('2026-09-09T02:00:00Z');
test('owner guard rejects public, staff and email lookalikes', () => {
  for (const user of [null, {role:'admin',email:'attacker@example.com'}, {role:'user',email:'ganozwaye@gmail.com'}, {role:'admin',email:'ganozwaye@gmail.com.evil'}]) assert.equal(isOwner(user),false);
  assert.equal(isOwner({role:'admin',email:'GANOZWAYE@gmail.com'}),true);
});
test('delegation, waiting and deferral remain monitored', () => {
  for(const status of ['waiting','deferred','blocked','scheduled','in_progress']) {
    assert.equal(inspectTask({id:'1', status, owner:'Another agent'},'ActionItem',now).follow_up_due,true);
  }
});
test('completion requires evidence and a named, dated verification', () => {
  const task={id:'1',status:'complete'};
  assert.equal(inspectTask(task,'DailyDashboardTask',now).evidence_required,true);
  assert.equal(inspectTask({...task,completion_evidence:'source:1',completion_verified_by:'Deego',completion_verified_at:'bad'},'DailyDashboardTask',now).verified,false);
  assert.equal(inspectTask({...task,completion_evidence:'source:1',completion_verified_by:'Deego',completion_verified_at:'2026-09-10'},'DailyDashboardTask',now).verified,false);
  assert.equal(inspectTask({...task,completion_evidence:'source:1',completion_verified_by:'Deego',completion_verified_at:'2026-09-09T01:00:00Z'},'DailyDashboardTask',now).follow_up_due,false);
});
test('raised priority shortens follow-up despite a stale stored schedule', () => {
  const task={id:'1',priority:'critical',supervisor_checked_at:'2026-09-09T01:00:00Z',next_follow_up_at:'2026-09-12'};
  assert.equal(inspectTask(task,'ActionItem',now).follow_up_due,true);
  assert.equal(inspectTask({...task,priority:'low'},'ActionItem',now).follow_up_due,false);
});
test('pagination reads past the first page and fails on repeats or incomplete coverage', async () => {
  const rows=Array.from({length:5},(_,i)=>({id:String(i)}));
  assert.equal((await listAll({list:async(s,n,skip)=>rows.slice(skip,skip+n)},2)).length,5);
  await assert.rejects(()=>listAll({list:async()=>[{id:'1'},{id:'2'}]},2),/pagination/);
  await assert.rejects(()=>listAll({list:async(s,n,skip)=>rows.slice(skip,skip+n)},2,1),/limit/);
});
test('failed alert persistence never advances task follow-up', async () => {
  let updates=0;
  const tasks={list:async()=>[{id:'a',title:'Reply',status:'waiting'}],update:async()=>updates++};
  const entities={ActionItem:tasks,DailyDashboardTask:{list:async()=>[]},AdminNotification:{filter:async()=>[],create:async()=>{throw Error('offline')}}};
  await assert.rejects(()=>supervise(entities,now),/offline/);
  assert.equal(updates,0);
});
test('follow-up writes internal alert and cadence only; retry reuses alert', async () => {
  const rows=[{id:'a',title:'Delegated',status:'waiting',priority:'critical'}];
  let creates=0; let alert=null;
  const entities={
    DailyDashboardTask:{list:async()=>[]},
    ActionItem:{list:async()=>rows,update:async(id,patch)=>Object.assign(rows[0],patch)},
    AdminNotification:{filter:async()=>alert?[alert]:[],create:async(data)=>{creates++;alert={...data,id:'alert'}},update:async(id,data)=>Object.assign(alert,data)},
  };
  const first=await supervise(entities,now);
  assert.equal(first.followed_up,1); assert.equal(first.external_actions,0); assert.equal(first.whatsapp_delivered,false);
  assert.equal(rows[0].status,'waiting'); assert.equal(creates,1);
  assert.equal((await supervise(entities,now+60000)).followed_up,0);
  assert.equal((await supervise(entities,now+16*60000)).followed_up,1); assert.equal(creates,1);
});
