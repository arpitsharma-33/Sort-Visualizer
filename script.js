myCanvas.width=1100;
myCanvas.height=450;

const n = 20;
const arr=[];

const StringHeight = myCanvas.height*0.35;

const  socks=[];
const margin =36;
const AvailableWidth = myCanvas.width-margin*2;
const spacing = AvailableWidth/n;
const colors = [
    "#FF4D4D",
    "#ac46a1",
    "#4a7c59",
    "#e63946",
    "#6f1d1b",
    "#023e8a",
    "#66E64D",
    "#3c096c",
    "#eca72c",
    "#000000",
    "#f72585",
    "#6f1d1b",   
    "#66E64D",
    "#da1b5b",
    "#66E64D",
    "#b56576",
    "#FF4D4D",
    "#99E6E6"
];

const sockColors = [];

const tweenLength = 22;

for(let i=0; i < n/2; i++){
    const t = i / (n/2 - 1);
    sockColors.push(colors[i]);
    sockColors.push(colors[i]);
    arr.push(lerp(0.3,1,t));
    arr.push(lerp(0.3,1,t));
}

for(let i=0; i<arr.length; i++){
    const j = Math.floor(Math.random()*arr.length);
    [arr[i],arr[j]] = [arr[j],arr[i]];
    [sockColors[i],sockColors[j]] = [sockColors[j],sockColors[i]];
}


for(let i=0;i<arr.length;i++){
    const u = Math.sin(i/(arr.length-1) * Math.PI);
    const x = i*spacing+spacing/2+margin;
    const y = StringHeight + u * margin;
    const height = myCanvas.height*0.4*arr[i];
    socks[i]= new Sock(x,y,height,sockColors[i]);
}


const character = new Character(socks[0].loc, socks[1].loc, myCanvas.height*0.20);


const moves = bubbleSort(arr);
moves.shift();

const ctx = myCanvas.getContext("2d");
const startTime = new Date().getTime();


animate();

function animate(){
    ctx.clearRect(0,0,myCanvas.width,myCanvas.height);

    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(0,StringHeight - margin * 0.4);
    ctx.bezierCurveTo(
        myCanvas.width/5 , StringHeight + margin,
        4*myCanvas.width/5 , StringHeight + margin,
        myCanvas.width,StringHeight - margin * 0.35
    );
    ctx.stroke();

    let changed = false;
    for(let i =0; i<socks.length; i++){
        changed = socks[i].draw(ctx) || changed;
        Physics.update(
            socks[i].particles,socks[i].segments
        );
    }


    changed = character.draw(ctx) || changed;


    if(new Date().getTime() - startTime > 1500 && !changed &&  moves.length > 0){
        const nextMove = moves.shift();
        const [i,j] = nextMove.indices;
        if(nextMove.type == "swap"){
            socks[i].moveTo(socks[j].loc, tweenLength);
            socks[j].moveTo(socks[i].loc, tweenLength);
            character.moveTo(socks[j].loc,socks[i].loc, false, tweenLength);
            [socks[i],socks[j]] = [socks[j],socks[i]];
        }else { // character is moving
            character.moveTo(socks[i].loc, socks[j].loc, true, tweenLength);
        }
    }

    requestAnimationFrame(animate);
}



function bubbleSort(arr){
    const moves = [];
    let n = arr.length;
    let left = 1;
    do{
        var swapped = false;
        if((n-left) % 2 == 1){
            for (let i = left; i < n; i++) {
                moves.push({
                    indices:[i-1,i],
                    type:"comparison"
                });
                if(arr[i-1]>arr[i]){
                    swapped = true;
                    [arr[i-1],arr[i]] = [arr[i],arr[i-1]];
                    moves.push({
                        indices:[i-1,i],
                        type:"swap"
                    });
                }           
            }
            n--;
        }else{
            for (let i = n-1; i >= left; i--){
                moves.push({
                    indices:[i-1,i],
                    type:"comparison"
                });
                if(arr[i-1]>arr[i]){
                    swapped = true;
                    [arr[i-1],arr[i]] = [arr[i],arr[i-1]];
                    moves.push({
                        indices:[i-1,i],
                        type:"swap"
                    });
                }           
            }
            left++;
        }
    }while(swapped);
    return moves;
}

