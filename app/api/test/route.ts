import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/utils';

export async function GET() {
  try {
    // Membuat tabel test jika belum ada
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS test_table (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      )
    `);

    // Insert data
    await executeQuery('INSERT INTO test_table (name) VALUES (?)', ['Test Name']);

    // Select data
    const selectResult = await executeQuery('SELECT * FROM test_table');

    // Update data
    await executeQuery('UPDATE test_table SET name = ? WHERE id = ?', ['Updated Name', 1]);

    // Delete data
    await executeQuery('DELETE FROM test_table WHERE id = ?', [1]);

    return NextResponse.json({ 
      message: 'CRUD operations successful', 
      result: selectResult 
    }, { status: 200 });
  } catch (error) {
    console.error('CRUD operations failed:', error);
    return NextResponse.json({ 
      message: 'CRUD operations failed', 
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}