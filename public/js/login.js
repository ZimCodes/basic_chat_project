const form = document.querySelector('form');

form.addEventListener('submit',(e)=>{
    const inputs = form.elements;
    sessionStorage.setItem("chatName",inputs['username'].value ? inputs['username'].value:'Koala Bear');
});