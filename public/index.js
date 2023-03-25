
let products;
const product = async () => {
	const response = await fetch("/products");
	const data = await response.json();
	products = data;
	displayProducts(products);
};
product();

let cart = [];

const sidebar = document.querySelector(".sidebar");
const mainContent = document.querySelector(".main-content");
let arr;
const search = document.querySelector(".search");
let search_arr;
const range = document.querySelector(".range");
let range_arr = document.querySelector(".range");
const range_otp = document.querySelector(".range-otp");
range_otp.textContent = ` Rs. ${range.value * 100}`;

range.addEventListener("change", (e) => {
	// console.log(e.target.value * 100);
	range_arr = products.filter((product) => {
		return product.price <= e.target.value * 100;
	});
	range_otp.textContent = ` Rs. ${e.target.value * 100}`;
	displayProducts(range_arr);
});

search.addEventListener("keyup", (e) => {
	console.log(e.target.value);

	if (e.target.value === "") {
		mainContent.innerHTML = "<h2>Please enter some value</h2>";
		return;
	} else {
		search_arr = products.filter((product) => {
			return product.location
				.toLowerCase()
				.includes(e.target.value.toLowerCase());
		});
	}
	//show message
	displayProducts(search_arr);
});

sidebar.addEventListener("click", (e) => {
	if (e.target.classList.contains("list")) {
		console.log(e.target);
		if (e.target.dataset.id === "all") {
			arr = products;
		} else {
			arr = products.filter((value) => {
				return value.location === e.target.dataset.id;
			});
		}
		console.log(arr);
		displayProducts(arr);
	}
});

//for cart module
let displayed_products;

const displayProducts = async (products, calledFrom) => {
	displayed_products = products;
	if (products.length === 0) {
		//this if block has bug
		mainContent.innerHTML = "<h2>No Products found</h2>";
		return;
	}
	if (calledFrom) {
		mainContent.innerHTML = "<h2>Showing " + calledFrom + "....</h2>";
	} else {
		mainContent.innerHTML = "";
	}
	products.forEach((product) => {
		const element = `<div class="product" data-id="${product.id}">
                <img src="${product.image}" alt="${product.type}" data-id="${product.id}"><br>
                <div class="detail">
				<span class="name">${product.type}</span><br>
                <span class="price">Rs. ${product.price}</span>
				</div>
                </div>`;
		const div = document.createElement("div");
		div.innerHTML += element;
		mainContent.append(div);
	});
};
//initial page
// setTimeout(displayProducts, 2000);

//open modal box
const modal = document.querySelector(".modal");
const modal_img = document.querySelector(".modal-img");
const modal_name = document.querySelector(".modal-name");
const modal_price = document.querySelector(".modal-price");
const modal_desc = document.querySelector(".modal-desc");
const modal_contact = document.querySelector(".modal-contact-btn");
const email_btn = document.querySelector(".email-btn");
const save_btn = document.querySelector(".save-btn");

let modal_product;

mainContent.addEventListener("click", (e) => {
	const id = e.target.dataset.id;
	if (id) {
		console.log(typeof id);
		modal_product = products.filter((product) => {
			return product.id == id;
		});
		console.log(modal_product);
		openModal(modal_product);
	}
});

function openModal(product){
	modal_img.src = modal_product[0].image;
	modal_name.textContent = `this ${modal_product[0].type} can be yours`;
	modal_price.textContent = `Rs. ${modal_product[0].price}`;
	modal_desc.textContent = modal_product[0].desc;
	modal_contact.dataset.contact = modal_product[0].contact;
	//returns undefined if not found
	console.log(cart.find((item) => item.id === modal_product[0].id));
	if (cart.find((item) => item.id === modal_product[0].id)) {
		console.log("saved");
		save_btn.textContent = "Remove from saved";
	} else {
		save_btn.textContent = "Save for review";
	}
	modal.style.maxHeight = "100%";
}

document.querySelector(".modal-cross").addEventListener("click", (e) => {
	modal.style.maxHeight = null;
});


//send email
modal_contact.addEventListener("click", async (e) => {
	console.log(typeof e.target.dataset.contact);
	const emailData = {
		email: e.target.dataset.contact
	}
	const options = {
		method: "POST",
		headers: {"Content-Type":"application/json"},
		body: JSON.stringify(emailData),
	}
	const response = await fetch("/contact", options);
	const data = await response.json();
	console.log(data)
});

//Adding property

const plus = document.querySelector(".add-plus");
const nav_btn = document.querySelector(".nav-btn");
const parent = document.querySelector(".parent");
const add_parent = document.querySelector(".add-parent");

nav_btn.addEventListener("click", (e) => {
	console.log(e.target.textContent);
	if (e.target.textContent === "buy") {
		parent.style.display = "flex";
		add_parent.style.display = "none";
		// e.target.textContent === "buy";
		product();
	}
	if (e.target.textContent === "sell") {
		// authenticate();
		parent.style.display = "none";
		add_parent.style.display = "block";
	}
	e.target.textContent = parent.style.display === "none" ? "buy" : "sell";
});

async function authenticate(){
	const userInfo = localStorage.getItem('user');
	if(userInfo){
		const {userName, password} = JSON.parse(userInfo);
		// showPropertyPage();
		parent.style.display = "none";
		add_parent.style.display = "block";
	}else{
		const response = await fetch("/login");
		console.log(response.body)
		// document.body.innerHTML = response;
	}
}

const bodyDiv = document.querySelector(".body");
plus.addEventListener("click", (e) => {
	if (cart.length === 0) {
		//this if block has bug
		mainContent.innerHTML = "<h2>Your cart is empty...</h2>";
		return;
	}
	displayProducts(cart, "cart");
});

save_btn.addEventListener("click", () => {
	const cartHeading = document.querySelector(".main-content h2");

	if (save_btn.textContent === "Remove from saved") {
		console.log("remove");
		cart = cart.filter((item) => item.id !== modal_product[0].id);
		save_btn.textContent = "Save for review";
		//display products if removed from saved
		cartHeading ? displayProducts(cart, "cart") : null;
		modal.style.maxHeight = null;
		return;
	}
	//avoid duplicates
	//find returns undefined if not found
	if (!cart.find((item) => item.id === modal_product[0].id)) {
		cart.push(
			displayed_products.find((item) => item.id === modal_product[0].id)
		);
		//display products if removed from saved
		cartHeading ? displayProducts(cart, "cart") : null;
		modal.style.maxHeight = null;
	}
	save_btn.textContent = "Remove from saved";
});


//getting form data////////////////////////////////////////////////////submit btn///////////////
// const email = document.getElementById("email");
// const price = document.getElementById("price");
// const location = document.getElementById("location");
// const type = document.getElementById("type");
// const img = document.getElementById("file");
// const desc = document.getElementById("desc");
// const id = document.getElementById("id");

// const main_form = document.querySelector(".main-form");
// // console.log(main_form.children[0].lastElementChild);

// document.addEventListener("submit", (e) => {
// 	e.preventDefault();
// 	const inputs_array = [];
// 	Array.from(main_form.children).forEach((item) =>
// 		inputs_array.push(item.lastElementChild.value)
// 	);
// 	inputs_json = JSON.stringify(inputs_array);
// 	console.log(JSON.parse(inputs_json));
// });///////////////////////////////////////////////////////////////////////////////////////


//fetch user properties
const userAccountId = document.getElementById('user-account-id');
document.querySelector('.check-property').addEventListener('click',async(e)=>{
	getUserProperty();
})
async function getUserProperty(){
	const value = userAccountId.value;
	console.log(value)
	console.log(typeof value)
	if(value !== ''){
		const body = {
			accountId : value
		};
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		}
		const response = await fetch('/user-property', options);
		const data = await response.json();
		console.log(data.length);
		if(data.length !== 0){
			showListedProperties(data);
		}else{
			console.log('no properties found');
			alert('No Property found');
		}
	}else{
		console.log('please enter value');
		alert('Enter Account ID');
	}
}

const listedProperties = document.querySelector(".property-lists");
const showListedProperties = (userProperties) => {
	const list = document.createElement("li");
	listedProperties.innerHTML = "";
	userProperties.forEach((item) => {
		list.innerHTML += `<li class="list accordion">${item.type}</li>
							<div class="accordion-content">
                                <p class="accordion-price">${item.price}<span class="accordion-hide-btn">&#9587;</span></p>
                                <p class="accordion-location">${item.location}</p>
                                <button class="accordion-btn accordion-remove-btn" data-id=${item.id}>remove</button>
                                <button class="accordion-btn accordion-edit-btn" data-id=${item.id}>Edit</button>
                                <button class="accordion-btn accordion-view-btn" data-id=${item.id}>view</button>
                            </div>`;
	});
	listedProperties.append(list);
	addListenerToAccordion();
	addListenerToAccordionHideBtn();
	addListenerToAccordionRemoveBtn();
	addListenerToAccordionViewBtn();
};


function addListenerToAccordion(){
	const accordion = document.getElementsByClassName("accordion");
	const accordionContent = document.querySelectorAll(".accordion-content");
	Array.from(accordion).forEach((item) => {
		console.log(accordion)
		item.addEventListener("click", (e) => {
			accordionContent.forEach((content) => {
				content.style.maxHeight = "0rem";
				content.style.padding = "0rem";
				content.previousElementSibling.classList.remove("active");
			});
			if (e.target.nextElementSibling.style.maxHeight === "0rem") {
				e.target.nextElementSibling.style.maxHeight = "12rem";
				e.target.nextElementSibling.style.padding = ".4rem";
				e.target.classList.add("active");
				return;
			}
			e.target.nextElementSibling.style.maxHeight = "12rem";
			e.target.nextElementSibling.style.padding = ".4rem";
		});
	});
}
function addListenerToAccordionHideBtn() {
	Array.from(document.getElementsByClassName("accordion-hide-btn")).forEach(
		(element) => {
			element.addEventListener("click", (e) => {
				e.target.parentElement.parentElement.style.maxHeight = "0rem";
				e.target.parentElement.parentElement.style.padding = "0rem";
				e.target.parentElement.parentElement.previousElementSibling.classList.remove(
					"active"
				);
			});
		}
	);
}

function addListenerToAccordionViewBtn(){
	document.querySelectorAll('.accordion-view-btn').forEach((item)=>{
		item.addEventListener('click', (e)=>{
			const id = e.target.dataset.id;
			console.log(id);
			if (id) {
				console.log(typeof id);
				modal_product = products.filter((product) => {
					return product.id == id;
				});
				console.log(modal_product);
				openModal(modal_product);
			}
			})
	})
}


//deleting property
function addListenerToAccordionRemoveBtn(){
	document.querySelectorAll('.accordion-remove-btn').forEach(item=>{
		item.addEventListener('click',async (e)=>{
			console.log(e.target.parentElement.previousElementSibling);
			e.target.parentElement.previousElementSibling.remove();
			e.target.parentElement.remove();
			const response = await fetch('/delete/'+e.target.dataset.id);
		})
	})
}