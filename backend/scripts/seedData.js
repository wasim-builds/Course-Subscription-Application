import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Subscription from '../models/Subscription.js';

dotenv.config();

const seedData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected');

        // Clear existing data
        await User.deleteMany({});
        await Course.deleteMany({});
        await Subscription.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create dummy users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        const hashedAdminPassword = await bcrypt.hash('admin123', salt);

        const users = await User.insertMany([
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: hashedPassword
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: hashedPassword
            },
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: hashedAdminPassword
            }
        ]);
        console.log('👥 Created 3 dummy users');

        // Create courses
        const courses = await Course.insertMany([
            {
                title: 'Complete Web Development Bootcamp',
                description: 'Master HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build 10+ real-world projects and become a full-stack developer.',
                price: 4999,
                image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop'
            },
            {
                title: 'Python for Data Science',
                description: 'Learn Python programming, NumPy, Pandas, Matplotlib, and Machine Learning. Perfect for aspiring data scientists.',
                price: 3999,
                image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=450&fit=crop'
            },
            {
                title: 'Introduction to Programming',
                description: 'Free course covering programming fundamentals, logic, and problem-solving. Perfect for absolute beginners.',
                price: 0,
                image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=450&fit=crop'
            },
            {
                title: 'React & Redux Masterclass',
                description: 'Deep dive into React hooks, Redux, Context API, and modern React patterns. Build production-ready applications.',
                price: 2999,
                image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop'
            },
            {
                title: 'Git & GitHub Essentials',
                description: 'Free course on version control with Git and GitHub. Learn branching, merging, pull requests, and collaboration.',
                price: 0,
                image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=450&fit=crop'
            },
            {
                title: 'DevOps & Cloud Computing',
                description: 'Master Docker, Kubernetes, AWS, CI/CD pipelines, and cloud deployment strategies for modern applications.',
                price: 5999,
                image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop'
            },
            {
                title: 'UI/UX Design Fundamentals',
                description: 'Learn design principles, Figma, user research, wireframing, and prototyping. Create beautiful user experiences.',
                price: 3499,
                image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop'
            },
            {
                title: 'JavaScript ES6+ Modern Features',
                description: 'Free course covering arrow functions, destructuring, promises, async/await, and modern JavaScript features.',
                price: 0,
                image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=450&fit=crop'
            },
            {
                title: 'HTML & CSS Basics',
                description: 'Free beginner-friendly course on HTML5 and CSS3. Learn to build beautiful, responsive websites from scratch.',
                price: 0,
                image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=450&fit=crop'
            },
            {
                title: 'SQL Database Fundamentals',
                description: 'Free course on SQL basics, database design, queries, joins, and data manipulation. Perfect for beginners.',
                price: 0,
                image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=450&fit=crop'
            },
            {
                title: 'Agile & Scrum Basics',
                description: 'Free introduction to Agile methodologies, Scrum framework, sprints, and team collaboration practices.',
                price: 0,
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop'
            },
            {
                title: 'Linux Command Line Essentials',
                description: 'Free course on Linux terminal, bash commands, file management, and shell scripting basics.',
                price: 0,
                image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=450&fit=crop'
            },
            {
                title: 'Career Development & Resume Building',
                description: 'Free course on building your tech career, creating standout resumes, interview prep, and networking strategies.',
                price: 0,
                image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=450&fit=crop'
            }
        ]);
        console.log('📚 Created 13 courses (8 free, 5 paid)');

        console.log('\n✨ Database seeded successfully!');
        console.log('\n📝 Dummy User Credentials:');
        console.log('   Email: john@example.com | Password: password123');
        console.log('   Email: jane@example.com | Password: password123');
        console.log('   Email: admin@example.com | Password: admin123');
        console.log('\n🎉 Black Friday Promo Code: BFSALE25 (50% off)');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
