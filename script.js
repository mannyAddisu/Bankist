'use strict';

// BANKIST APP
// Data
const account1 = {
  owner: 'Manny Addisu',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  loan: [],
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2024-01-23T07:42:02.383Z',
    '2024-02-28T09:15:04.904Z',
    '2024-03-28T10:17:24.185Z',
    '2024-03-29T14:11:59.604Z',
    '2024-04-02T17:01:17.194Z',
    '2024-04-02T23:36:17.929Z',
    '2024-04-04T10:51:36.790Z',
  ],
  locale: 'en-US',
  currency: 'ETB',
};

const account2 = {
  owner: 'Jane Doe',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  loan: [],
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  locale: 'en-US',
  currency: 'USD',
};

const account3 = {
  owner: 'John Foe ',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 1.2,
  pin: 3333,
  loan: [],
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  locale: 'de-DE',
  currency: 'EUR',
};

const account4 = {
  owner: 'Sarah Smith Sike',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  loan: [],
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  locale: 'en-UK',
  currency: 'GBP',
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

const now = new Date();
// const day = `${now.getDate()}`.padStart(2, 0);
// const month = `${now.getMonth() + 1}`.padStart(2, 0);
// const year = `${now.getFullYear()}`;
// const hour = `${now.getHours()}`.padStart(2, 0);
// const min = `${now.getMinutes()}`.padStart(2, 0);

// labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
const locale = navigator.language;
const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
};
labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);

const formattedDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(now, date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed}days ago`;
  return new Intl.DateTimeFormat(locale, options).format(date);
};
const formatNum = function (acc, num) {
  return new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(num);
};

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

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';
  const mov = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;
  mov.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(account.movementsDates[i]);
    const displayDate = formattedDate(date);
    const formattedNum = formatNum(account, mov);
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    }. ${type}</div>
    <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedNum}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

const displayBalance = function (account) {
  account.balance = account.movements.reduce((acc, val) => acc + val, 0);
  labelBalance.textContent = formatNum(account, account.balance);
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
  // const [interestMain, [x = 0, y = 0, ...others]] = String(interest).split('.');
  labelSumIn.textContent = `${formatNum(account, income)}`;
  labelSumOut.textContent = `${formatNum(account, withdrawal)}`;
  // labelSumInterest.textContent = `${interestMain}.${x}${y} Br`; //to only display the first two digits after the decimal point
  labelSumInterest.textContent = `${formatNum(account, interest)}`;
};

const updateUI = function (account) {
  displayMovements(account);
  displayBalance(account);
  displaySummary(account);
};
// displaySummary(account1.account.movements);
const resetTimer = function () {
  clearTimeout();
};
const startLogoutTimer = function () {
  let time = 120;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    --time;
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer; //has to be returned inorder to check if there is an existing timer and clear it
};
let currentAccount, timer;
// updateUI(account1);
// containerApp.style.opacity = 100;
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
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

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
    currentAccount.movementsDates.push(new Date().toISOString());
    reciever.movementsDates.push(new Date().toISOString());
    clearInterval(timer);
    timer = startLogoutTimer();
    updateUI(currentAccount);
  } else alert('Invalid transfer!');
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur(); //to make the cursor lose foucs after we log in
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(Number(inputLoanAmount.value));
  if (currentAccount.loan.length === 0) {
    if (
      currentAccount.movements.some(mov => mov >= amount * 0.1) &&
      amount > 0
    ) {
      setTimeout(function () {
        currentAccount.movements.push(amount);
        currentAccount.movementsDates.push(new Date().toISOString());
        currentAccount.loan.push(amount);
        updateUI(currentAccount);
        inputLoanAmount.value = '';
        inputLoanAmount.blur();
      }, 3000);
      clearInterval(timer);
      timer = startLogoutTimer();
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
    clearInterval(timer);
    timer = startLogoutTimer();
  } else alert('Wrong credentials! \nAccount deletion not authorized');
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted; //sorted = sorted === true ? false : true;
  clearInterval(timer);
  timer = startLogoutTimer();
});
