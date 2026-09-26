/**
 * CAPITAL AI — MERKLE & PAPER TRADING ENGINE TESTS (WP-4)
 */

import { MerkleTree, sha256Sync } from '../../utils/merkleTree';
import { globalPaperTradingEngine } from '../../services/paperTradingEngine';

export function runMerkleAndPaperTestSuite(): { passed: boolean; results: string[] } {
  const results: string[] = [];
  let allPassed = true;

  results.push('[WP-4 TEST 1] Verifying SHA-256 Merkle Tree Proof Generation & Root Matching...');
  const testData = ['Tick_NVDA_128.5', 'Tick_AAPL_224.0', 'Tick_BTC_64200.0', 'Tick_ETH_3450.0'];
  const tree = new MerkleTree(testData);
  const root = tree.getRoot();

  if (root && root.length === 64) {
    results.push(`  ✓ Merkle Root generated: ${root.slice(0, 16)}... (Length: 64 hex chars)`);
  } else {
    allPassed = false;
    results.push('  ✗ Invalid Merkle root format.');
  }

  // Verify Proof for each leaf
  for (let i = 0; i < testData.length; i++) {
    const proof = tree.getProof(i);
    if (proof.verified && proof.root === root) {
      results.push(`  ✓ Leaf [${i}] cryptographic proof path verified against root.`);
    } else {
      allPassed = false;
      results.push(`  ✗ Leaf [${i}] verification failed.`);
    }
  }

  results.push('[WP-4 TEST 2] Verifying Paper Trading Engine Order Submission & Risk Circuit...');
  // Submit an order without human approval
  const order1 = globalPaperTradingEngine.submitOrder({
    symbol: 'ETH/USDT',
    side: 'buy',
    type: 'market',
    quantity: 1.0,
    price: 3450.0,
  });

  if (order1.status === 'filled' && order1.evidenceBundle?.merkleRoot) {
    results.push(`  ✓ Order executed: Filled at ${order1.executedPrice?.toFixed(2)} with Merkle Evidence Attached.`);
  } else {
    allPassed = false;
    results.push(`  ✗ Order 1 execution failed: Status = ${order1.status}`);
  }

  // Test Human Approval Gate (AP-004)
  results.push('[WP-4 TEST 3] Verifying AP-004 Human Approval Gate on Orders...');
  const pendingOrder = globalPaperTradingEngine.submitOrder({
    symbol: 'BTC/USDT',
    side: 'buy',
    type: 'market',
    quantity: 0.05,
    price: 64000.0,
    requireHumanApproval: true,
  });

  if (pendingOrder.status === 'pending_approval') {
    results.push('  ✓ AP-004 enforced: Order held in pending_approval state.');
    // Approve order
    const approved = globalPaperTradingEngine.approveOrder(pendingOrder.id);
    const updatedState = globalPaperTradingEngine.getState();
    const approvedOrder = updatedState.orders.find((o) => o.id === pendingOrder.id);

    if (approved && approvedOrder?.status === 'filled') {
      results.push('  ✓ Human operator approval succeeded, order filled with evidence root.');
    } else {
      allPassed = false;
      results.push('  ✗ Approval flow failed.');
    }
  } else {
    allPassed = false;
    results.push('  ✗ Approval gate failed to hold order.');
  }

  return { passed: allPassed, results };
}
