let i=1,j=1,k=3;
let op="";


for(i;i<=3;i++){
    for(j;j<=k;j++)
    {
        op+=j+" ";
    }
   
    op+="\n";
    k=k+3;
}

document.getElementById("op").textContent=op;
