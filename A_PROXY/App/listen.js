module.exports = function(app) {
    app.listen(3000,()=>{
        let d = new Date();
        let h = d.getHours();
        let m = d.getMinutes();
        console.log("Server Started on port " + 3000);
    })
}