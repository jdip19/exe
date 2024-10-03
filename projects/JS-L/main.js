let i=1,j=1;
let op="";


for(i;i<=9;i++){
    for(j;j<=3;j++)
    {
        op+=j+" ";
    }
    op+="\n";
}

document.getElementById("op").textContent=op;
