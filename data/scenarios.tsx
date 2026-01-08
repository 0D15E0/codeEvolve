import React from 'react';
import { Database, Code2, BookOpen } from 'lucide-react';
import { Scenario } from '@/types';

export const SCENARIOS: Scenario[] = [
  {
    id: "banking",
    title: "Banking System",
    difficulty: "Medium",
    icon: <Database className="text-blue-400" />,
    summary: "Build a transactional ledger with fraud detection, analytics, and scheduled payments. (eBay/Capital One style)",
    levels: [
      {
        id: 1,
        title: "Level 1: Core Banking",
        description: `
**Goal:** Implement the basic ledger for a banking system.

**Requirements:**
1. \`create_account(timestamp, account_id)\`: Returns \`true\` if created, \`false\` if exists.
2. \`deposit(timestamp, account_id, amount)\`: Returns new balance or \`None\`.
3. \`transfer(timestamp, from_id, to_id, amount)\`: Transfers funds. Returns new sender balance or \`None\` if invalid/insufficient funds.

**Example:**
\`\`\`python
bank.create_account(1, "A")
bank.deposit(2, "A", 100)
bank.transfer(3, "A", "B", 50) # Returns None (B doesn't exist)
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
    assert s.create_account(1, "A") == True
    assert s.create_account(1, "A") == False
    assert s.deposit(2, "A", 100) == 100
    assert s.deposit(2, "B", 100) == None
    assert s.transfer(3, "A", "B", 50) == None
    s.create_account(1, "B")
    assert s.transfer(4, "A", "B", 50) == 50
    print("ALL_TESTS_PASSED")
except Exception as e:
    print(f"TEST_FAIL: {e}")
`
      },
      {
        id: 2,
        title: "Level 2: Analytics",
        description: "**Feature:** Implement `get_top_spenders(k)`. Track outgoing transfers.",
        starterCode: "",
        testCode: `print("ALL_TESTS_PASSED")`
      },
      {
        id: 3,
        title: "Level 3: Scheduling",
        description: "**Feature:** Implement `schedule_payment(...)`. Handle future transactions.",
        starterCode: "",
        testCode: `print("ALL_TESTS_PASSED")`
      }
    ]
  },
  {
    id: "filesystem",
    title: "In-Memory File System",
    difficulty: "Hard",
    icon: <Code2 className="text-green-400" />,
    summary: "Design a file storage system supporting copy, backups, and restoring deleted files. (Dropbox/Google Drive style)",
    levels: [
      {
        id: 1,
        title: "Level 1: Basic Storage",
        description: `
**Goal:** Create a class to manage files.

**Requirements:**
1. \`add_file(path, size)\`: Returns \`true\` if added.
2. \`delete_file(path)\`: Returns \`true\` if deleted.
3. \`get_file_size(path)\`: Returns size or \`None\`.
`,
        starterCode: `class FileStorage:
    def __init__(self):
        self.files = {}

    def add_file(self, path, size):
        pass`,
        testCode: `print("ALL_TESTS_PASSED")`
      }
    ]
  },
  {
    id: "library",
    title: "Library Management",
    difficulty: "Easy",
    icon: <BookOpen className="text-purple-400" />,
    summary: "Manage book inventory, borrowing limits, and popularity tracking. (Amazon/Audible style)",
    levels: [
        {
            id: 1,
            title: "Level 1: Inventory",
            description: "Implement `add_book` and `search_by_prefix`.",
            starterCode: "class Library:\n    pass",
            testCode: "print('ALL_TESTS_PASSED')"
        }
    ]
  }
];