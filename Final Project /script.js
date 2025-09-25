 const logBtn = document.querySelector(".log-btn");
 const summaryDiv = document.getElementById("summary");
 const daysContainer = document.getElementById("days-container");

 const saveInfoBtn = document.querySelector(".save-info-btn");

 saveInfoBtn.addEventListener("click", async () => {
   const firstName = document.getElementById("firstName").value.trim();
   const lastName = document.getElementById("lastName").value.trim();
   const email = document.getElementById("email").value.trim();
   const age = document.getElementById("age").value.trim();
   const day = document.getElementById("day").value.trim();

   if (!firstName || !lastName || !email || !age || !day) {
     alert("Please fill in all fields before saving.");
     return;
   }

   const userData = { firstName, lastName, email, age, day };

   try {
     const res = await fetch("http://localhost:3000/userInfo", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(userData),
     });

     if (!res.ok) throw new Error("Failed to save user info");

     alert("✅ User info saved successfully!");

     // Reset fields after save
     document.getElementById("firstName").value = "";
     document.getElementById("lastName").value = "";
     document.getElementById("email").value = "";
     document.getElementById("age").value = "";
     document.getElementById("day").value = "";
   } catch (error) {
     console.error("Error:", error);
     alert("❌ Could not save user info. Check if json-server is running.");
   }
 });

 logBtn.addEventListener("click", () => {
   const waterInput = document.getElementById("waterInput");
   const mealInput = document.getElementById("mealInput");
   const sleepInput = document.getElementById("sleepInput");
   const dayInput = document.getElementById("day");

   const newLog = {
     day: dayInput.value,
     water: waterInput.value,
     meals: mealInput.value,
     sleep: sleepInput.value,
   };

   if (!newLog.day) return alert("Please enter a day before logging.");

   fetch("http://localhost:3000/logs", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(newLog),
   })
     .then((res) => res.json())
     .then((data) => {
       updateSummary(data);
       loadPastDays();

       // Reset log inputs
       waterInput.value = "";
       mealInput.value = "";
       sleepInput.value = "";
       // Note: 'day' is already reset when saving user info
     });
 });

 function updateSummary(log) {
   summaryDiv.textContent = `Day: ${log.day} | Water: ${log.water} glasses | Meals: ${log.meals} | Sleep: ${log.sleep} hrs`;
 }

 function loadPastDays() {
   fetch("http://localhost:3000/logs")
     .then((res) => res.json())
     .then((logs) => {
       daysContainer.innerHTML = "";
       logs.slice(-5).forEach((log) => {
         const div = document.createElement("div");
         div.textContent = `Day ${log.day} - 💧 ${log.water} | 🍽️ ${log.meals} | 😴 ${log.sleep}`;
         daysContainer.appendChild(div);
       });
     });
 }

 loadPastDays();

 // === FEEDBACK SUBMISSION ===
 const feedbackBtn = document.querySelector(".feedback-btn");
 const feedbackField = document.getElementById("feedback");

 feedbackBtn.addEventListener("click", async () => {
   const feedback = feedbackField.value.trim();

   if (feedback === "") {
     alert("⚠️ Please write some feedback before submitting.");
     return;
   }

   try {
     const response = await fetch("http://localhost:3000/feedback", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
         message: feedback,
         date: new Date().toISOString(),
       }),
     });

     if (!response.ok) throw new Error("Failed to save feedback");

     alert("✅ Thank you for your feedback!");
     feedbackField.value = "";
   } catch (error) {
     console.error("Error saving feedback:", error);
     alert("❌ Could not save feedback. Check if json-server is running.");
   }
 });
