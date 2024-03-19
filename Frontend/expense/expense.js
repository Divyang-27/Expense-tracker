let listGroup = document.querySelector('.List-group');
const premium = document.getElementById('premium');
const premiumBtn = document.createElement('button');
premiumBtn.innerHTML = 'Buy premium';

const leaderboardBtn = document.createElement('button');
leaderboardBtn.innerHTML = 'Show leaderboard';

const getExpense = (myExpense) => {
  const token = localStorage.getItem('token');
  let newListElement = document.createElement('li');
  newListElement.innerHTML = `${myExpense.amount}    ${myExpense.description}    ${myExpense.category}         `;
  let deletebtn = document.createElement('button');

  deletebtn.innerHTML = 'Delete';
  newListElement.appendChild(deletebtn);
  listGroup.appendChild(newListElement);

  deletebtn.onclick = () => {
    listGroup.removeChild(newListElement);
    axios.delete(
      `http://localhost:3000/user/expense/${myExpense.id}/?amount=${myExpense.amount}`,
      {
        headers: { Authorization: token },
      }
    );
  };
};

const addExpense = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token');
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const myExpense = {
      amount: amount,
      description: description,
      category: category,
      userId: localStorage.getItem('token'),
    };
    const postExpense = await axios.post(
      'http://localhost:3000/user/expense',
      myExpense,
      {
        headers: { Authorization: token },
      }
    );
    console.log(postExpense);
    getExpense(postExpense.data.expenseDetails);
  } catch (error) {
    errors.innerHTML = `<li> Error code ${error.response.status}: ${error.response.data.error} </li>`;
  }
};
premiumBtn.onclick = async (e) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(
    'http://localhost:3000/purchase/premiummember',
    { headers: { Authorization: token } }
  );
  var options = {
    key: response.data.key_id,
    order_id: response.data.order.id,
    handler: async (res) => {
      await axios
        .post(
          'http://localhost:3000/purchase/updatetransactionstatus',
          {
            order_id: options.order_id,
            payment_id: res.razorpay_payment_id,
          },
          { headers: { Authorization: token } }
        )
        .then((res) => localStorage.setItem('token', res.data.token));
      premiumBtn.style.visibility = 'hidden';
      premium.innerHTML = `<p>You are a premium user now</p>`;
      premium.appendChild(leaderboardBtn);
      alert('You are a premium user now');
    },
  };
  const rzp = await new Razorpay(options);
  rzp.open();
  e.preventDefault();
  rzp.on('payment.failed', () => {
    alert('Something went wrong');
  });
};

const parseJwt = (token) => {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
};
const premiumHandler = async (ispremiumuser) => {
  if (!ispremiumuser) {
    premium.appendChild(premiumBtn);
  } else {
    premiumBtn.style.visibility = 'hidden';
    premium.innerHTML = `<p>You are a premium user now</p>`;
    premium.appendChild(leaderboardBtn);
  }
};
leaderboardBtn.onclick = async () => {
  const token = localStorage.getItem('token');
  let leaderboard = document.getElementById('leaderboard');
  leaderboard.innerHTML = '<h3Leaderboard</h3>';
  const userExpense = await axios.get(
    'http://localhost:3000/premium/leaderboard',
    { headers: { Authorization: token } }
  );

  userExpense.data.forEach((userDetails) => {
    leaderboard.innerHTML += `<li>Name-${userDetails.name}  Total Expense- ${userDetails.total_expense}</li>`;
  });
};
window.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const expense = await axios.get('http://localhost:3000/user/expense', {
    headers: { Authorization: token },
  });
  expense.data.expenseDetails.forEach((response) => {
    getExpense(response);
  });
  const ispremiumuser = await parseJwt(token).ispremiumuser;
  premiumHandler(ispremiumuser);
});
