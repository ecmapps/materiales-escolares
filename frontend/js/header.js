document.getElementById('tema').addEventListener('change',(e)=>{
    const valorSeleccionado = e.target.value;
    console.log("Valor: "+valorSeleccionado);
    localStorage.setItem('tema',valorSeleccionado);
});