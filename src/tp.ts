let get_notification_block = document.querySelector('.text_notification') as HTMLElement;
let getTime = new Date().getHours();
// let greeting =
//     getTime >= 5 && getTime < 12
//     ? "Good Morning"
//     : getTime >= 12 && getTime < 18
//     ? "Good Afternoon"
//     : "Good evening";
//     get_notification_block.innerHTML = `${greeting}, <span class = 'emit'>{user-name!}</span> To start using this app you have to choose shop from the list which contains the most popular Belarusian shops. Well, to open shop list click hamburger in the corver and click "Shop Catalog", there you can choose shop that you like, enjoy ❤️`;




let getShopVariants = Array.from(document.getElementsByClassName('dropdown-item') as HTMLCollectionOf<HTMLDivElement>);




for (let i = 0; i < getShopVariants.length; i++) {
    getShopVariants[i].addEventListener('click', ()=>{
        switch(i){
            case 0:
                GeneratingShopInf('https://api.npoint.io/b12c4862f71d966e5b09');
                SetCurrentShopIcon(0);
                break;
            case 1:
                GeneratingShopInf('https://api.npoint.io/81672ce55f2217a984dd');
                SetCurrentShopIcon(1);
                break;
            case 2:
                GeneratingShopInf('https://api.npoint.io/ea1bfa229843efc695ef');
                SetCurrentShopIcon(2);
                break
        }
    });
}


function LoadingScreen(){
    let getLoaderBlock = document.querySelector('.loader') as HTMLElement;
    console.log(getLoaderBlock);

    getLoaderBlock.classList.remove('hide');

    setTimeout(()=>{
        getLoaderBlock.classList.remove('loader_display_set');
        getLoaderBlock.classList.add('hide');
    }, 2000);

    getLoaderBlock.classList.add('loader_display_set');
}


function SetCurrentShopIcon(shop_index:number){
    let shopPersonChooseBlock = document.querySelector('.shop_user_choose') as HTMLElement;
    shopPersonChooseBlock.innerHTML = '';
    let img = document.createElement('img');
    switch(shop_index){
        case 0:
            img.src = 'shop icons/header-Green_logo_color.png';
            break;
        case 1:
            img.src = 'shop icons/e-dostavka_new.png';
            break;
        case 2:
            img.src = 'shop icons/santa-logo.png';
            break;
    }
    shopPersonChooseBlock.appendChild(img);

    LoadingScreen();
}




function GeneratingShopInf(shopDataAPI:string){
    
    let content_block = document.querySelector('.content') as HTMLElement;
    let main_content_block = content_block.querySelector('.row') as HTMLElement

    let productInputToSearch = document.querySelector('#product_input') as HTMLInputElement;
    let ProductGrid = (document.querySelector('.content') as HTMLInputElement).childNodes[1].childNodes[1] as HTMLElement;

    fetch(shopDataAPI)
    .then(res => res.json())
    .then(json => {
        let [start_size, jsonToMass, product_counter, end_search_counter, choosenBtns] = [
            0, json['products'],0, 5,
            Array.from(document.getElementsByClassName('btn-primary') as HTMLCollectionOf<HTMLElement>)
        ];

        let search_mass:object[] = [];

        main_content_block.innerHTML = '';

        GenProducts(start_size, jsonToMass, choosenBtns);


        productInputToSearch.addEventListener('keyup', ()=>{
            [search_mass, product_counter, end_search_counter, ProductGrid.innerText] = [[], 0, 0, ''];

            let filterValue = productInputToSearch.value;
            for (let i = 0; i < json['products'].length; i++){

                if((json['products'][i]['product'].toUpperCase().indexOf(filterValue.toUpperCase()) > -1)){
                    if(product_counter < 6){
                        CardCreation(json['products'][i]['img'], json['products'][i]['product'], json['products'][i]['price']);
                        product_counter += 1;
                    }
                    else{
                        search_mass.push(json['products'][i]);
                    }
                }

            }


            console.log(search_mass);


            window.onscroll = ()=>{
                if(((window.innerHeight + window.scrollY) >= document.body.offsetHeight) && search_mass.length !== 0 && search_mass.length >= end_search_counter){
                    GenProducts(end_search_counter += 5, search_mass, choosenBtns);
                }
            }


            if(filterValue === ''){
                [start_size, ProductGrid.innerText] = [0 , ''];
                GenProducts(start_size, jsonToMass, choosenBtns);
                AddingProduct(start_size, jsonToMass, choosenBtns);
                console.log(choosenBtns);
            }
        })

        AddingProduct(start_size, jsonToMass, choosenBtns);



    })


    function GenProducts(products_to_gen:number, json:object[], mass_of_chooseBtns:HTMLElement[]){
        if(products_to_gen + 5 > json.length && json.length > products_to_gen){
            for (let i = products_to_gen; i < json.length; i++){
                let getObj = json[i];
                CardCreation(getObj['img' as keyof typeof getObj], getObj['product' as keyof typeof getObj], getObj['price' as keyof typeof getObj])
            }
        }
        else if(products_to_gen + 5 > json.length && json.length < products_to_gen){
            for (let i = 0; i < json.length; i++){
                let getObj = json[i];
                CardCreation(getObj['img' as keyof typeof getObj], getObj['product' as keyof typeof getObj], getObj['price' as keyof typeof getObj])
            }
        }
        else{
            for (let i = products_to_gen; i < products_to_gen + 5; i++){
                let getObj = json[i];
                CardCreation(getObj['img' as keyof typeof getObj], getObj['product' as keyof typeof getObj], getObj['price' as keyof typeof getObj])
            }
        }


        mass_of_chooseBtns = Array.from(document.getElementsByClassName('btn-primary') as HTMLCollectionOf<HTMLElement>);

        for (let i= 0; i < mass_of_chooseBtns.length; i++){
            mass_of_chooseBtns[i].addEventListener('click', ()=>{

                let toast = document.querySelector('#liveToast') as HTMLElement;

                toast.classList.add('show_block');

                setTimeout(()=>{
                    toast.classList.add('close_block');

                    setTimeout(()=>{
                        toast.classList.remove('show_block');
                        toast.classList.remove('close_block');
                    }, 1000);
                }, 2000)
            });
        }
    }



    function AddingProduct(start_size:number, json:object[], mass_of_chooseBtns:HTMLElement[]){
        window.onscroll = ()=>{
            if (((window.innerHeight + window.scrollY) >= document.body.offsetHeight)){
                GenProducts(start_size += 5, json, mass_of_chooseBtns);
            }
        };
    }




    function CardCreation(img:string, product_name:string, price:string){
        main_content_block.innerHTML += 
        `
        <div class = 'col-sm-12 col-md-6 col-lg-4 col-xl-3 card_wrapper'>
                <div class="card">
                <div class = 'card_wrapper'>
                <div class = 'picture_wrapper'>
                    <img src="${img}" class="card-img-top" alt="13">
                </div>

                <div class="card-body">
                <h5 class="card-title">${product_name}</h5>
                <p class="card-text">${price}</p>

                <div class = 'manipulation_block'>
                    <div class = 'accept_btn'>
                    <button type="button" class="btn btn-primary" id="liveToastBtn">Get it!</button>
                    </div>
                    <div class = 'counter_input_wrapper'>
                        <div class = 'arrow_up'><img src="shop icons/186407_arrow_up_icon.png" alt="arrow_up"></div>
                        <div class = 'view_counter_block'>0</div>
                        <div class = 'arrow_down'><img src="shop icons/186411_arrow_down_icon.png" alt="arrow_down"></div>
                    </div>
                </div>
                </div>
                </div>
            </div>

        `;
    }
}