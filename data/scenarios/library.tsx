import React from 'react';
import { BookOpen } from 'lucide-react';
import { Scenario } from '@/types';

export const libraryScenario: Scenario = {
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

1. \`add_book(isbn, title, author)\`
   * Returns \`true\` if added, \`false\` if ISBN exists.

2. \`remove_book(isbn)\`
   * Returns \`true\` if removed.

3. \`find_book(isbn)\`
   * Returns \`{title, author}\` dictionary or \`None\`.

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

1. \`borrow_book(isbn, user_id)\`
   * Returns \`true\` if successful.
   * Returns \`false\` if: book doesn't exist, is already borrowed, or user has >= 3 books.

2. \`return_book(isbn, user_id)\`
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
};