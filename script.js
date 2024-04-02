'use strict';

// BANKIST APP
// Data
const account1 = {
  owner: 'Manny Addisu',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  loan: [],
};

const account2 = {
  owner: 'Jane Doe',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  loan: [],
};

const account3 = {
  owner: 'John Foe ',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 1.2,
  pin: 3333,
  loan: [],
};

const account4 = {
  owner: 'Sarah Smith Sike',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  loan: [],
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const createUsername = function (accounts) {
  accounts.forEach(account => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name.at(0))
      .join('');
  });
};
createUsername(accounts);

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const mov = sort ? movements.slice().sort((a, b) => a - b) : movements;
  mov.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    }. ${type}</div>
      <div class="movements__value">${mov} Br</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);
const displayBalance = function (account) {
  account.balance = account.movements.reduce((acc, val) => acc + val, 0);
  labelBalance.textContent = `${account.balance} Br`;
};
// displayBalance(account1.movements);
const displaySummary = function (account) {
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const withdrawal = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + Math.abs(mov), 0);
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * ((account.interestRate * 10) / 1000))
    .filter(interest => interest >= 1)
    .reduce((acc, mov) => acc + Math.abs(mov), 0);
  const [interestMain, [x = 0, y = 0, ...others]] = String(interest).split('.');
  labelSumIn.textContent = `${income} Br`;
  labelSumOut.textContent = `${withdrawal} Br`;
  labelSumInterest.textContent = `${interestMain}.${x}${y} Br`; //to only display the first two digits after the decimal point
};
const updateUI = function (account) {
  displayMovements(account.movements);
  displayBalance(account);
  displaySummary(account);
};
// displaySummary(account1.account.movements);
let currentAccount;
//?the button is inside a form so its default action when clicked is to relod the page so you should prevent it
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //optional chaining coz if non matching username is entered it throws an error
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = '100';

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); //to make the cursor lose foucs after we log in
    updateUI(currentAccount);
  } else alert('Wrong Credentials!');
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciever = accounts.find(acc => acc.username === inputTransferTo.value);
  if (
    reciever &&
    amount > 0 &&
    amount <= currentAccount.balance &&
    inputTransferTo.value !== currentAccount.username
  ) {
    reciever.movements.push(amount);
    currentAccount.movements.push(-amount);
    updateUI(currentAccount);
  } else alert('Invalid transfer!');
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur(); //to make the cursor lose foucs after we log in
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (currentAccount.loan.length === 0) {
    if (
      currentAccount.movements.some(mov => mov >= amount * 0.1) &&
      amount > 0
    ) {
      currentAccount.movements.push(amount);
      currentAccount.loan.push(amount);
      updateUI(currentAccount);
      inputLoanAmount.value = '';
      inputLoanAmount.blur();
    } else
      alert('You must have one deposit which is atleast 10% if your request!');
  } else {
    alert('You have already taken a loan!');
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    accounts.splice(
      accounts.findIndex(acc => acc.username === currentAccount.username),
      1
    );
    containerApp.style.opacity = '0';
    inputCloseUsername.value = inputClosePin.value = '';
    inputClosePin.blur();
    labelWelcome.textContent = 'Log in to get started';
  } else alert('Wrong credentials! \nAccount deletion not authorized');
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted; //sorted = sorted === true ? false : true;
});
