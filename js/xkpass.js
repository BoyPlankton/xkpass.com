function maxWordLength(words_arr) {
  return words_arr.reduce(function (a, b) { return a.length > b.length ? a : b; }).length;
}

function initUI() {
  for (var i = maxWordLength(words_arr); i >= 3; i--) {
    document.getElementById('max_word_length_val').innerHTML += "<option value=\""+i+"\">"+i+"</option>";
  }
  
  calculateEntropy();
  
  genPassPhrases();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function filterByLength(words_arr, max_word_length) {
  return words_arr.filter(word => word.length <= max_word_length)
}

function genPassPhrase(words_arr, max_word_length, passphrase_length, include_numeric) {
  var passphrase = [];
  
  var numeric_value = 0;
  
  if(include_numeric == true){
    numeric_value = getRandomInt(passphrase_length);
  }
  
  for (var i = 0; i < passphrase_length; i++){
    var tmp_words_arr = filterByLength(words_arr, max_word_length);
    
    var word = tmp_words_arr[getRandomInt(tmp_words_arr.length)];
    
    if ((numeric_value - 1) == i) {
      passphrase.push(getRandomInt(9999).toString());
    } else {
      if (getRandomInt(2) == 1) {
        passphrase.push(word.toLowerCase());
      } else {
        passphrase.push(word.toUpperCase());
      }
    }
  }
  
  return passphrase.join("-");
}

function getMaxWordLength(words_arr) {
  var max_word_length = maxWordLength(words_arr);
  
  if (!isNaN(document.getElementById('max_word_length_val').value)) {
    max_word_length = document.getElementById('max_word_length_val').value;
  }
  
  return max_word_length;
}

function getIncludeNumbers() {
  var include_numbers = false;

  if (typeof (document.getElementById('include_numbers').checked) === "boolean") {
    include_numbers = document.getElementById('include_numbers').checked;
  }
  
  return include_numbers;
}

function copyPassPhrase(passphrase) {
  var tmpInput = document.createElement('INPUT');
  var body = document.getElementsByTagName('body')[0];
  
  body.appendChild(tmpInput);

  tmpInput.setAttribute('value', passphrase)
  
  tmpInput.select();
  
  document.execCommand('copy');
  
  body.removeChild(tmpInput);
}

function genPassPhrases() {
  var max_word_length = getMaxWordLength(words_arr);
  var include_numbers = getIncludeNumbers();
  
  document.getElementById('generated_passphrases').innerHTML = "";
  
  for (var i = 0; i < 5; i++) {
    var passPhrase = genPassPhrase(words_arr, max_word_length, 4, include_numbers);
    
    document.getElementById('generated_passphrases').innerHTML += "<button title=\"Press to Copy\" type=\"button\" class=\"list-group-item list-group-item-action\" onclick=\"copyPassPhrase('"+passPhrase+"')\">"+passPhrase+"</button>";
  }
}

function calculateEntropy() {
  var tmp_words_arr = filterByLength(words_arr, getMaxWordLength(words_arr));

  var calculated_entropy = Math.log2(tmp_words_arr.length) * 4;

  if (calculated_entropy <= 28) {
    document.getElementById('entropy_alert').className = "alert alert-danger";
    document.getElementById('passphrase_strength').innerHTML = "Very Weak";
    document.getElementById('entropy_message').innerHTML = "These passphrases aren't strong enough to protect a teenager's diary.";
  } else if (calculated_entropy > 28 && calculated_entropy <= 35) {
    document.getElementById('entropy_alert').className = "alert alert-warning";
    document.getElementById('passphrase_strength').innerHTML = "Weak";
    document.getElementById('entropy_message').innerHTML = "These passphrases should keep out most people and should be barely adequate for protecting a personal computer login.";
  } else if (calculated_entropy > 35 && calculated_entropy <= 59) {
    document.getElementById('entropy_alert').className = "alert alert-success";
    document.getElementById('passphrase_strength').innerHTML = "Reasonable";
    document.getElementById('entropy_message').innerHTML = "These passphrases should be strong enough to protect network and corporate accounts.";
  } else if (calculated_entropy > 59 && calculated_entropy <= 127) {
    document.getElementById('entropy_alert').className = "alert alert-success";
    document.getElementById('passphrase_strength').innerHTML = "Strong";
    document.getElementById('entropy_message').innerHTML = "These passphrases should be good for protecting financial information.";
  } else if (calculated_entropy > 127) {
    document.getElementById('entropy_alert').className = "alert alert-success";
    document.getElementById('passphrase_strength').innerHTML = "Very Strong";
    document.getElementById('entropy_message').innerHTML = "";
  }


  document.getElementById('calculated_entropy').innerHTML = calculated_entropy.toFixed(0);
}