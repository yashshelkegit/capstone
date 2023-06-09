let products;
const product = async () => {
	const response = await fetch("/products");
	const data = await response.json();
	products = data;
	displayProducts(products);
	console.log(products[0]._id);
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
range_otp.textContent = ` Rs. ${(range.value * 100000).toLocaleString()}`;

range.addEventListener("change", (e) => {
	// console.log(e.target.value * 100);
	range_arr = products.filter((product) => {
		return product.price <= e.target.value * 100000;
	});
	range_otp.textContent = ` Rs. ${e.target.value * 100000}`;
	displayProducts(range_arr);
});

search.addEventListener("keyup", (e) => {
	console.log(e.target.value);

	if (e.target.value === "") {
		mainContent.innerHTML = "<h2>Please enter some value</h2>";
		// search_arr = products;
		// displayProducts(search_arr);
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
				console.log(e.target.dataset.type)
				return value.type === e.target.dataset.id;
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
		const element = `<div class="product" data-id="${product._id}">
                <img src="${product.image}" alt="${product.type}" data-id="${product._id}"><br>
                <div class="detail">
				<span class="name">${product.type}</span><br>
                <span class="price">Rs. ${(product.price)}</span>
				</div>
                </div>`;
		const div = document.createElement("div");
		div.innerHTML += element;
		mainContent.append(div);
	});
};
//initial page

//for login page
// document
// 	.querySelector(".nav-login-btn")
// 	.addEventListener("click", async (e) => {
// 		const response = await fetch("/login");
// 		// const data = await response.json();
// 	});

//open modal box
const modal = document.querySelector(".modal");
const modal_img = document.querySelector(".modal-img");
const modal_name = document.querySelector(".modal-name");
const modal_price = document.querySelector(".modal-price");
const modal_desc = document.querySelector(".modal-desc");
const modal_contact = document.querySelector(".modal-contact-btn");
const email_btn = document.querySelector(".email-btn");
const save_btn = document.querySelector(".save-btn");
const customEmailBtn = document.querySelector(".custom-email");
const propertyLocation = document.querySelector(".property-location");

let modal_product;

mainContent.addEventListener("click", (e) => {
	const id = e.target.dataset.id;
	console.log(id);
	if (id) {
		console.log(typeof id);
		modal_product = products.filter((product) => {
			return product._id === id;
		});
		console.log(modal_product);
		openModal(modal_product);
	}
});

function openModal(product) {
	modal_img.src = modal_product[0].image;
	modal_name.textContent = `this ${modal_product[0].type} can be yours`;
	modal_price.textContent = `Rs. ${modal_product[0].price}`;
	modal_desc.textContent = modal_product[0].desc;
	modal_contact.dataset.contact = modal_product[0].contact;
	customEmailBtn.textContent = modal_product[0].contact;
	customEmailBtn.href = `mailto:${modal_product[0].contact}`;
	propertyLocation.textContent = modal_product[0].location;
	//returns undefined if not found
	console.log(cart.find((item) => item._id === modal_product[0]._id));
	if (cart.find((item) => item._id === modal_product[0]._id)) {
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
		email: e.target.dataset.contact,
	};
	const options = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(emailData),
	};
	const response = await fetch("/contact", options);
	console.log(`Email sent : ${response}`);
	modal.style.maxHeight = null;
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

async function authenticate() {
	const userInfo = localStorage.getItem("user");
	if (userInfo) {
		const { userName, password } = JSON.parse(userInfo);
		// showPropertyPage();
		parent.style.display = "none";
		add_parent.style.display = "block";
	} else {
		const response = await fetch("/login");
		console.log(response.body);
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
		cart = cart.filter((item) => item._id !== modal_product[0]._id);
		save_btn.textContent = "Save for review";
		//display products if removed from saved
		cartHeading ? displayProducts(cart, "cart") : null;
		modal.style.maxHeight = null;
		return;
	}
	//avoid duplicates
	//find returns undefined if not found
	if (!cart.find((item) => item._id === modal_product[0]._id)) {
		cart.push(
			displayed_products.find((item) => item._id === modal_product[0]._id)
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
const email_inp = document.getElementById("email");
const price_inp = document.getElementById("price");
const address_inp = document.getElementById("location");
const type_inp = document.getElementById("type");
const img_inp = document.getElementById("file");
const desc_inp = document.getElementById("desc");
const accountId_inp = document.getElementById("id");
const main_form = document.querySelector(".main-form");
const submitBtn = document.querySelector(".form-submit-btn");

main_form.addEventListener("submit", (e) => {
	e.preventDefault();
	const value = submitBtn.value;
	if (value === "submit") {
		console.log(submitBtn.value);
		main_form.submit();
	}
	if (value === "Update") {
		console.log(main_form);
		main_form.setAttribute("action", "/update-data/" + submitBtn.dataset.id);
		console.log(e.target.value);
		main_form.submit();
	}
});
//editing property
function addListenerToAccordionEditBtn() {
	document.querySelectorAll(".accordion-edit-btn").forEach((item) => {
		item.addEventListener("click", async (e) => {
			submitBtn.value = "Update";

			const dataSetId = e.target.dataset.id;
			const response = await fetch("/edit/" + dataSetId);
			const data = await response.json();
			console.log(data);
			const { accountId, contact, desc, location, price, type, _id } = data;
			email_inp.value = contact;
			price_inp.value = price;
			address_inp.value = location;
			type_inp.value = type;
			desc_inp.value = desc;
			accountId_inp.value = accountId;

			submitBtn.dataset.id = _id;
			console.log(submitBtn.dataset.id);
		});
	});
}

//fetch user properties
const userAccountId = document.getElementById("user-account-id");
document
	.querySelector(".check-property")
	.addEventListener("click", async (e) => {
		getUserProperty();
	});
async function getUserProperty() {
	const value = userAccountId.value;
	console.log(value);
	console.log(typeof value);
	if (value !== "") {
		const body = {
			accountId: value,
		};
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		};
		const response = await fetch("/user-property", options);
		const data = await response.json();
		console.log(data.length);
		if (data.length !== 0) {
			showListedProperties(data);
		} else {
			console.log("no properties found");
			alert("No Property found");
		}
	} else {
		console.log("please enter value");
		alert("Enter Account ID");
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
                                <button class="accordion-btn accordion-remove-btn" data-id=${item._id}>remove</button>
                                <button class="accordion-btn accordion-edit-btn" data-id=${item._id}>Edit</button>
                                <button class="accordion-btn accordion-view-btn" data-id=${item._id}>view</button>
                            </div>`;
	});
	listedProperties.append(list);
	addListenerToAccordion();
	addListenerToAccordionHideBtn();
	addListenerToAccordionRemoveBtn();
	addListenerToAccordionViewBtn();
	addListenerToAccordionEditBtn();
};

function addListenerToAccordion() {
	const accordion = document.getElementsByClassName("accordion");
	const accordionContent = document.querySelectorAll(".accordion-content");
	Array.from(accordion).forEach((item) => {
		console.log(accordion);
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
				console.log("acc hide btn");
				if (submitBtn.value === "Update") {
					console.log("acc hide btn");
					main_form.reset();
					submitBtn.value = "submit";
				}
				e.target.parentElement.parentElement.style.maxHeight = "0rem";
				e.target.parentElement.parentElement.style.padding = "0rem";
				e.target.parentElement.parentElement.previousElementSibling.classList.remove(
					"active"
				);
			});
		}
	);
}

function addListenerToAccordionViewBtn() {
	document.querySelectorAll(".accordion-view-btn").forEach((item) => {
		item.addEventListener("click", (e) => {
			const id = e.target.dataset.id;
			console.log(id);
			if (id) {
				console.log(typeof id);
				modal_product = products.filter((product) => {
					return product._id == id;
				});
				console.log(modal_product);
				openModal(modal_product);
			}
		});
	});
}

//deleting property
function addListenerToAccordionRemoveBtn() {
	document.querySelectorAll(".accordion-remove-btn").forEach((item) => {
		item.addEventListener("click", async (e) => {
			console.log(e.target.parentElement.previousElementSibling);
			console.log(e.target.dataset.id);
			e.target.parentElement.previousElementSibling.remove();
			e.target.parentElement.remove();
			const response = await fetch("/delete/" + e.target.dataset.id);
		});
	});
}
