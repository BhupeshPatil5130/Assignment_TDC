

exports.calculateScore = (customer, match) => {
  let score = 0;

  if (customer.gender === 'Male' && match.gender === 'Female') {
    
    if (match.age < customer.age) score += 15;
    if (match.income <= customer.income) score += 10;
    if (match.height < customer.height) score += 10;
  } else if (customer.gender === 'Female' && match.gender === 'Male') {
    
    if (match.age >= customer.age) score += 10;
    if (match.income >= customer.income) score += 15;
    if (match.height >= customer.height) score += 5;
    if (match.openToRelocate === customer.openToRelocate) score += 10;
  }

  if (customer.wantKids === match.wantKids) score += 20;
  else if (customer.wantKids === 'Maybe' || match.wantKids === 'Maybe') score += 10;

  if (customer.religion && match.religion && customer.religion === match.religion) score += 15;

  if (customer.caste === 'Any' || match.caste === 'Any') score += 5;
  else if (customer.caste && match.caste && customer.caste === match.caste) score += 10;

  if (customer.diet && match.diet && customer.diet === match.diet) score += 10;
  else if (customer.diet === 'Veg' && match.diet === 'Non-Veg') score -= 5;

  if (customer.manglikStatus && match.manglikStatus) {
    if (customer.manglikStatus === match.manglikStatus) score += 5;
    else if (customer.manglikStatus === 'Yes' && match.manglikStatus === 'No') score -= 5;
  }

  if (customer.smoking === match.smoking) score += 3;
  if (customer.drinking === match.drinking) score += 3;

  if (customer.languages && match.languages) {
    const shared = customer.languages.filter(l => match.languages.includes(l));
    if (shared.length > 0) score += 5;
  }

  if (customer.maritalStatus === match.maritalStatus) score += 5;

  return Math.max(0, Math.min(100, score)); 
};
