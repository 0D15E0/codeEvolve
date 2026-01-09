import React from 'react';
import { Code2 } from 'lucide-react';
import { Scenario } from '@/types';

export const filesystemScenario: Scenario = {
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

1. \`add_file(path, size)\`
   * Stores file. Returns \`true\`. 
   * Returns \`false\` if file already exists.

2. \`delete_file(path)\`
   * Removes file. Returns \`true\`. 
   * Returns \`false\` if file doesn't exist.

3. \`get_file_size(path)\`
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

1. \`backup_system()\`
   * Creates a snapshot of the current state.
   * Returns an integer \`backup_id\` (starting from 0, increments by 1).

2. \`restore_system(backup_id)\`
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
};