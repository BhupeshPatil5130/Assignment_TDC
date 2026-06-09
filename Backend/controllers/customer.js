const Customer = require('../models/Customer');
const matchService = require('../services/matchService');
const aiService = require('../services/aiService');

exports.getCustomers = async (req, res) => {
  try {
    const filter = req.user ? { $or: [{ assignedTo: req.user._id }, { assignedTo: null }, { assignedTo: { $exists: false } }] } : {};
    const customers = await Customer.find(filter)
      .select('firstName lastName dob city maritalStatus statusTag gender assignedTo createdAt')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, count: customers.length, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCustomerDetails = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.seedDummyProfiles = async (req, res) => {
  try {
    const { fakerEN_IN: faker } = await import('@faker-js/faker');
    const profiles = [];
    for (let i = 0; i < 100; i++) {
      const gender = faker.helpers.arrayElement(['Male', 'Female']);
      const dob = faker.date.birthdate({ min: 22, max: 40, mode: 'age' });
      
      profiles.push({
        firstName: faker.person.firstName(gender.toLowerCase()),
        lastName: faker.person.lastName(),
        gender: gender,
        dob: dob,
        country: 'India',
        city: faker.location.city(),
        height: faker.number.int({ min: 150, max: 190 }),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        college: faker.company.name() + ' University',
        degree: faker.helpers.arrayElement(['B.Tech', 'MBA', 'B.Sc', 'M.Tech', 'B.Com']),
        income: faker.number.int({ min: 500000, max: 5000000 }),
        company: faker.company.name(),
        designation: faker.person.jobTitle(),
        maritalStatus: faker.helpers.arrayElement(['Never Married', 'Divorced']),
        languages: faker.helpers.arrayElements(['English', 'Hindi', 'Marathi', 'Gujarati', 'Tamil', 'Telugu'], 2),
        siblings: faker.number.int({ min: 0, max: 3 }),
        caste: faker.helpers.arrayElement(['Brahmin', 'Kshatriya', 'Vaishya', 'Shudra', 'Any']),
        religion: faker.helpers.arrayElement(['Hindu', 'Muslim', 'Sikh', 'Christian']),
        wantKids: faker.helpers.arrayElement(['Yes', 'No', 'Maybe']),
        openToRelocate: faker.helpers.arrayElement(['Yes', 'No', 'Maybe']),
        openToPets: faker.helpers.arrayElement(['Yes', 'No', 'Maybe']),
        diet: faker.helpers.arrayElement(['Veg', 'Non-Veg', 'Jain', 'Vegan']),
        smoking: faker.helpers.arrayElement(['Yes', 'No', 'Occasionally']),
        drinking: faker.helpers.arrayElement(['Yes', 'No', 'Occasionally']),
        manglikStatus: faker.helpers.arrayElement(['Yes', 'No', 'Not Sure']),
      });
    }
    await Customer.insertMany(profiles);
    res.json({ success: true, message: 'Seeded 100 dummy profiles' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendMatch = async (req, res) => {
  try {
    const { matchId } = req.body;
    res.json({ success: true, message: `Mock email triggered successfully to match ID: ${matchId}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMatches = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });

    const oppositeGender = customer.gender === 'Male' ? 'Female' : 'Male';

    const pool = await Customer.find({ gender: oppositeGender, _id: { $ne: customer._id } }).limit(50);

    let scoredMatches = pool.map(match => {
      const score = matchService.calculateScore(customer, match);
      return { match, score };
    });

    scoredMatches.sort((a, b) => b.score - a.score);

    const topMatches = scoredMatches.slice(0, 3);

    const evaluatedMatches = await Promise.all(
      topMatches.map(matchItem => aiService.evaluateMatch(customer, matchItem))
    );

    res.json({ success: true, data: evaluatedMatches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const customer = new Customer({
      ...req.body,
      assignedTo: req.user._id,
    });
    await customer.save();
    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, data: customer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
