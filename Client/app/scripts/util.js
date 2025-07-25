function getCookieValue(cookieName) {
  const cookies = document.cookie.split('; ');
  for (let cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === cookieName) {
      return value;
    }
  }
  return null;
}

function generateRandomPassword() {
  const passwordCondition = {
    upperCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowerCase: 'abcdefghijklmnopqrstuvwxyz',
    number: '0123456789',
    specialCharacter: '@$!%*?&'
  };

  const MINCHAR = 8;
  const MAXCHAR = 100;
  const passwordLength = Math.floor(Math.random() * (MAXCHAR - MINCHAR + 1)) + MINCHAR;

  const conditionKeys = Object.keys(passwordCondition);
  let passwordResult = [];

  conditionKeys.forEach(key => {
    const chars = passwordCondition[key];
    const randomChar = chars[Math.floor(Math.random() * chars.length)];
    passwordResult.push(randomChar);
  });

  while (passwordResult.length < passwordLength) {
    const randomKey = conditionKeys[Math.floor(Math.random() * conditionKeys.length)];
    const chars = passwordCondition[randomKey];
    const randomChar = chars[Math.floor(Math.random() * chars.length)];
    passwordResult.push(randomChar);
  }

  for (let i = passwordResult.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordResult[i], passwordResult[j]] = [passwordResult[j], passwordResult[i]];
  }
  
  return passwordResult.join('');
}


const authenticationAlert = function(action, success, message, showAlert) {
    const alertClass = success ? 'alert-success' : 'alert-danger';
    const alertState = success ? 'successfully' : 'failed';
    $('#authAlert').removeClass().addClass(`alert ${alertClass} alert-dismissible mb-3 mt-3`);
    $('#authState').text(alertState);
    
    // reset message
    $('#alertMessage').text('');
    if (!success) $('#alertMessage').text(message);
    $('#authAction').text(action);
    showAlert = true;
};