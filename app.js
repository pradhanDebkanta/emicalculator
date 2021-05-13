function calculateHomeLoanEMI(btnName) {
	var loanAmount = document.querySelector("#loanAmount").value;
	var interstRate = document.querySelector("#interestRate").value;
	var numberOfMonths = parseFloat(document.querySelector("#loanTerm").value);
	var x = document.querySelector('#ddlTermType').selectedIndex;
	var selectedTermType = document.getElementsByTagName("option")[x].value;

	var totalMonths;
	const maxRangeOfEMI = 30; // in year

	//THIS IS USE FOR REMOVE THE TABLE ROW THAT IS CREATED IN 1ST STEP
	//	IF I DON'T CLEAR THOSE TABLE ROW THEN THIS ROW WILL BE REMAIN THER AND SHOW NEXT TIME


	var tBodyRow = document.getElementById(btnName);
	var tbRowLen = tBodyRow.rows.length;
	let j = tbRowLen - 1;
	while (j >= 1) {
		tBodyRow.deleteRow(j);
		j--;

	}
	
	// this is for delete previous piechat

	let myPieChat = document.querySelector('.pie-chat-box');
	while (myPieChat) {
		myPieChat.parentNode.removeChild(myPieChat);
		myPieChat = false;
	}

	//	END HERE THE ABOVE CONDITION


	// (loanAmount <= 0 || interstRate <= 0 || numberOfMonths <= 0) 
	if (loanAmount <= 0) {
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Enter +ve Loan Amount'
		}
		)
		return false;
	}

	if (interstRate <= 0) {
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Enter +ve interest value'
		}
		)
		return false;
	}

	if (numberOfMonths <= 0) {
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Enter valid time period'
		}
		)
		return false;
	}




	if (selectedTermType == "years") {
		numberOfMonths = numberOfMonths * 12;
		totalMonths = numberOfMonths; // my target is to pickup "totalMonths" value from here
		var decimal = numberOfMonths - Math.floor(numberOfMonths);
		if (decimal) {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Loan Term entered is incorrect!'
			})
			return false;

		}

	} else {
		totalMonths = numberOfMonths; // my target is to pickup "totalMonths" value from here
	}

	if (!numberOfMonths || numberOfMonths > maxRangeOfEMI * 12) {
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: `Loan Term should be inbetween 0 to ${maxRangeOfEMI * 12} months or ${maxRangeOfEMI} years!`
		}
		)
		return false;
	}

	// this under statement is working when above condition is not satisfied ie. all is parfect
	// this is timmer function call
	calculating();

	const monthlyInterestRatio = (interstRate / 12) / 100; // it is interest ratio of 1 rupee for 1 month
	const totalPrincipal = loanAmount;
	const power = Math.pow(1 + monthlyInterestRatio, totalMonths);
	const monthlyEmi = (totalPrincipal * monthlyInterestRatio * power) / (power - 1);
	const totalEmi = monthlyEmi * totalMonths;

	const monthlyPrincipalArray = []; // THIS IS THE PRINCIPAL AMOUNT THAT I PAY IN EVERY MONTH
	monthlyPrincipalArray[0] = 0;

	const otPrincipalArray = []; // THIS IS THE OUTSTANDING PRINCIPAL AMOUNT THAT I HAVE TO PAY IN REMAINING MONTH
	otPrincipalArray[0] = totalPrincipal;

	const monthlyInterestArray = []; // THIS IS THE INTEREST AMOUNT THAT I PAY IN EVERY MONTH
	monthlyInterestArray[0] = 0;


	for (let i = 1; i <= totalMonths; i++) {
		let interest = otPrincipalArray[i - 1] * monthlyInterestRatio;
		let monthlyPrincipal = monthlyEmi - interest;
		otPrincipalArray[i] = otPrincipalArray[i - 1] - monthlyPrincipal;
		monthlyInterestArray[i] = interest;
		monthlyPrincipalArray[i] = monthlyPrincipal;

	}

	// THIS FOR APPENDING PIE CHAT 
	let chatBoxContainer = document.querySelector(".chat-box-container");
	let chatBox = document.createElement("div");
	chatBox.classList.add("pie-chat-box");
	chatBoxContainer.appendChild(chatBox);
	pieChat(totalEmi, loanAmount, chatBox);


	// this is for creating table row

	let count = 1;
	var row, cell0, cell1, cell2, cell3, cell4, cell5;
	for (count; count <= totalMonths; count++) {

		row = tBodyRow.insertRow(count);
		cell0 = row.insertCell(0);
		cell1 = row.insertCell(1);
		cell2 = row.insertCell(2);
		cell3 = row.insertCell(3);
		cell4 = row.insertCell(4);
		cell5 = row.insertCell(5);

		cell0.innerHTML = `${count}`; // THIS COLUMN IS COUNT NO: OF EMI
		cell1.innerHTML = `${monthlyEmi.toFixed(2)}`; // THIS COLUMN IS COUNT EMI
		cell2.innerHTML = `${monthlyPrincipalArray[count].toFixed(2)}`; // THIS COLUMN IS COUNT MONTHLY PRINCIPAL THAT I PAY IN EMI
		cell3.innerHTML = `${monthlyInterestArray[count].toFixed(2)}`; // THIS COLUMN IS COUNT MONTHLY INTEREST THAT I PAY IN EMI
		cell4.innerHTML = `${otPrincipalArray[count].toFixed(2)}`; // THIS COLUMN IS COUNT OUTSTANDING PRINCIPAL THAT I HAVE TO PAY
		cell5.innerHTML = `${(totalEmi - monthlyEmi * count).toFixed(2)}`; // THIS COLUMN IS COUNT OUTSTANDING EMI THAT I HAVE TO PAY
		row = row.classList.add("table-success");
	}
	row = tBodyRow.insertRow(count);
	cell0 = row.insertCell(0);
	cell1 = row.insertCell(1);
	cell2 = row.insertCell(2);
	cell3 = row.insertCell(3);
	cell4 = row.insertCell(4);
	cell5 = row.insertCell(5);
	cell0.innerHTML = "Total";
	cell1.innerHTML = `EMI: ${totalEmi.toFixed(2)}`;
	cell2.innerHTML = `Principal: ${loanAmount}`;
	cell3.innerHTML = `Interest: ${(totalEmi - loanAmount).toFixed(2)}`;
	cell4.innerHTML = "----";
	cell5.innerHTML = "----";
	row = row.classList.add("table-info");


}



// THIS IS FOR APPENDING PIE CHAT BOX 
function pieChat(totalEmi, loanAmount,myDiv) {
	let interest = totalEmi-loanAmount;
	let colorVal = ['#aa2ee6', '#9ede73'];
	var data = [
		{
			type: "pie",
			values: [interest, loanAmount],
			labels: ["interest", "loan amount"],
			textinfo: "label+percent",
			textposition: "inside",
			marker: {
				colors: colorVal,
			},
			automargin: false
		}
	]

	var layout = {
		height: 400,
		width: 400,
		margin: { "l": 0, "r": 0 },
		showlegend: true
	}

	Plotly.newPlot(myDiv, data, layout)

}


function calculating() {
	let timerInterval
	Swal.fire({
		title: 'calculating result',
		html: 'Please wait <b></b> milliseconds.',
		timer: 1000,
		timerProgressBar: true,
		didOpen: () => {
			Swal.showLoading()
			timerInterval = setInterval(() => {
				const content = Swal.getContent()
				if (content) {
					const b = content.querySelector('b')
					if (b) {
						b.textContent = Swal.getTimerLeft()
					}
				}
			}, 100)
		},
		willClose: () => {
			clearInterval(timerInterval)
		}
	}).then((result) => {
		/* Read more about handling dismissals below */
		/*if (result.dismiss === Swal.DismissReason.timer) {
		  // console.log('I was closed by the timer')
		}*/
	})
}










//THIS IS FOR RESET BUTTON

function reset(myTable) {
	resetAlert(myTable);
}

// THIS FUNCTION RESET DATA BY CALLING FROM BELLOW FUNCTION

function resetData(myTableInhr) {
	document.getElementById('loanAmount').value = '';
	document.getElementById('interestRate').value = '';
	document.getElementById('loanTerm').value = '';
	let tableBody = document.getElementById(myTableInhr);
	let tBodylen = tableBody.rows.length;
	let j = tBodylen - 1;
	while (j >= 1) {
		tableBody.deleteRow(j);
		j--;
	}

	let myPieChat = document.querySelector('.pie-chat-box');
	if (myPieChat) {
		myPieChat.parentNode.removeChild(myPieChat);
	}
}

// THIS FUNCTION IS FOR ALLERT POPUP WHEN USER WANT TO RESET DATA

function resetAlert(myTbl) {
	const swalWithBootstrapButtons = Swal.mixin({
		customClass: {
			confirmButton: 'btn btn-success',
			cancelButton: 'btn btn-danger',

		},
		buttonsStyling: true


	})

	swalWithBootstrapButtons.fire({
		title: 'Are you sure?',
		text: "You won't be able to revert this!",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Yes, delete it!',
		cancelButtonText: 'No, cancel!',
		reverseButtons: true
	}).then((result) => {
		if (result.isConfirmed) {
			swalWithBootstrapButtons.fire(
				'Deleted!',
				'Your file has been deleted.',
				'success'
			)
			// THIS FUNCTION CALL FOR RESET DATA

			resetData(myTbl);
		} else if (
			/* Read more about handling dismissals below */
			result.dismiss === Swal.DismissReason.cancel
		) {
			swalWithBootstrapButtons.fire(
				'Cancelled',
				'Your imaginary file is safe :)',
				'error'
			)
			// return false;
		}
	})
}
