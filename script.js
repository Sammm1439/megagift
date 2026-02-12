const text = "MEGAGIFT";

const megagift = document.getElementById("megagift");

const startBtn = document.getElementById("startBtn");

let animationStarted = false;



// LETTER ANIMATION
function createLetters(){

    megagift.innerHTML="";

    text.split("").forEach((char,index)=>{

        const span=document.createElement("span");

        span.className="letter";

        span.innerText=char;

        megagift.appendChild(span);



        setTimeout(()=>{

            span.animate([

                {

                    opacity:0,

                    transform:"translateY(50px) scale(0.5)"

                },

                {

                    opacity:1,

                    transform:"translateY(0px) scale(1)"

                }

            ],{

                duration:600,

                fill:"forwards",

                easing:"ease-out"

            });

        }, index*150);

    });

}



createLetters();




// START CLICK
startBtn.onclick=()=>{

    if(animationStarted) return;

    animationStarted=true;

    shootGun();

    setTimeout(()=>{

        explodeTextHearts();

    },300);

};




// GUN SHOOT
function shootGun(){

    const gun=document.getElementById("gun");

    const rect=gun.getBoundingClientRect();



    gun.animate([

        {transform:"translateY(-50%) rotate(0deg)"},

        {transform:"translateY(-50%) rotate(-25deg)"},

        {transform:"translateY(-50%) rotate(0deg)"}

    ],{

        duration:300

    });



    setTimeout(()=>{

        gun.style.opacity="0";

        explodeGunHearts(rect);

    },250);

}




// GUN HEART EXPLOSION
function explodeGunHearts(rect){

    const centerX=rect.left+rect.width/2;

    const centerY=rect.top+rect.height/2;



    for(let i=0;i<80;i++){

        const heart=document.createElement("div");

        heart.className="heart";



        const size=30+Math.random()*50;



        heart.innerHTML=

        `<img src="heart.png" style="width:${size}px;height:${size}px;">`;



        heart.style.left=centerX+"px";

        heart.style.top=centerY+"px";



        document.body.appendChild(heart);



        const angle=Math.random()*Math.PI*2;

        const distance=500+Math.random()*900;



        heart.animate([

            {transform:"translate(0,0)",opacity:1},

            {

                transform:`translate(${Math.cos(angle)*distance}px,${Math.sin(angle)*distance}px)`,

                opacity:0

            }

        ],{

            duration:2500,

            easing:"ease-out"

        });



        setTimeout(()=>heart.remove(),2500);

    }

}




// TEXT HEART EXPLOSION
function explodeTextHearts(){

    const rect=megagift.getBoundingClientRect();



    const centerX=rect.left+rect.width/2;

    const centerY=rect.top+rect.height/2;



    megagift.style.opacity="0";



    for(let i=0;i<150;i++){

        const heart=document.createElement("div");

        heart.className="heart";



        const size=40+Math.random()*70;



        heart.innerHTML=

        `<img src="heart.png" style="width:${size}px;height:${size}px;">`;



        heart.style.left=centerX+"px";

        heart.style.top=centerY+"px";



        document.body.appendChild(heart);



        const angle=Math.random()*Math.PI*2;

        const distance=700+Math.random()*1400;



        heart.animate([

            {transform:"translate(0,0)",opacity:1},

            {

                transform:`translate(${Math.cos(angle)*distance}px,${Math.sin(angle)*distance}px)`,

                opacity:0

            }

        ],{

            duration:3000,

            easing:"ease-out"

        });



        setTimeout(()=>heart.remove(),3000);

    }



    // REDIRECT
    setTimeout(()=>{

        window.location.href="page2.html";

    },3500);

}
