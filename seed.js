// Seed script to populate initial articles in MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const Article = require('./models/Article');

const seedArticles = [
  // ========== UNDERSTANDING EXTRAHAND ==========
  // Getting Started
  {
    title: 'What is ExtraHand',
    description: 'Learn about the ExtraHand platform and what we do',
    category: 'Understanding ExtraHand',
    subCategory: 'Getting Started',
    subSubCategory: 'What is ExtraHand',
    content: `# What is ExtraHand

ExtraHand is a trusted community platform that connects people who need help with local services and skilled helpers who are ready to work.

## How It Works

ExtraHand makes it simple to post tasks, receive offers from qualified helpers, and get things done.

### For Customers
- Post your task with details and budget
- Receive offers from verified helpers
- Choose the best person for the job
- Pay securely through the platform
- Get your task completed

### For Helpers
- Accept tasks that match your skills
- Earn money on your schedule
- Build your reputation and reviews
- Access growing opportunities
- Withdraw earnings anytime

## Why Choose ExtraHand

- **Secure Platform**: Safe payment and communication
- **Verified Helpers**: All helpers are checked and reviewed
- **Fair Pricing**: Transparent fees with no hidden costs
- **Quick Response**: Get offers in minutes
- **Customer Support**: We're here to help 24/7`,
    author: 'ExtraHand Team',
    views: 1200,
    isPublished: true
  },
  {
    title: 'How to get started as a customer',
    description: 'Step-by-step guide to posting your first task',
    category: 'Understanding ExtraHand',
    subCategory: 'Getting Started',
    subSubCategory: 'Getting Started as a Customer',
    content: `# How to Get Started as a Customer

## Step 1: Create Your Account
- Visit ExtraHand.com
- Click "Sign Up"
- Enter your email and password
- Verify your email address
- Complete your profile

## Step 2: Post Your First Task
- Click "Post a Task"
- Write a clear task title
- Describe what you need done
- Add your location
- Set your budget

## Step 3: Review Offers
- Helpers will send you offers
- Check their ratings and reviews
- Read their proposals
- Ask questions if needed

## Step 4: Accept an Offer
- Choose the best helper
- Accept their offer
- Payment is secured
- Task begins

## Step 5: Complete the Process
- Helper completes the work
- Review the work
- Release payment
- Leave a review

You're all set! Start posting tasks today.`,
    author: 'ExtraHand Team',
    views: 980,
    isPublished: true
  },
  {
    title: 'How to get started as a helper',
    description: 'Step-by-step guide to becoming a helper',
    category: 'Understanding ExtraHand',
    subCategory: 'Getting Started',
    subSubCategory: 'Getting Started as a Helper',
    content: `# How to Get Started as a Helper

## Step 1: Create Your Account
- Visit ExtraHand.com
- Click "Sign Up as a Helper"
- Enter your details
- Verify your email

## Step 2: Complete Your Profile
- Add a professional photo
- Write your bio
- List your skills
- Add portfolio items
- Verify your identity

## Step 3: Browse Available Tasks
- Check the Tasks section
- Filter by your skills
- Read task descriptions
- Review customer ratings

## Step 4: Send Offers
- Submit your offer for tasks
- Be clear about your approach
- Set competitive pricing
- Highlight relevant experience

## Step 5: Complete Tasks
- Get accepted offers
- Communicate with customers
- Complete quality work
- Get paid
- Build your reputation

Start earning today!`,
    author: 'ExtraHand Team',
    views: 875,
    isPublished: true
  },
  // Key Features
  {
    title: 'Understanding task posting',
    description: 'Everything you need to know about posting tasks',
    category: 'Understanding ExtraHand',
    subCategory: 'Key Features',
    subSubCategory: 'Tasks and Posting',
    content: `# Understanding Task Posting

## What Can You Post?

ExtraHand supports a wide variety of tasks:
- Home cleaning and maintenance
- Handyman services
- Graphic design
- Writing and content
- Virtual assistance
- Photography
- And much more!

## How to Write a Great Task

### Be Specific
- Clear task title
- Detailed description
- Expected timeline
- Required skills

### Set Fair Budget
- Research similar tasks
- Consider complexity
- Include all costs
- Be competitive

### Provide Examples
- Upload photos
- Share reference materials
- Describe your vision
- Explain requirements

## Task Status

Tasks go through several stages:
- Open (waiting for offers)
- In Progress (helper accepted)
- Complete (work done)
- Closed (payment released)

## Tips for Success

- Respond quickly to messages
- Be clear about expectations
- Check work thoroughly
- Rate your helper
- Build a reputation`,
    author: 'ExtraHand Team',
    views: 1150,
    isPublished: true
  },
  {
    title: 'Understanding the review system',
    description: 'How reviews and ratings work on ExtraHand',
    category: 'Understanding ExtraHand',
    subCategory: 'Key Features',
    subSubCategory: 'Reviews and Ratings',
    content: `# Understanding the Review System

## How Ratings Work

All users can rate each other from 1-5 stars:
- 5 stars: Excellent work, highly recommend
- 4 stars: Good work, would use again
- 3 stars: Acceptable, but could improve
- 2 stars: Below expectations
- 1 star: Poor quality or experience

## What Gets Reviewed

### For Customers
- Communication
- Payment reliability
- Task clarity
- Respect for helper time

### For Helpers
- Work quality
- Professionalism
- Reliability
- Communication

## Review Impact

- Better ratings = more opportunities
- Star rating shown on profile
- Reviews help others decide
- Helps build trust and reputation

## Best Practices

- Be honest in reviews
- Be specific about experience
- Highlight both positives and negatives
- Keep feedback constructive
- Help improve the community

## Responding to Reviews

You can respond to reviews to:
- Thank users for feedback
- Explain any issues
- Show commitment to improvement
- Build relationships`,
    author: 'ExtraHand Team',
    views: 820,
    isPublished: true
  },
  // About ExtraHand
  {
    title: 'Our mission and values',
    description: 'Learn about what ExtraHand stands for',
    category: 'Understanding ExtraHand',
    subCategory: 'About ExtraHand',
    subSubCategory: 'Mission and Values',
    content: `# Our Mission and Values

## Our Mission

To create a trusted community platform that connects people and enables them to help each other while building sustainable livelihoods.

## Our Core Values

### Trust
- Verified members
- Secure payments
- Transparent practices
- Fair dispute resolution

### Community
- Support local economy
- Build relationships
- Share skills and knowledge
- Grow together

### Quality
- High standards
- Continuous improvement
- Customer satisfaction
- Professional service

### Inclusivity
- Open to everyone
- Multiple task types
- Flexible scheduling
- Equal opportunities

## What We're Committed To

- Providing excellent customer support
- Maintaining platform security
- Fair pricing practices
- Building a diverse community
- Supporting social responsibility

Join us in making a difference!`,
    author: 'ExtraHand Team',
    views: 650,
    isPublished: true
  },
  {
    title: 'How we ensure platform safety',
    description: 'Our commitment to keeping you safe',
    category: 'Understanding ExtraHand',
    subCategory: 'About ExtraHand',
    subSubCategory: 'Safety and Security',
    content: `# How We Ensure Platform Safety

## Verification Process

- Identity verification
- Background checks
- Email verification
- Phone verification
- Address verification

## Payment Security

- SSL encryption
- PCI compliance
- Secure payment processing
- Fraud detection
- Money held by ExtraHand

## Community Standards

- Code of conduct
- Reporting system
- Quick response team
- Dispute resolution
- Account suspension rules

## Your Protection

- Secure communication
- No direct sharing of contact info
- Escrow payment system
- Refund protection
- Insurance coverage

## How to Stay Safe

- Use platform messaging
- Verify helper credentials
- Meet in public spaces
- Trust your instincts
- Report suspicious activity

We take safety seriously and continuously improve our systems.`,
    author: 'ExtraHand Team',
    views: 720,
    isPublished: true
  },
  // ========== PAYMENTS & REFUNDS ==========
  {
    title: 'Payment methods available',
    description: 'Learn about all accepted payment methods',
    category: 'Payments & Refunds',
    subCategory: 'Payment Methods',
    subSubCategory: 'Accepted Payment Methods',
    content: `# Payment Methods Available

## Credit and Debit Cards

We accept all major cards:
- Visa
- Mastercard
- American Express
- Discover

### Why Use Cards
- Instant processing
- Fraud protection
- Easy for recurring payments
- Widely accepted

## Digital Wallets

Fast and secure options:
- PayPal
- Apple Pay
- Google Pay
- Samsung Pay

### Benefits
- Quick checkout
- Extra security
- Convenient
- Mobile friendly

## Bank Transfers

For larger amounts:
- Direct bank transfer
- ACH transfers
- Wire transfers (international)

### When to Use
- Large transactions
- Lower fees
- Business accounts
- International payments

## Which Should I Use?

Choose based on:
- Amount being paid
- Convenience
- Security preferences
- Available balance
- Processing speed needed`,
    author: 'ExtraHand Team',
    views: 1100,
    isPublished: true
  },
  {
    title: 'Understanding service fees',
    description: 'Complete breakdown of how fees work',
    category: 'Payments & Refunds',
    subCategory: 'Pricing Information',
    subSubCategory: 'Service Fees',
    content: `# Understanding Service Fees

## Customer Service Fees

When you post a task:
- 0-500 INR: 10% fee
- 501-2000 INR: 8% fee
- 2001+ INR: 5% fee

## Helper Service Fees

When you complete tasks:
- Standard: 15% fee
- Top-rated helpers: 10% fee
- Premium members: 8% fee

## What's Included

Your fee covers:
- Secure payment processing
- Customer support
- Dispute resolution
- Insurance coverage
- Platform maintenance
- Fraud protection

## Example Costs

**Customer posts 1000 INR task:**
- Service fee: 80 INR (8%)
- Total customer pays: 1080 INR

**Helper completes task:**
- Helper fee: 150 INR (15%)
- Helper receives: 850 INR

## Fee Discounts

- Build reputation = lower fees
- Bulk posting = discounts
- Annual membership = savings
- Referral bonuses available

## Questions?

Check your invoice for details or contact support.`,
    author: 'ExtraHand Team',
    views: 1300,
    isPublished: true
  },
  {
    title: 'How to request a refund',
    description: 'Step-by-step refund process',
    category: 'Payments & Refunds',
    subCategory: 'Refunds and Disputes',
    subSubCategory: 'How to Get a Refund',
    content: `# How to Request a Refund

## When You Can Request a Refund

- Task not completed
- Work quality issues
- Helper cancelled last minute
- Service not delivered
- Platform errors

## Refund Process

### Step 1: Contact Helper
- Message them first
- Explain the issue
- Give them 48 hours to respond
- Document conversation

### Step 2: Open Dispute
- Go to task details
- Click "Request Refund"
- Provide evidence
- Explain clearly

### Step 3: Mediation
- Our team reviews both sides
- Checks evidence
- Makes fair decision
- Notifies both parties

### Step 4: Resolution
- Refund processed
- Money back to original payment
- Takes 5-7 business days

## Refund Types

- **Full Refund**: Task not done
- **Partial Refund**: Incomplete work
- **No Refund**: Work completed as agreed

## Timeline

- Review: 2-3 business days
- Decision: 24 hours
- Processing: 5-7 business days

## Tips for Success

- Act quickly
- Provide evidence
- Be reasonable
- Stay professional
- Document everything`,
    author: 'ExtraHand Team',
    views: 950,
    isPublished: true
  },
  // ========== TIPS FOR CUSTOMERS ==========
  {
    title: 'How to choose the right helper',
    description: 'Tips for selecting the best helper',
    category: 'Tips for Customers',
    subCategory: 'Getting Help',
    subSubCategory: 'Choosing Helpers',
    content: `# How to Choose the Right Helper

## Check Their Profile

- View ratings (aim for 4+ stars)
- Read customer reviews
- Check completion rate
- See their portfolio
- Verify verification badges

## Evaluate Experience

- How many similar tasks completed
- Years of experience
- Specific skills listed
- Customer testimonials
- Before/after photos

## Ask Questions

Before accepting:
- Ask about approach
- Confirm timeline
- Discuss budget details
- Request references
- Clarify expectations

## Red Flags

Avoid if they:
- Have no reviews
- Offer suspiciously low prices
- Don't answer questions
- Want payment off-platform
- Seem unprofessional

## Green Flags

Good signs:
- High ratings with many reviews
- Detailed proposals
- Quick responses
- Professional communication
- Relevant experience

## Making Your Decision

1. Compare at least 3 offers
2. Review profiles thoroughly
3. Ask clarifying questions
4. Check availability
5. Trust your instincts`,
    author: 'ExtraHand Team',
    views: 1400,
    isPublished: true
  },
  {
    title: 'Best practices for communication',
    description: 'Tips for effective communication with helpers',
    category: 'Tips for Customers',
    subCategory: 'Getting Help',
    subSubCategory: 'Communication Tips',
    content: `# Best Practices for Communication

## Be Clear and Detailed

In task descriptions:
- Specific requirements
- Expected timeline
- Budget clarity
- Examples or references
- Any special requests

## During Communication

- Use platform messaging
- Respond promptly
- Be professional
- Ask questions
- Confirm details

## Setting Expectations

Make sure helper understands:
- Exact deliverables
- Quality standards
- Timeline details
- Payment schedule
- How to handle changes

## Providing Feedback

- Give constructive comments
- Highlight what's working
- Suggest improvements
- Be respectful
- Document feedback

## Handling Issues

If problems arise:
- Address immediately
- Stay calm and professional
- Discuss solutions
- Give helper chance to fix
- Escalate if needed

## After Completion

- Thank the helper
- Leave honest review
- Provide constructive feedback
- Build relationship
- Consider for future tasks

Good communication = successful projects!`,
    author: 'ExtraHand Team',
    views: 780,
    isPublished: true
  },
  // ========== ACCOUNT MANAGEMENT ==========
  {
    title: 'How to create your profile',
    description: 'Setting up a complete and attractive profile',
    category: 'Login/Account Management',
    subCategory: 'Account Setup',
    subSubCategory: 'Profile Creation',
    content: `# How to Create Your Profile

## Profile Photo

- Use a clear, professional photo
- Show your face
- Good lighting
- Simple background
- Recent photo

## Bio and Introduction

Write compelling bio:
- Your skills and expertise
- Years of experience
- What you're good at
- Your approach to work
- Availability

## Skills and Experience

List your strengths:
- Core competencies
- Certifications
- Relevant experience
- Areas of expertise
- Special skills

## Portfolio Items

Show your work:
- Before and after photos
- Completed projects
- Quality samples
- Customer testimonials
- Awards or recognitions

## Verification

Complete verifications:
- Email verification
- Phone verification
- ID verification (optional)
- Address verification
- Background check

## Contact Information

Update your details:
- Phone number
- Email address
- Service area
- Availability
- Preferred contact method

## Tips for Success

- Be honest and accurate
- Keep it updated
- Show personality
- Highlight strengths
- Make it professional`,
    author: 'ExtraHand Team',
    views: 920,
    isPublished: true
  },
  {
    title: 'Account security and privacy',
    description: 'Keep your account safe and secure',
    category: 'Login/Account Management',
    subCategory: 'Security',
    subSubCategory: 'Account Security',
    content: `# Account Security and Privacy

## Strong Password

Create secure password:
- At least 8 characters
- Mix uppercase and lowercase
- Include numbers and symbols
- Avoid common words
- Don't reuse passwords

## Two-Factor Authentication

Enable 2FA:
- Go to Security Settings
- Choose SMS or app-based
- Follow setup steps
- Save backup codes
- Test it works

## What NOT to Do

Never:
- Share your password
- Use same password everywhere
- Save passwords on public computers
- Click suspicious links
- Trust unknown emails

## Privacy Settings

Control what's visible:
- Profile visibility
- Contact information
- Activity history
- Search visibility
- Email preferences

## Recognizing Phishing

Be careful of:
- Suspicious emails
- Requests for password
- Urgent action requests
- Unusual links
- Poor spelling/grammar

## If Compromised

Act quickly:
- Change password immediately
- Enable 2FA
- Review activity
- Check connected accounts
- Contact support

Your security is our priority!`,
    author: 'ExtraHand Team',
    views: 680,
    isPublished: true
  },
  // ========== TRUST & SAFETY ==========
  {
    title: 'Safety guidelines for meetings',
    description: 'How to stay safe when meeting helpers',
    category: 'Trust & Safety',
    subCategory: 'Personal Safety',
    subSubCategory: 'Meeting Safety',
    content: `# Safety Guidelines for Meetings

## Before Meeting

Prepare safely:
- Verify helper profile thoroughly
- Check reviews and ratings
- Tell someone where you're going
- Share location with trusted friend
- Keep emergency numbers handy

## Choose Safe Location

For in-person work:
- Meet in public areas first
- Well-lit locations
- During daytime hours
- Have witnesses present
- Know the area well

## During Meeting

Stay safe:
- Keep phone charged and accessible
- Let friend know when done
- Trust your gut feelings
- Stay aware of surroundings
- Keep valuables secured

## Communication

Stay connected:
- Keep messages on platform
- Don't share personal contact early
- Document agreements
- Get everything in writing
- Save all communications

## Red Flags

Watch for:
- Pressure to pay cash
- Requests for personal info
- Wanting to work in private
- Changing agreed terms
- Unprofessional behavior

## If Something Feels Wrong

- Trust your instincts
- Politely excuse yourself
- Move to public area
- Contact ExtraHand support
- Report to authorities if needed

## Emergency Contacts

- Emergency: 911
- ExtraHand Support: support@extrahand.com
- Non-emergency: Local police

Your safety comes first!`,
    author: 'ExtraHand Team',
    views: 850,
    isPublished: true
  },
  {
    title: 'Reporting and dispute resolution',
    description: 'How to report issues and resolve disputes',
    category: 'Trust & Safety',
    subCategory: 'Community Guidelines',
    subSubCategory: 'Reporting Issues',
    content: `# Reporting and Dispute Resolution

## What Can You Report

Report violations:
- Inappropriate behavior
- Unsafe practices
- Fraud or scams
- Poor quality work
- Code of conduct violations
- Harassment or abuse

## How to Report

### In-App Reporting
- Click report button
- Select issue type
- Provide details
- Attach evidence
- Submit report

### Contact Support
- Email: support@extrahand.com
- Phone: 1-800-EXTRA-HELP
- Chat: Available 24/7
- Website: File ticket

## Investigation Process

- Report reviewed
- Both parties contacted
- Evidence collected
- Investigation conducted
- Decision made
- Resolution implemented

## Resolution Options

Possible outcomes:
- Issue resolved between parties
- Refund issued
- Account warning
- Account suspension
- Account termination

## Dispute Timeline

- Report: 24 hours to file
- Initial review: 2-3 days
- Investigation: 5-10 days
- Decision: 24-48 hours
- Resolution: 5-7 days

## Prevention Tips

- Choose carefully
- Communicate clearly
- Document everything
- Set expectations
- Get agreements in writing
- Leave honest reviews

We're committed to fair resolution!`,
    author: 'ExtraHand Team',
    views: 710,
    isPublished: true
  }
];

async function seedDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing articles
    console.log('\n🗑️  Clearing existing articles...');
    await Article.deleteMany({});

    // Insert seed articles
    console.log('📝 Inserting seed articles...');
    const result = await Article.insertMany(seedArticles);
    console.log(`✅ Successfully inserted ${result.length} articles\n`);

    // Display article details organized by category
    console.log('📚 ARTICLES BY CATEGORY:\n');
    
    const categories = {};
    
    result.forEach(article => {
      if (!categories[article.category]) {
        categories[article.category] = {};
      }
      if (!categories[article.category][article.subCategory]) {
        categories[article.category][article.subCategory] = {};
      }
      if (!categories[article.category][article.subCategory][article.subSubCategory]) {
        categories[article.category][article.subCategory][article.subSubCategory] = [];
      }
      categories[article.category][article.subCategory][article.subSubCategory].push({
        title: article.title,
        id: article._id
      });
    });

    Object.keys(categories).forEach(category => {
      console.log(`\n📂 ${category.toUpperCase()}`);
      Object.keys(categories[category]).forEach(subCategory => {
        console.log(`   ├─ ${subCategory}`);
        Object.keys(categories[category][subCategory]).forEach(subSubCategory => {
          console.log(`   │  ├─ ${subSubCategory}`);
          categories[category][subCategory][subSubCategory].forEach((article, idx) => {
            const isLast = idx === categories[category][subCategory][subSubCategory].length - 1;
            console.log(`   │  ${isLast ? '└' : '├'}─ ${article.title}`);
          });
        });
      });
    });

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Total Articles: ${result.length}`);
    console.log(`   Categories: ${Object.keys(categories).length}`);
    
    let totalSubs = 0;
    let totalSubSubs = 0;
    Object.keys(categories).forEach(cat => {
      totalSubs += Object.keys(categories[cat]).length;
      Object.keys(categories[cat]).forEach(sub => {
        totalSubSubs += Object.keys(categories[cat][sub]).length;
      });
    });
    
    console.log(`   Subcategories: ${totalSubs}`);
    console.log(`   Sub-Subcategories: ${totalSubSubs}`);
    
    console.log('\n🚀 Ready to use! Start the server with: npm start');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
