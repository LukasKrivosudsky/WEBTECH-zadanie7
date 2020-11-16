var imgSource;
var imageOrder = "";

$(document).ready(function(){
    //Erasing all cookies if needed...
    //eraseCookie();
    //Loading images from json file on web
    $.getJSON("./json/photos.json", function(json) {
        imgSource = json;
        loadImg(imgSource,"#picture");        
    });
    //Drag and drop function with update checking every time picture was dropped
    $(function() { 
        $("#picture").sortable({ 
            update: function(event, ui) { 
                    getIdsOfImages(); 
                }       
        });
    }); 
});


function loadImg(imgSource,target){
    //getting cookie and checking if cookie exists
    var cookie = getCookie("imgOrder");
    if(cookie != null && cookie.length !=0){
        //splitting cookie into string
        //containg integers indexes of new order of images
        let newOrder = cookie.split(":");
        //loading images based on new order
        for(i =0; i < newOrder.length; i++)
        {
            //choosing only 1 photo from file picked by newOrder index
            let currentPhoto = imgSource.photos[newOrder[i]];
            if (currentPhoto == null)
                continue;
            loadImgFromJson(currentPhoto,newOrder[i],target);         
        }
    }
    else{
        //if cookie does not exist, images are load defaultly from file in initial order
        for(var i=0; i < imgSource.photos.length; i++){
            loadImgFromJson(imgSource.photos[i],i,target);
            imageOrder += i + ":";
        }
        //setting cookie with initial order
        setCookie("imgOrder",imageOrder,7);
        }
    
}

function loadImgFromJson(photo,index,target){
    //creating new Image and setting needed attributes as source, alternate text, id and class.
    let img = new Image();
    
    let src = photo.src;
    //console.log(photo.src);
    img.setAttribute("src", src);
    img.setAttribute("alt", photo.title);
    img.setAttribute("id",index);
    img.setAttribute("class","pic");
   
    //creating new <a> tag needed for lightbox
    //setting all needed data- elements for lightbox
    let aTagId="a-" + index;
    $(target).append('<a href="' + src + '" data-title="' + photo.title  + ". <br>" + photo.description  + '" data-lightbox="castleGallery" id="' + aTagId + '" data-alt="' + photo.title  + '"></a>');
    //Appending image to created a element
    document.getElementById(aTagId).appendChild(img);
    
}

function searchImg(){  
    //loading text input from website
    var searchString = document.getElementById("myInput").value;
    //setting all letters to lower case for easier searching, deleting all img for better modal show
    document.getElementById("picture").innerHTML= "";
    var filter = searchString.toLowerCase();
    var cookie = getCookie("imgOrder");
    if(cookie != null && cookie.length !=0){
        //splitting cookie into useful string
        //containg integers indexes of new order of images
        let newOrder = cookie.split(":");
        //loading images based on new order
        for(i =0; i < newOrder.length-1; i++)
        {
            //choosing only 1 photo from file picked by newOrder index
            let currentPhoto = imgSource.photos[newOrder[i]];
            //console.log(newOrder.length);
            //loop through images text to see if it contains input value, if yes img will be shown on page if not img won't be displayed
            if (currentPhoto.title.toLowerCase().includes(filter) || searchString==null){
                loadImgFromJson(currentPhoto,newOrder[i],"#picture");
            }     
        }
    }
    
}


//getting new order of images after drag and drop
function getIdsOfImages() { 
    var values = ""; 
    // loading new order based on id
    $('.pic').each(function (index) { 
        values += $(this).attr("id") + ":"; 
    });
    //loading old older
    //needed if length of values is < cookie length
    var cookie = getCookie("imgOrder");
    console.log(cookie); 
    //setting cookie with new Order
    if(values.length < cookie.length){
        //declaring newArray which will be new order
        var newArray = "";
        //iterator for values string, cannot be same as for cookie 
        var j = 0;
        //iterator i is increased by 2 because cookie is string and has separator bewteen each number
        for(var i = 0; i < cookie.length;i+=2){
            //checking if value contain elements from cookie, if not add this value
            if(!values.includes(cookie[i])){
                newArray+= cookie[i] +":";
            }
            //if cookie is in value, add it to newArray and increment j counter
            else{
                newArray += values[j]+":";
                j+=2;
            }
        }
        console.log(newArray);
        setCookie("imgOrder",newArray,7);
    }
    else if(values!= null || values.length!=0){
        setCookie("imgOrder",values,7);
    }
    
    
} 




function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
}
  


function eraseCookie(){
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}


//modal gallery without lightbox
/*
var slideIndex = 0;
var modalOrder = getCookie("imgOrder").split(":");
function openModal(){
    document.getElementById("myModal").style.display = "block"; 
    loadImgFromJsonModal(imgSource,"modalImg");
    
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
    document.getElementById("modalImg").remove();
    var modal  = document.createElement('div');
    modal.id = "modalImg";
    modal.classList.add("center");
    document.getElementById("modal-content").appendChild(modal);
}*/


/*
// Next/previous controls
function plusSlides(n) {
    
    showSlides(slideIndex+=n);
}

// Thumbnail image controls
function currentSlide(n) {
    slideIndex = parseInt(modalOrder[n]);
    
    console.log(slideIndex);
    showSlides(slideIndex);
}

function showSlides(n) {
    let cookie = getCookie("imgOrder");
    let newOrder = cookie.split(":");
    var i;
    var slides = document.getElementsByClassName("picModal");
    if (n > slides.length-1) {slideIndex = 0;}
    if (n < 0) {slideIndex = slides.length-1;}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[newOrder[slideIndex]].style.display = "block";
}
function loadImgFromJsonModal(imgSource,target){
    //creating new Image and setting needed attributes as source, alternate text, id and class.
    for(var i=0; i < imgSource.photos.length; i++){
    let img = new Image();
    img.setAttribute("src", imgSource.photos[i].src);
    img.setAttribute("alt", imgSource.photos[i].title);
    img.setAttribute("class","picModal");

    img.style.display = "none";
    //Appending image to given div element
    document.getElementById(target).appendChild(img);
    }
}*/













