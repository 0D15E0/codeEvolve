import React from 'react';
import { Database } from 'lucide-react';
import { Scenario } from '@/types';

export const bankingScenario: Scenario = {
  id: "banking",
  title: "Banking System",
  difficulty: "Medium",
  icon: <Database className="text-blue-400" />,
  summary: "Build a transactional ledger with fraud detection, analytics, and scheduled payments. (eBay/Capital One style)",
  levels: [
    {
      id: 1,
      title: "Level 1: Core Ledger",
      description: `
**Goal:** Implement the basic ledger for a banking system.

**Requirements:**

1. \`create_account(timestamp, account_id)\`
   * Creates a new account with balance 0.
   * Returns \`true\` if successful, \`false\` if account already exists.

2. \`deposit(timestamp, account_id, amount)\`
   * Adds \`amount\` to account. Returns new integer balance or \`None\` if account missing.

3. \`transfer(timestamp, from_id, to_id, amount)\`
   * Transfers funds. Returns new sender balance.
   * Returns \`None\` if: accounts missing, insufficient funds, or source == destination.

**Example:**
\`\`\`python
bank = BankingSystem()
bank.create_account(1, "A")
bank.deposit(2, "A", 100)
bank.transfer(3, "A", "B", 50) # None (B doesn't exist)
\`\`\`
`,
      starterCode: `class BankingSystem:
    def __init__(self):
        self.accounts = {}

    def create_account(self, timestamp, account_id):
        pass

    def deposit(self, timestamp, account_id, amount):
        pass

    def transfer(self, timestamp, from_id, to_id, amount):
        pass`,
      testCode: `
try:
    s = BankingSystem()
    # Basic
    assert s.create_account(1, "A") == True, "Create A failed"
    assert s.create_account(1, "A") == False, "Duplicate create passed"
    assert s.deposit(2, "A", 100) == 100, "Deposit failed"
    assert s.deposit(2, "B", 100) == None, "Deposit to missing user passed"
    
    # Transfer
    s.create_account(1, "B")
    assert s.transfer(3, "A", "B", 40) == 60, "Transfer A->B failed"
    assert s.deposit(4, "B", 0) == 40, "Receiver balance wrong"
    
    # Edge Cases
    assert s.transfer(5, "A", "B", 1000) == None, "Overdraft passed"
    assert s.transfer(5, "A", "A", 10) == None, "Self-transfer passed"
    
    print("ALL_TESTS_PASSED")
except Exception as e:
    print(f"TEST_FAIL: {e}")
`
    },
    {
      id: 2,
      title: "Level 2: Analytics & Ranking",
      description: `
**Feature:** The Data Science team needs to track high-value activity.

**New Method:** \`get_top_spenders(k)\`
* Return a list of \`k\` account IDs that have **transferred the most money OUT**.
* **Tie-Breaking:** 1. Total Amount Outgoing (Descending)
    2. Account ID (Alphabetical Ascending)
* **Note:** Only successful \`transfer()\` calls count. Deposits do not count.

**Example:**
\`\`\`python
# A transfers 100 to B
# B transfers 50 to C
# C transfers 100 to A
# Top Spenders(2): ["A", "C"] 
# (Both sent 100, A is alphabetically before C)
\`\`\`
`,
      starterCode: `    # ... keep previous code
    
    def get_top_spenders(self, k):
        pass`,
      testCode: `
try:
    s = BankingSystem()
    s.create_account(1, "A"); s.create_account(1, "B"); s.create_account(1, "C")
    s.deposit(1, "A", 1000); s.deposit(1, "B", 1000); s.deposit(1, "C", 1000)
    
    # Transactions
    s.transfer(2, "A", "B", 100) # A sent 100
    s.transfer(3, "B", "C", 50)  # B sent 50
    s.transfer(4, "C", "A", 100) # C sent 100
    
    # Ties: A(100), C(100), B(50)
    # A vs C -> A comes first alphabetically
    
    assert s.get_top_spenders(1) == ["A"], f"Top 1 error: {s.get_top_spenders(1)}"
    assert s.get_top_spenders(2) == ["A", "C"], f"Top 2 error: {s.get_top_spenders(2)}"
    assert s.get_top_spenders(3) == ["A", "C", "B"], f"Top 3 error: {s.get_top_spenders(3)}"
    
    print("ALL_TESTS_PASSED")
except Exception as e:
    print(f"TEST_FAIL: {e}")
`
    },
    {
      id: 3,
      title: "Level 3: Scheduled Payments",
      description: `
**Feature:** Users can schedule transfers for the future.

**New Method:** \`schedule_payment(timestamp, from_id, to_id, amount, delay)\`
* Schedules a transfer to execute at \`timestamp + delay\`.
* Returns string \`"scheduled"\`.

**Critical Logic:**
* Before executing ANY operation (create, deposit, transfer, etc.), checking the current \`timestamp\`, you must first execute any scheduled payments that are **due** (scheduled_time <= current_timestamp).
* Payments processed in order of scheduled time.
* If a scheduled payment fails (e.g. insufficient funds *at that moment*), ignore it.

**Example:**
\`\`\`python
bank.deposit(1, "A", 100)
bank.schedule_payment(1, "A", "B", 50, 10) # Due at T=11

# At T=5, A withdraws money
bank.transfer(5, "A", "C", 80) # A has 20 left

# At T=12, next op happens. 
# System checks due payments. T=11 is due.
# A only has 20. Payment of 50 fails.
bank.deposit(12, "B", 0) 
\`\`\`
`,
      starterCode: `    # ... keep previous code

    def schedule_payment(self, timestamp, from_id, to_id, amount, delay):
        pass`,
      testCode: `
try:
    s = BankingSystem()
    s.create_account(1, "A"); s.create_account(1, "B")
    s.deposit(1, "A", 100)
    
    # Schedule A->B ($50) at T=11 (1+10)
    s.schedule_payment(1, "A", "B", 50, 10)
    
    # Intermediate Op at T=5 (Payment not due)
    s.transfer(5, "A", "B", 10) # A=90, B=10
    assert s.deposit(5, "A", 0) == 90, "Payment triggered too early"
    
    # Trigger at T=12
    # Payment (due 11) should fire now.
    # A=90. Sends 50. A=40. B=10+50=60.
    s.deposit(12, "A", 0)
    
    assert s.deposit(12, "A", 0) == 40, f"Scheduled payment failed. A={s.deposit(12, 'A', 0)}"
    assert s.deposit(12, "B", 0) == 60, "Receiver didn't get funds"
    
    print("ALL_TESTS_PASSED")
except Exception as e:
    print(f"TEST_FAIL: {e}")
`
    }
  ]
};