const form = document.getElementById('form');
const display = document.getElementById('display');
const table=document.getElementById('table');
const addbtn = document.getElementById('add');
const updatebtn = document.getElementById('update');
const clearbtn=document.getElementById('clear');
const loader=document.getElementById('loader');
const name=document.getElementById('name');
const color=document.getElementById('color');
const category=document.getElementById('category');
const price=document.getElementById('price');
const nameerror=document.getElementById('name-error');
const colorerror=document.getElementById('color-error');
const categoryerror=document.getElementById('category-error');
const priceerror=document.getElementById('price-error');

// let id=null;
// const editbtn=document.getElementById('edit');
// const deletebtn=document.getElementById('delete');

const baseurl = 'https://crudnext.onrender.com/api/products';

function clearParams(){
    const params = new URLSearchParams(window.location.search);
    params.delete("id"); 
    window.history.pushState({}, "", `${window.location.pathname}`);
}

function validation(){
    // nameerror.classList.add('hidden')
    // colorerror.classList.add('hidden')
    // categoryerror.classList.add('hidden')
    // priceerror.classList.add('hidden')
    let isValid = true;
    if (name.value === "") {
        nameerror.classList.remove('hidden')
        isValid = false;
    }
    if (color.value === "") {
        colorerror.classList.remove('hidden')
        isValid = false;
    }
    if (category.value === "") {
        categoryerror.classList.remove('hidden')
        isValid = false;
    }
    if (price.value === "") {
        priceerror.classList.remove('hidden')
        isValid = false;
    }
    if (isValid) {
        return true;
    }
    else {
        return false;
    }
}


function showloader(){
    loader.classList.remove('hidden')
    loader.classList.add("flex")
    form.classList.add('hidden')
    display.classList.add('hidden')
    table.classList.add('hidden')
}
function hideloader(){
    loader.classList.add('hidden')
    form.classList.remove('hidden')
    display.classList.remove('hidden')
    table.classList.remove('hidden')
}


function handleSubmit(e) {
    nameerror.classList.add('hidden')
    colorerror.classList.add('hidden')
    categoryerror.classList.add('hidden')
    priceerror.classList.add('hidden')
    e.preventDefault();
    const params = new URLSearchParams(window.location.search); 
    const id =params.get("id"); 
    console.log(id)
    if(!validation()){
        return;
    }

    if (id) {
        console.log("am i coming here")
        updateDataMutation(id)
    }
    else {
        addDataMutation()
    }
   
    // nameerror.classList.add('hidden')
    // colorerror.classList.add('hidden')
    // categoryerror.classList.add('hidden')
    // priceerror.classList.add('hidden')
}


// api hit for adding the data
async function addDataMutation() {
    showloader()
    try {
        const url = `${baseurl}`;
        const name = document.getElementById('name').value;
        const color = document.getElementById('color').value;
        const category = document.getElementById('category').value;
        const price = document.getElementById('price').value;
        // console.log(name,color,category,price)

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                color: color,
                category: category,
                price: price,
            })

        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        Swal.fire({
            title: "Added!",
            icon: "success",
        });

        form.reset()
        getData()

    } catch (error) {
        console.log(error);
        alert("Some Error occurred during adding the data :(")
    }finally{
        hideloader()
    }
}

// api hit for updating the data
async function updateDataMutation(id) {
    showloader()
    try {
        const name = document.getElementById('name').value;
        const color = document.getElementById('color').value;
        const category = document.getElementById('category').value;
        const price = document.getElementById('price').value;
        const url = `${baseurl}/${id}`;
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                color: color,
                category: category,
                price: price,
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        Swal.fire({
            title: "Updated!",
            icon: "success",
        });
        
        form.reset()
        clearParams()
        updatebtn.className = 'hidden'
        clearbtn.className='hidden'
        addbtn.className = 'shadow bg-green-500 visible hover:bg-green-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer'
        getData()
      
    } catch (error) {
        console.log(error);
    }finally{
        hideloader()
    }
}


form.addEventListener('submit', (e) => handleSubmit(e));


clearbtn.addEventListener('click',()=>{
    nameerror.classList.add('hidden')
    colorerror.classList.add('hidden')
    categoryerror.classList.add('hidden')
    priceerror.classList.add('hidden')
    form.reset();
    updatebtn.className = 'hidden'
    clearbtn.className='hidden'
    addbtn.className = 'shadow bg-green-500 visible hover:bg-green-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer' 
    clearParams()
})



async function getData() {
    showloader()
    try {
        const baseurl = 'https://crudnext.onrender.com/api/products';
        const url = `${baseurl}`;

        const response = await fetch(url, {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data)
        const products = data.result;
        display.innerHTML = products.map(d => (`
            <tr class="text-center">
                <td class="border border-black px-5 py-2">${d.name}</td>
                <td class="border border-black px-5 py-2">${d.color}</td>
                <td class="border border-black px-5 py-2">${d.category}</td>
                <td class="border border-black px-5 py-2">${d.price}</td>
                <td class="border border-black px-5 py-2"><button onclick="editData('${d._id}')" id="edit" class="bg-green-500 py-2 px-4 border rounded outline-none text-white font-bold cursor-pointer disabled:cursor-not-allowed" type="button">Edit</button></td>
                <td class="border border-black px-5 py-2"><button onclick="removeData('${d._id}')" id="delete" class="bg-red-500 py-2 px-4 border rounded outline-none text-white font-bold cursor-pointer disabled:cursor-not-allowed" type="button">Delete</button></td>
            </tr>
            `
        )).join('');
    } catch (error) {
        console.log(error);
    }finally{
        hideloader()
    }
}

// getData()
// deletebtn?.addEventListener('click',removeData);
async function removeData(id) {
    // const confirmdelete=confirm("Delete:");
    // if(!confirmdelete){
    //     return
    // }
    
    showloader()
    try {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        })
        console.log("sweet alert")
       
        if (result.isConfirmed) {
            const baseurl = 'https://crudnext.onrender.com/api/products';
            const url = `${baseurl}/${id}`;
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log("sweet alert")
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
            console.log("sweet alert")
            getData()
            // console.log('hello')
            // console.log(data)
        }
    } catch (error) {
        console.log(error);
    }finally{
        hideloader()
    }
}

// removeData()

// getData()


async function editData(id) {
    showloader()
    nameerror.classList.add('hidden')
    colorerror.classList.add('hidden')
    categoryerror.classList.add('hidden')
    priceerror.classList.add('hidden')
    try {   
        
        const baseurl = 'https://crudnext.onrender.com/api/products';
        const url = `${baseurl}/${id}`;

       
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // getData()
        const products = data.result;
        console.log('hello')
        console.log(products);
        id = products._id;
        // console.log(id)
        console.log(products._id)

        const editbtn = document.getElementById('edit');
        const deletebtn = document.getElementById('delete');

        document.getElementById('name').value = products.name;
        document.getElementById('color').value = products.color;
        document.getElementById('category').value = products.category;
        document.getElementById('price').value = products.price;

        const params = new URLSearchParams(window.location.search); 
        params.set("id", id); 
        window.history.pushState({}, "", `${window.location.pathname}?${params.toString()}`);

        document.querySelectorAll(`#edit`).forEach(ele => {
            ele.disabled = false;
        })
        document.querySelectorAll(`#delete`).forEach(ele => {
            ele.disabled = false;
        })

        editbtn.disabled = true;
        deletebtn.disabled = true;



        // updatebtn.textContent='Update';
        updatebtn.className = 'shadow bg-green-500 visible hover:bg-green-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer'
        clearbtn.className = 'shadow bg-green-500 visible hover:bg-green-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer'
        addbtn.className = 'hidden'


        // console.log(data)
        // const btn1 = document.createElement('button');
        // btn1.innerText = 'Update';
        // btn1.className = 'update';
        // add.appendChild(btn1);

    } catch (error) {
        console.log(error);
    }finally{
        hideloader()
    }
}



const updateInfo = {
    name: document.getElementById('name').value,
    color: document.getElementById('color').value,
    // category:document.getElementById('category').value,
    // price:document.getElementById('price').value
}
// console.log(updateInfo)

getData()