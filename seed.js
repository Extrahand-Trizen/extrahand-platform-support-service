// Seed script to populate initial articles in MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const Article = require('./models/Article');

const seedArticles = [
  {
    title: 'How to post your first task on ExtraHand',
    description: 'Step-by-step guide to creating your first task',
    category: 'Getting Started',
    content: `# How to Post Your First Task on ExtraHand

Welcome to ExtraHand! Posting your first task is easy. Follow these steps:

## Step 1: Create an Account
Visit ExtraHand.com and sign up for a free account. You'll need to provide:
- Your email address
- A secure password
- Basic profile information

## Step 2: Click "Post a Task"
Once logged in, click the "Post a Task" button in the top navigation bar.

## Step 3: Describe Your Task
Provide detailed information about what you need help with:
- Task title (be clear and concise)
- Detailed description
- Location
- When you need it done
- Your budget

## Step 4: Set Your Budget
Choose a budget that reflects the work required. You can:
- Set a fixed price
- Allow helpers to make offers
- Set a maximum budget

## Step 5: Review and Post
Review all details, then click "Post Task". Your task will be visible to helpers immediately!

## Tips for Success
- Be specific in your description
- Include photos if relevant
- Respond quickly to offers
- Check helper reviews and ratings

Need more help? Contact our support team anytime.`,
    author: 'ExtraHand Team',
    views: 1250,
    isPublished: true
  },
  {
    title: 'Understanding ExtraHand service fees',
    description: 'Learn about how our platform fees work',
    category: 'Payments & Refunds',
    content: `# Understanding ExtraHand Service Fees

ExtraHand charges a small service fee to keep our platform running and provide excellent service to both customers and helpers.

## For Customers

When you post a task, you only pay:
- The agreed task price
- A small service fee (typically 5-10% depending on task value)
- Payment processing fee (if applicable)

## For Helpers

When you complete a task, ExtraHand charges:
- A service fee of 15-20% (depending on your activity level)
- Lower fees for top-rated helpers
- No upfront costs or membership fees

## Payment Protection

Both parties are protected:
- Secure payment processing
- Money held until task completion
- Dispute resolution available
- Full refund policy

## Transparent Pricing

We believe in transparency:
- All fees shown before booking
- No hidden charges
- Clear breakdown in receipts
- Tax compliance assistance

Questions about fees? Contact our support team for clarification.`,
    author: 'ExtraHand Team',
    views: 890,
    isPublished: true
  },
  {
    title: 'How to become a top-rated helper',
    description: 'Tips and strategies to build your reputation',
    category: 'Tips for Helpers',
    content: `# How to Become a Top-Rated Helper

Building a strong reputation on ExtraHand opens doors to more opportunities and higher earnings.

## Complete Your Profile

A complete profile builds trust:
- Professional photo
- Detailed bio
- List your skills
- Verify your identity
- Add portfolio items

## Deliver Quality Work

Excellence is key:
- Meet deadlines consistently
- Communicate clearly
- Go the extra mile
- Pay attention to details
- Ask questions when unclear

## Build Your Ratings

Great reviews come from:
- Exceeding expectations
- Professional behavior
- Quick response times
- Fair pricing
- Problem-solving attitude

## Stay Active

Regular activity helps:
- Respond quickly to inquiries
- Update availability
- Accept suitable tasks
- Maintain high completion rate
- Keep skills updated

## Pro Tips

Advanced strategies:
- Specialize in specific task types
- Offer competitive pricing initially
- Request reviews from satisfied customers
- Showcase before/after photos
- Build repeat customer relationships

Ready to start? Begin accepting tasks today!`,
    author: 'ExtraHand Team',
    views: 2100,
    isPublished: true
  },
  {
    title: 'Account security best practices',
    description: 'Keep your ExtraHand account safe and secure',
    category: 'Account Management',
    content: `# Account Security Best Practices

Your account security is our priority. Follow these tips to keep your ExtraHand account safe.

## Strong Password

Create a secure password:
- At least 12 characters long
- Mix of uppercase and lowercase
- Include numbers and symbols
- Avoid common words
- Don't reuse passwords

## Two-Factor Authentication

Enable 2FA for extra security:
- Adds second verification step
- Protects against unauthorized access
- Available via SMS or app
- Easy to set up in settings

## Recognize Scams

Stay vigilant:
- Never share your password
- Beware of phishing emails
- Don't communicate outside platform
- Report suspicious activity
- Verify payment requests

## Safe Communication

Use platform messaging:
- All conversations tracked
- Protection for both parties
- Evidence for disputes
- Secure and encrypted
- No need to share personal contact

## Payment Safety

Protect your money:
- Only pay through ExtraHand
- Never use wire transfers
- Avoid cash transactions
- Check task details carefully
- Request receipts

## Regular Monitoring

Keep track:
- Review account activity
- Check payment history
- Update contact information
- Remove old payment methods
- Monitor notifications

Report any concerns immediately to our security team.`,
    author: 'ExtraHand Team',
    views: 750,
    isPublished: true
  },
  {
    title: 'How to get a refund',
    description: 'Step-by-step guide to the refund process',
    category: 'Payments & Refunds',
    content: `# How to Get a Refund

If you're not satisfied with a task, ExtraHand offers a fair refund process.

## Eligible Situations

Refunds are available when:
- Task not completed as agreed
- Helper cancels last minute
- Work quality issues
- Service not delivered
- Platform errors

## Request Process

Follow these steps:

### Step 1: Contact the Helper
- Message them first
- Explain the issue clearly
- Give them chance to resolve
- Document the conversation

### Step 2: Open a Dispute
If unresolved:
- Go to task details
- Click "Request Refund"
- Provide evidence
- Explain situation clearly

### Step 3: Mediation
Our team will:
- Review both sides
- Check evidence
- Make fair decision
- Process refund if approved

## Timeline

Expected timeframes:
- Dispute review: 2-3 business days
- Decision notification: within 24 hours
- Refund processing: 5-7 business days
- Money back to original payment method

## Full or Partial

Refund amounts vary:
- Full refund: task not done
- Partial refund: incomplete work
- Service fee may be retained
- Case-by-case evaluation

## Tips for Success

Improve chances:
- Provide clear evidence
- Be reasonable and fair
- Respond to requests quickly
- Maintain professional tone
- Document everything

## Prevention

Avoid issues:
- Read helper reviews
- Communicate clearly
- Check work before approving
- Release payment only when satisfied

Need help with a refund? Contact our support team anytime.`,
    author: 'ExtraHand Team',
    views: 1450,
    isPublished: true
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing articles
    console.log('Clearing existing articles...');
    await Article.deleteMany({});

    // Insert seed articles
    console.log('Inserting seed articles...');
    const result = await Article.insertMany(seedArticles);
    console.log(`Successfully inserted ${result.length} articles`);

    // Display article IDs
    result.forEach(article => {
      console.log(`- ${article.title} (ID: ${article._id})`);
    });

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
