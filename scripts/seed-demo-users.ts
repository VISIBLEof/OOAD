import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

async function seedDemoUsers() {
  try {
    const demoUsers = [
      { name: 'Admin User', email: 'admin@example.com', password: 'Admin123!', role: 'admin' },
      { name: 'John Teacher', email: 'teacher@example.com', password: 'Teacher123!', role: 'teacher' },
      { name: 'Jane Student', email: 'student@example.com', password: 'Student123!', role: 'student' },
    ];

    for (const user of demoUsers) {
      const passwordHash = await bcrypt.hash(user.password, 10);
      
      try {
        await sql`
          INSERT INTO users (name, email, password_hash, role)
          VALUES (${user.name}, ${user.email}, ${passwordHash}, ${user.role})
        `;
        console.log(`Created ${user.role} user: ${user.email}`);
      } catch (error: any) {
        if (error.code === '23505') {
          console.log(`User already exists: ${user.email}`);
        } else {
          throw error;
        }
      }
    }

    console.log('Demo users seeded successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDemoUsers();
