import React from 'react';
import { Database, Code2, BookOpen, Layers, Cpu } from 'lucide-react';
import { Scenario } from '@/types';

export const SCENARIOS: Scenario[] = [
  // ==========================================================
  // SCENARIO 1: BANKING SYSTEM (The Classic)
  // ==========================================================
  {
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
1. \`create_account(timestamp, account_id)\`: 
   * Creates a new account with balance 0.
   * Returns \`true\` if successful, \`false\` if account already exists.
2. \`deposit(timestamp, account_id, amount)\`: 
   * Adds \`amount\` to account. Returns new integer balance or \`None\` if account missing.
3. \`transfer(timestamp, from_id, to_id, amount)\`: 
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
  },

  // ==========================================================
  // SCENARIO 2: FILE SYSTEM (The Google/Dropbox)
  // ==========================================================
  {
    id: "filesystem",
    title: "In-Memory File System",
    difficulty: "Hard",
    icon: <Code2 className="text-green-400" />,
    summary: "Design a file storage system with quota management, backups, and file restoration. (Dropbox/Google Drive style)",
    levels: [
      {
        id: 1,
        title: "Level 1: Basic Storage",
        description: `
**Goal:** Manage file creation and deletion.

**Requirements:**
1. \`add_file(path, size)\`: 
   * Stores file. Returns \`true\`. 
   * Returns \`false\` if file already exists.
2. \`delete_file(path)\`: 
   * Removes file. Returns \`true\`. 
   * Returns \`false\` if file doesn't exist.
3. \`get_file_size(path)\`: 
   * Returns integer size or \`None\`.

**Example:**
\`\`\`python
fs = FileSystem()
fs.add_file("/etc/hosts", 100) # True
fs.get_file_size("/etc/hosts") # 100
\`\`\`
`,
        starterCode: `class FileSystem:
    def __init__(self):
        self.files = {}

    def add_file(self, path, size):
        pass

    def delete_file(self, path):
        pass

    def get_file_size(self, path):
        pass`,
        testCode: `
try:
    fs = FileSystem()
    assert fs.add_file("/a", 10) == True
    assert fs.add_file("/a", 20) == False
    assert fs.get_file_size("/a") == 10
    assert fs.delete_file("/a") == True
    assert fs.delete_file("/a") == False
    assert fs.get_file_size("/a") == None
    print("ALL_TESTS_PASSED")
except Exception as e:
    print(f"TEST_FAIL: {e}")
`
      },
      {
        id: 2,
        title: "Level 2: Backup System",
        description: `
**Feature:** We need to support automated backups.

**New Methods:**
1. \`backup_system()\`: 
   * Creates a snapshot of the current state.
   * Returns an integer \`backup_id\` (starting from 0, increments by 1).
2. \`restore_system(backup_id)\`: 
   * Reverts the file system to the state at \`backup_id\`.
   * Returns \`true\` if successful, \`false\` if ID invalid.

**Example:**
\`\`\`python
fs.add_file("/A", 10)
id = fs.backup_system() # id=0, snapshot has /A

fs.add_file("/B", 20)   # Now has /A, /B
fs.restore_system(id)   # Revert to snapshot 0

fs.get_file_size("/B")  # None
\`\`\`
`,
        starterCode: `    # ... previous code

    def backup_system(self):
        pass

    def restore_system(self, backup_id):
        pass`,
        testCode: `
try:
    fs = FileSystem()
    fs.add_file("/A", 10)
    
    # Backup 0: Has /A
    bid = fs.backup_system()
    assert bid == 0, "First backup ID should be 0"
    
    # Modify State
    fs.add_file("/B", 20)
    fs.delete_file("/A")
    
    assert fs.get_file_size("/A") == None
    assert fs.get_file_size("/B") == 20
    
    # Restore 0
    res = fs.restore_system(bid)
    assert res == True
    
    # Check Revert
    assert fs.get_file_size("/A") == 10, "Restore failed to bring back /A"
    assert fs.get_file_size("/B") == None, "Restore failed to remove /B"
    
    # Invalid ID
    assert fs.restore_system(99) == False
    
    print("ALL_TESTS_PASSED")
except Exception as e:
    print(f"TEST_FAIL: {e}")
`
      },
      {
        id: 3,
        title: "Level 3: Filter & Delete",
        description: `
**Feature:** Admins need to clean up large files to save space.

**New Method:** \`delete_files_larger_than(size_limit)\`
* Deletes all files where \`file_size > size_limit\`.
* Returns the integer count of deleted files.
* **Important:** This change must be "backup-aware" (if we restore later, these files should come back).

**Example:**
\`\`\`python
fs.add_file("/video.mp4", 500)
fs.add_file("/text.txt", 10)
fs.delete_files_larger_than(100) # Returns 1 (deletes video.mp4)
\`\`\`
`,
        starterCode: `    # ... previous code

    def delete_files_larger_than(self, size_limit):
        pass`,
        testCode: `
try:
    fs = FileSystem()
    fs.add_file("/small", 10)
    fs.add_file("/medium", 50)
    fs.add_file("/large", 100)
    
    # Snapshot 0: Has all 3
    bid = fs.backup_system()
    
    # Delete > 40 (Removes medium and large)
    count = fs.delete_files_larger_than(40)
    assert count == 2, f"Should delete 2 files, got {count}"
    
    assert fs.get_file_size("/small") == 10
    assert fs.get_file_size("/medium") == None
    
    # Restore
    fs.restore_system(bid)
    assert fs.get_file_size("/medium") == 50, "Restore failed after batch delete"
    
    print("ALL_TESTS_PASSED")
except Exception as e:
    print(f"TEST_FAIL: {e}")
`
      }
    ]
  },

  // ==========================================================
  // SCENARIO 3: LIBRARY SYSTEM (Amazon/Audible)
  // ==========================================================
  {
    id: "library",
    title: "Digital Library",
    difficulty: "Easy",
    icon: <BookOpen className="text-purple-400" />,
    summary: "Manage book inventory, borrowing limits, and popularity tracking.",
    levels: [
      {
        id: 1,
        title: "Level 1: Inventory",
        description: `
**Goal:** Manage the collection of books.

**Requirements:**
1. \`add_book(isbn, title, author)\`: Returns \`true\` if added, \`false\` if ISBN exists.
2. \`remove_book(isbn)\`: Returns \`true\` if removed.
3. \`find_book(isbn)\`: Returns \`{title, author}\` dictionary or \`None\`.

**Example:**
\`\`\`python
lib = Library()
lib.add_book("101", "Dune", "Frank Herbert")
lib.find_book("101") # {"title": "Dune", "author": "Frank Herbert"}
\`\`\`
`,
        starterCode: `class Library:
    def __init__(self):
        self.books = {}

    def add_book(self, isbn, title, author):
        pass

    def remove_book(self, isbn):
        pass

    def find_book(self, isbn):
        pass`,
        testCode: `
try:
    lib = Library()
    assert lib.add_book("1", "A", "AuthA") == True
    assert lib.add_book("1", "B", "AuthB") == False
    
    info = lib.find_book("1")
    assert info['title'] == "A", "Metadata mismatch"
    
    assert lib.remove_book("1") == True
    assert lib.find_book("1") == None
    print("ALL_TESTS_PASSED")
except Exception as e:
    print(f"TEST_FAIL: {e}")
`
      },
      {
        id: 2,
        title: "Level 2: Borrowing System",
        description: `
**Feature:** Users can borrow books.

**Requirements:**
1. \`borrow_book(isbn, user_id)\`:
   * Returns \`true\` if successful.
   * Returns \`false\` if: book doesn't exist, is already borrowed, or user has >= 3 books.
2. \`return_book(isbn, user_id)\`:
   * Returns \`true\` if successful.
   * Returns \`false\` if book wasn't borrowed by this user.

**Example:**
\`\`\`python
lib.borrow_book("101", "user1") # True
lib.borrow_book("101", "user2") # False (Already borrowed)
\`\`\`
`,
        starterCode: `    # ... previous code

    def borrow_book(self, isbn, user_id):
        pass

    def return_book(self, isbn, user_id):
        pass`,
        testCode: `
try:
    lib = Library()
    lib.add_book("1", "T1", "A")
    lib.add_book("2", "T2", "A")
    lib.add_book("3", "T3", "A")
    lib.add_book("4", "T4", "A")
    
    # Basic Borrow
    assert lib.borrow_book("1", "U1") == True
    assert lib.borrow_book("1", "U2") == False, "Book already borrowed"
    
    # Return
    assert lib.return_book("1", "U2") == False, "Wrong user return"
    assert lib.return_book("1", "U1") == True
    assert lib.borrow_book("1", "U2") == True, "Should be available again"
    
    # Limit Check (Max 3)
    lib.borrow_book("2", "U_Limit")
    lib.borrow_book("3", "U_Limit")
    lib.borrow_book("4", "U_Limit")
    
    lib.add_book("5", "T5", "A")
    assert lib.borrow_book("5", "U_Limit") == False, "Max 3 books limit failed"
    
    print("ALL_TESTS_PASSED")
except Exception as e:
    print(f"TEST_FAIL: {e}")
`
      },
      {
        id: 3,
        title: "Level 3: Analytics",
        description: `
**Feature:** Track the most popular authors.

**New Method:** \`get_top_authors(k)\`
* Returns top \`k\` authors by total number of **completed borrows**.
* A borrow is "completed" only when \`return_book\` is called.
* Tie-breaker: Author name alphabetically.

**Example:**
\`\`\`python
# User borrows "Dune" (Frank Herbert) and returns it.
# User borrows "The Hobbit" (Tolkien) and keeps it.
# get_top_authors(1) -> ["Frank Herbert"]
\`\`\`
`,
        starterCode: `    # ... previous code

    def get_top_authors(self, k):
        pass`,
        testCode: `
try:
    lib = Library()
    lib.add_book("1", "Dune", "Frank")
    lib.add_book("2", "Hobbit", "Tolkien")
    
    # 1. Borrow but don't return (Should not count)
    lib.borrow_book("2", "U1")
    
    # 2. Borrow and Return (Counts)
    lib.borrow_book("1", "U1")
    lib.return_book("1", "U1")
    
    # 3. Borrow same book again (Counts as 2nd borrow)
    lib.borrow_book("1", "U2")
    lib.return_book("1", "U2")
    
    # Frank: 2 returns. Tolkien: 0 returns.
    
    top = lib.get_top_authors(1)
    assert top == ["Frank"], f"Expected ['Frank'], got {top}"
    
    print("ALL_TESTS_PASSED")
except Exception as e:
    print(f"TEST_FAIL: {e}")
`
      }
    ]
  }
];