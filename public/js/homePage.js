document.addEventListener('DOMContentLoaded',function(){
const expenseForm = document.getElementById("expense-form");
const token = localStorage.getItem("token");
const expenseTableBody = document.getElementById("expense-table-body");
   axios.get("http://localhost:3000/expense/getExpense/1",{ headers: { Authorization: token } })
    .then((res)=>{
        res.data.expenses.forEach((e)=>{
            const amount = e.amount;
            const description = e.description;
            const category = e.category;
            const date = e.date;
            const newRow = `
            <tr>
              <td>${date}</td>
              <td>${amount}</td>
              <td>${description}</td>
              <td>${category}</td>
              <td><button class="btn btn-danger btn-sm" onclick="deleteRow(this,'${e.id}')">Delete</button></td>
            </tr>
          `;
         expenseTableBody.insertAdjacentHTML("beforeend", newRow);
         expenseForm.reset();
        })
        const ul = document.getElementById("paginationUL");
         for (let i = 1; i <= res.data.totalPages; i++) {
           const li = document.createElement("li");
           const a = document.createElement("a");
           li.setAttribute("class", "page-item");
           a.setAttribute("class", "page-link");
           a.setAttribute("href", "#");
           a.appendChild(document.createTextNode(i));
           li.appendChild(a);
           ul.appendChild(li);
           a.addEventListener("click", paginationbtn);
         }
    }).catch((err)=>{console.log(err)});
  })
  async function deleteRow(button,id) {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:3000/expense/deleteExpense/${id}`, { headers: { Authorization: token } })
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
  }
  async function paginationbtn(e){
    try {
      const expenseTableBody = document.getElementById("expense-table-body");
      const pageNo = e.target.textContent;
      const token = localStorage.getItem("token");
      expenseTableBody.innerHTML = "";
      const res = await axios.get(
        `http://localhost:3000/expense/getExpense/${pageNo}`,
        { headers: { Authorization: token } }
      );
        res.data.expenses.forEach((e)=>{
            const amount = e.amount;
            const description = e.description;
            const category = e.category;
            const date = e.date;
            const newRow = `
            <tr>
              <td>${date}</td>
              <td>${amount}</td>
              <td>${description}</td>
              <td>${category}</td>
              <td><button class="btn btn-danger btn-sm" onclick="deleteRow(this,'${e.id}')">Delete</button></td>
            </tr>
          `;
          expenseTableBody.insertAdjacentHTML("beforeend", newRow);
   })
  }catch(err){
  console.log(err);
 }
 }

document.getElementById('addlogin').addEventListener('click', function(){
  const amount = document.getElementById("amount");
  const description = document.getElementById("description");
  const category = document.getElementById("category");
  const categoryValue = category.value;
  const descriptionValue = description.value.trim();
  const amountValue = amount.value.trim();
  
  if (categoryValue == "Select Category") {
    alert("Select the Category!");
  }
  if (!descriptionValue) {
    alert("Add the Description!");
  }
  if (!parseInt(amountValue)) {
    alert("Please enter the valid amount!");
  }

  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  const dateStr = `${formattedDay}-${formattedMonth}-${year}`;
  
  const token = localStorage.getItem("token");
  const res = axios
      .post(
        "http://localhost:3000/expense/addExpense",
        {
          date: dateStr,
          category: categoryValue,
          description: descriptionValue,
          amount: parseInt(amountValue),
        },
        { headers: { Authorization: token } }
      ) .then((res) => {
        if (res.status == 200) {
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  })

async function buyPremium(){
  const token = localStorage.getItem('token');
  const response = await axios.get("http://localhost:3000/premium/premiumUser", { headers: {Authorization: token} })
  console.log(response);
  let options = 
  {
    key: response.data.key_id,
    order_id: response.data.order.id,
    "handler": async function(response){
     const res = await axios.post("http://localhost:3000/premium/updateTransactionStatus",{
        order_id: options.order_id,
        payment_id: response.razorpay_payment_id,
      }, { headers: { Authorization: token } 
    }) 
      alert("You are Premium User Now 🎉")
      window.location.reload();
      localStorage.setItem("token",res.data.token);
    }
  }
  const rzp1 = new Razorpay(options);
  rzp1.open();
  
  rzp1.on('payment-failed', function(response){
    console.log(response);
    alert('something went wrong')
  })
}

async function isPremium(){
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:3000/login/ispremiumUser", {
    headers: { Authorization: token },
  });
  if (res.data.ispremiumuser) {
    razorpaybtn.innerHTML ="👑Premium Member";
    reportBtn.removeAttribute("onclick");
    LeaderboardBtn.removeAttribute("onclick");
    LeaderboardBtn.setAttribute("href","/premium/getLeaderBoardPage");
    reportBtn.setAttribute("href","/premium/getReport");
    razorpaybtn.removeEventListener("click", buyPremium);
  }else{

  }
}
document.getElementById("logout").addEventListener('click', async function(){
  try {
    localStorage.clear();
    window.location.href = "/login";
  } catch (error) {
    console.log(error);
  }
})
document.getElementById("razorpaybtn").addEventListener('click',buyPremium);
document.addEventListener("DOMContentLoaded", isPremium);
