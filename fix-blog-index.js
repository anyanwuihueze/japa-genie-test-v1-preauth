const fs = require('fs');
let content = fs.readFileSync('src/app/blog/page.tsx', 'utf8');

const oldStories = `  const stories = [
    {
      slug: 'rejection-risk-score',
      title: 'How Japa Genie Calculates Your Visa Rejection Risk Score',
      excerpt: 'Discover the 7 hidden factors embassies check that cause 68% of rejections.',
      author: 'Japa Genie Team',
      location: 'Lagos, Nigeria',
      outcome: '62% risk reduction',
      hook: '"My Japan SSW visa was rejected until I fixed my Proof of Funds risk score."',
      readTime: '5 min read'
    },
    {
      slug: 'amara-visa-rejection-reversal',
      title: 'From Heartbreak to Toronto: Amara\'s Visa Rejection Reversal',
      excerpt: 'Three rejections couldn\'t stop this Ivorian software engineer from reaching Canada.',
      author: 'Amara Kone',
      location: 'Côte d\'Ivoire → Toronto, Canada',
      outcome: 'CAD $85,000 salary',
      hook: '"They rejected me three times. The fourth time, I got my Canadian PR."',
      readTime: '5 min read'
    },
    {
      slug: 'kwame-teacher-to-uk-global-talent',
      title: 'The Impossible Dream: From Teacher to UK Global Talent',
      excerpt: 'Rural Ghana teacher proves everyone wrong with innovative EdTech approach.',
      author: 'Kwame Asante',
      location: 'Rural Ghana → London, UK',
      outcome: '£65,000 salary',
      hook: '"Everyone said teachers can\'t get UK Global Talent visas. I proved them wrong."',
      readTime: '6 min read'
    }
  ];`;

const newStories = `  const stories = [
    {
      slug: 'japan-truck-driver-visa',
      title: 'Japan Is Begging for Truck Drivers — Here is How Nigerians Can Get In Before the Rush',
      excerpt: 'Japan needs 270,000 drivers by 2030 and is actively looking beyond Asia. Most Africans do not know this door is open.',
      author: 'Japa Genie Team',
      location: 'Nigeria → Japan',
      outcome: '$28,000 to $38,000 annually',
      hook: '"Japan needs 270,000 drivers by 2030. Most Africans do not even know this door is open."',
      readTime: '6 min read'
    },
    {
      slug: 'schengen-back-door-strategy',
      title: 'UK and Canada Are Closing Doors — Smart Nigerians Are Using This Europe Back Door Instead',
      excerpt: 'While the Big Four shut their gates, a two-step Schengen strategy is quietly working for Nigerians who know about it.',
      author: 'Japa Genie Team',
      location: 'Nigeria → Europe → Canada',
      outcome: 'PR approval rate doubled',
      hook: '"I applied for Canada three times from Lagos and got rejected. Applied once from Germany — approved in 8 weeks."',
      readTime: '7 min read'
    },
    {
      slug: 'cape-verde-launchpad',
      title: 'The Island Nobody Talks About: How Cape Verde Is Becoming Africa\'s Launchpad to Europe',
      excerpt: 'A small Atlantic island with a special EU relationship is quietly becoming the smartest staging post for Africans heading to Europe.',
      author: 'Japa Genie Team',
      location: 'Nigeria → Cape Verde → EU',
      outcome: 'EU passport in 7 years',
      hook: '"Most people trying to reach Europe are looking at the wrong map. The shortest route might go through an island in the Atlantic."',
      readTime: '7 min read'
    },
    {
      slug: 'rejection-risk-score',
      title: 'How Japa Genie Calculates Your Visa Rejection Risk Score',
      excerpt: 'Discover the 7 hidden factors embassies check that cause 68% of rejections.',
      author: 'Japa Genie Team',
      location: 'Lagos, Nigeria',
      outcome: '62% risk reduction',
      hook: '"My Japan SSW visa was rejected until I fixed my Proof of Funds risk score."',
      readTime: '5 min read'
    },
    {
      slug: 'amara-visa-rejection-reversal',
      title: 'From Heartbreak to Toronto: Amara\'s Visa Rejection Reversal',
      excerpt: 'Three rejections could not stop this Ivorian software engineer from reaching Canada.',
      author: 'Amara Kone',
      location: 'Cote d\'Ivoire to Toronto, Canada',
      outcome: 'CAD $85,000 salary',
      hook: '"They rejected me three times. The fourth time, I got my Canadian PR."',
      readTime: '5 min read'
    },
    {
      slug: 'kwame-teacher-to-uk-global-talent',
      title: 'The Impossible Dream: From Teacher to UK Global Talent',
      excerpt: 'Rural Ghana teacher proves everyone wrong with innovative EdTech approach.',
      author: 'Kwame Asante',
      location: 'Rural Ghana to London, UK',
      outcome: '£65,000 salary',
      hook: '"Everyone said teachers cannot get UK Global Talent visas. I proved them wrong."',
      readTime: '6 min read'
    }
  ];`;

content = content.replace(oldStories, newStories);
fs.writeFileSync('src/app/blog/page.tsx', content);
console.log('Done');
