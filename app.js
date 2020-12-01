class Expense {

	constructor(classYear, classMonth, classDay, classType, classDescription, classExpenseValue) {
		this.yearClass = classYear
		this.monthClass = classMonth
		this.dayClass = classDay
		this.typeClass = classType
		this.descriptionClass = classDescription
		this.expenseValueClass = classExpenseValue
	}

	validateData() {

		// [i] to get the attributes
		// is same as this.(attr)
		for(let i in this) {
			if(this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			}
		}

		return true
	}
}

// LOCAL STORAGE
class Bd {

	//set Id
	constructor() {

		let id = localStorage.getItem('id')

		if(id === null || id === undefined) {
			localStorage.setItem('id', 0)
		}
	}

	getNextId() {

		let nextId = localStorage.getItem('id')

		return parseInt(nextId) + 1
	}

	saveData(d) {

		let id = this.getNextId()

		localStorage.setItem(id, JSON.stringify(d))

		localStorage.setItem('id', id)
	}

	retrieveAllRecords() {

		// expenses array
		let expenses = Array()

		let id = localStorage.getItem('id')

		//to retrieve all the registered expenses in localStorage
		for(let i =1; i <= id; i++) {

			// retrieve expense
				// use parse to convert JSON in a literal object
			let expense = JSON.parse(localStorage.getItem(i))

			// check if we have deleted indexs
			if(expense === null) {
				continue
			}

			// to set an id(attribute) in the object
			expense.id = i

			// to insert the values in the array
			expenses.push(expense)
		}
		return expenses
	}

	search(expense) {

		let filteredExpenses = Array()

		filteredExpenses = this.retrieveAllRecords()

		if(expense.dayClass != '') {
			filteredExpenses = filteredExpenses.filter(d => d.dayClass == expense.dayClass)
		}
		if(expense.monthClass != '') {
			filteredExpenses = filteredExpenses.filter(d => d.monthClass == expense.monthClass)
		}
		if(expense.yearClass != '') {
			filteredExpenses = filteredExpenses.filter(d => d.yearClass == expense.yearClass)
		}
		if(expense.typeClass != '') {
			filteredExpenses = filteredExpenses.filter(d => d.typeClass == expense.typeClass)
		}
		if(expense.descriptionClass != '') {
			filteredExpenses = filteredExpenses.filter(d => d.descriptionClass == expense.descriptionClass)
		}
		if(expense.expenseValueClass != '') {
			filteredExpenses = filteredExpenses.filter(d => d.expenseValueClass == expense.expenseValueClass)
		}

		return filteredExpenses
	}

	removeExpense(id) {
		localStorage.removeItem(id)
	}

	notRemoveExpense() {
		return
	}
}

let bd = new Bd()

function registerExpense() {

	let year = document.getElementById('year')
	let month = document.getElementById('month')
	let day = document.getElementById('day')
	let type = document.getElementById('type')
	let description = document.getElementById('description')
	let expenseValue = document.getElementById('expenseValue')

	let expense = new Expense(
		year.value,
		month.value,
		day.value,
		type.value,
		description.value,
		expenseValue.value
	)

	// VALIDATE DATA
	if(expense.validateData()) {

		// LOCAL STORAGE
		bd.saveData(expense)

		// success dialog - JQuery
		document.getElementById('modal_title').innerHTML = 'Success'
		document.getElementById('modal_title_div').className = 'modal-header text-success'
		document.getElementById('modal_text').innerHTML = 'Information successfully registered.'
		document.getElementById('modal_btn').className = 'btn btn-success'

		$('#app_modal').modal('show')

		year.value = ''
		month.value = ''
		day.value = ''
		type.value = ''
		description.value = ''
		expenseValue.value = ''

	} else {

		// error dialog - JQuery
		document.getElementById('modal_title').innerHTML = 'Error'
		document.getElementById('modal_title_div').className = 'modal-header text-danger'
		document.getElementById('modal_text').innerHTML = 'Please fill in all the fields.'
		document.getElementById('modal_btn').className = 'btn btn-danger'

		$('#app_modal').modal('show')
	}
}

function loadExpensesList(expenses = Array(), filterExpenses = false) {

	// "filterExpenses = false" - to return an empty list if the search result has no data
	if(expenses.length == 0 && filterExpenses == false) {
		expenses = bd.retrieveAllRecords()
	}

	// select <tbody> element
	let expensesListBrowser = document.getElementById('expensesListBrowser')
	expensesListBrowser.innerHTML = ''

	// go through the expe array and build the list dynamically
	expenses.forEach(function(d) {

		// build line (tr)
		let line = expensesListBrowser.insertRow()

		// insert values, columns (td)
		line.insertCell(0).innerHTML = `${d.dayClass}/${d.monthClass}/${d.yearClass}`
		let capitalizeType = d.typeClass.trim().replace(/^\w/, (c) => c.toUpperCase())
		line.insertCell(1).innerHTML = capitalizeType
		let capitalizeDescription = d.descriptionClass.trim().replace(/^\w/, (c) => c.toUpperCase())
		line.insertCell(2).innerHTML = capitalizeDescription
		line.insertCell(3).innerHTML = d.expenseValueClass

		// build a delete button
		let btn = document.createElement('button')
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fas fa-times"></i>'
		btn.id = `id_expense_${d.id}`
		btn.onclick = function() {

			$('#modal_consult').modal('show')
			
			let id = this.id.replace('id_expense_', '')

			let removal = document.getElementById('modal_btn_removal')
			let notRemoval = document.getElementById('modal_btn_consult')

			removal.onclick = function() {
				bd.removeExpense(id)

				window.location.reload()
			}

			notRemoval.onclick = function() {
				bd.notRemoveExpense()
			}
		}

		line.insertCell(4).append(btn)
	})
}

function searchExpenses() {

	let year = document.getElementById('year').value
	let month = document.getElementById('month').value
	let day = document.getElementById('day').value
	let type = document.getElementById('type').value
	let description = document.getElementById('description').value
	let expenseValue = document.getElementById('expenseValue').value

	let expense = new Expense(year, month, day, type, description, expenseValue)

	let expenses = bd.search(expense)

	this.loadExpensesList(expenses, true)
}

//_________________________________________________ X _________________________________________________//

function loadAnalysisList(expenses = Array(), filterExpenses = false) {
	
	if(expenses.length == 0 && filterExpenses == false) {
		expenses = bd.retrieveAllRecords()
	}


	let analysisListBrowser = document.getElementById('analysisListBrowser')
	analysisListBrowser.innerHTML = ''

	expenses.forEach(function(d) {

		let line = analysisListBrowser.insertRow()

		line.insertCell(0).innerHTML = `${d.dayClass}/${d.monthClass}/${d.yearClass}`
		let capitalizeType = d.typeClass.trim().replace(/^\w/, (c) => c.toUpperCase())
		line.insertCell(1).innerHTML = capitalizeType
		let capitalizeDescription = d.descriptionClass.trim().replace(/^\w/, (c) => c.toUpperCase())
		line.insertCell(2).innerHTML = capitalizeDescription
		line.insertCell(3).innerHTML = d.expenseValueClass
	})
}

function analyzeExpenses() {

	let month = document.getElementById('month_analysis').value
	let year = document.getElementById('year_analysis').value
	let type = document.getElementById('type_analysis').value
	let expenseValue = document.getElementById('expenseValue_analysis').value

	let day = ''
	let description = ''

	let expense = new Expense(year, month, day, type, description, expenseValue)

	let expenses = bd.search(expense)

	this.loadAnalysisList(expenses, true)

	let arrayExpenseValue = expenses.map(expenseValueQuota => parseFloat(expenseValueQuota.expenseValueClass))

	let totalArrayExpenseValue = 0

	function sumArrayExpenseValue() {
		for(let i = 0; i < arrayExpenseValue.length; i++) {
			totalArrayExpenseValue += arrayExpenseValue[i]
		}
		return totalArrayExpenseValue
	}

	sumArrayExpenseValue()

	document.getElementById('total_of_expenses').value = totalArrayExpenseValue
}

