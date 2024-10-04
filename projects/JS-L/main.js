let i=1,j=1,k=2;
let op="";


for(i;i<=3;i++){
    for(j;j<=k;j++)
    {
        op+=j+" ";
    }
   
    op+="\n";
    k=k+2;
}

document.getElementById("op").textContent=op;
